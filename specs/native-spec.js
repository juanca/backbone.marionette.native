Native = require('../backbone.native.entry.js');

/**
 * Unit tests for the behavior of Backbone.Native without relying on Backbone.
 */

describe('Backbone.Native', function(){
    "use strict";

    var evt, one, two, three, oneSpy, twoSpy, threeSpy;
    var orig$, origBackboneNative;
    var $;

    beforeEach(function(){
        this.element.innerHTML =
            '<div class="one">' +
            '    <div class="two">' +
            '        <span class="three">' +
            '        </span>' +
            '    </div>' +
            '</div>';

        one = this.element.querySelector('.one');
        two = one.querySelector('.two');
        three = two.querySelector('.three');

        oneSpy = jasmine.createSpy('one');
        twoSpy = jasmine.createSpy('two');
        threeSpy = jasmine.createSpy('three');

        orig$ = window.$;
        $ = origBackboneNative = Native;
    });

    afterEach(function(){
        // Restore the originals in case the tests moved them.
        window.$ = orig$;
        window.Backbone.Native = origBackboneNative;
    });

    describe('event management', function(){
        it('should (un)bind events directly', function(){
            $(one).on('click', oneSpy);

            evt = this.createAndFireEvent(two, 'click');

            expect(oneSpy).toHaveBeenCalledWith(evt, one);
            oneSpy.calls.reset();

            $(one).off('click', oneSpy);

            evt = this.createAndFireEvent(two, 'click');

            expect(oneSpy).not.toHaveBeenCalled();
        });

        it('should bind events with delegation', function(){
            $(one).on('click', '.two', twoSpy);

            evt = this.createAndFireEvent(two, 'click');

            expect(twoSpy).toHaveBeenCalledWith(evt, two);
            twoSpy.calls.reset();

            $(one).off('click', '.two', twoSpy);

            evt = this.createAndFireEvent(two, 'click');

            expect(twoSpy).not.toHaveBeenCalled();
        });

        it('should stop propagation', function(){
            $(one).on('click', oneSpy);
            $(two).on('click', twoSpy);
            twoSpy.and.callFake(function(evt){
                evt.stopPropagation();
            });

            evt = this.createAndFireEvent(two, 'click');

            expect(evt.stopPropagation).toHaveBeenCalled();
            expect(twoSpy).toHaveBeenCalledWith(evt, two);
            expect(oneSpy).not.toHaveBeenCalled();
            $(two).off('click', twoSpy);
            twoSpy.calls.reset();

            evt = this.createAndFireEvent(two, 'click');

            expect(evt.stopPropagation).not.toHaveBeenCalled();
            expect(twoSpy).not.toHaveBeenCalled();
            expect(oneSpy).toHaveBeenCalledWith(evt, one);
        });

        it('should prevent default', function(){
            $(one).on('click', oneSpy);
            oneSpy.and.callFake(function(evt){
                evt.preventDefault();
            });

            evt = this.createAndFireEvent(two, 'click');

            expect(oneSpy).toHaveBeenCalledWith(evt, one);
            expect(evt.preventDefault).toHaveBeenCalled();
        });

        it('should stop propagation and default with false', function(){
            $(one).on('click', oneSpy);
            $(two).on('click', twoSpy);
            twoSpy.and.callFake(function(){
                return false;
            });

            evt = this.createAndFireEvent(two, 'click');

            expect(twoSpy).toHaveBeenCalledWith(evt, two);
            expect(oneSpy).not.toHaveBeenCalled();
            expect(evt.preventDefault).toHaveBeenCalled();
            expect(evt.stopPropagation).toHaveBeenCalled();
        });

        it('should stop propagation and default with false when delegated', function(){
            $(one).on('click', '.two', twoSpy);
            $(two).on('click', '.three', threeSpy);
            threeSpy.and.callFake(function(){
                return false;
            });

            evt = this.createAndFireEvent(three, 'click');

            expect(threeSpy).toHaveBeenCalledWith(evt, three);
            expect(twoSpy).not.toHaveBeenCalled();
            expect(evt.preventDefault).toHaveBeenCalled();
            expect(evt.stopPropagation).toHaveBeenCalled();
        });

        it('should unbind events by namespace', function(){
            $(one).on('click.name', oneSpy);
            $(one).on('click.name', twoSpy);
            $(one).on('click.name2', threeSpy);

            evt = this.createAndFireEvent(one, 'click');

            expect(oneSpy).toHaveBeenCalledWith(evt, one);
            expect(twoSpy).toHaveBeenCalledWith(evt, one);
            expect(threeSpy).toHaveBeenCalledWith(evt, one);
            oneSpy.calls.reset();
            twoSpy.calls.reset();
            threeSpy.calls.reset();

            $(one).off('.name');

            evt = this.createAndFireEvent(one, 'click');

            expect(oneSpy).not.toHaveBeenCalled();
            expect(twoSpy).not.toHaveBeenCalled();
            expect(threeSpy).toHaveBeenCalledWith(evt, one);
        });

        it('should unbind events by callback', function(){
            $(one).on('mousedown', oneSpy);
            $(one).on('mouseup', oneSpy);
            $(one).on('mousedown', twoSpy);
            $(one).on('mouseup', twoSpy);

            evt = this.createAndFireEvent(one, 'mousedown');
            evt = this.createAndFireEvent(one, 'mouseup');

            expect(oneSpy.calls.count()).toBe(2);
            expect(twoSpy.calls.count()).toBe(2);
            oneSpy.calls.reset();
            twoSpy.calls.reset();

            $(one).off(null, oneSpy);

            evt = this.createAndFireEvent(one, 'mousedown');
            evt = this.createAndFireEvent(one, 'mouseup');

            expect(oneSpy).not.toHaveBeenCalled();
            expect(twoSpy.calls.count()).toBe(2);
        });

        it('should unbind events by type', function(){
            $(one).on('click.name', oneSpy);
            $(one).on('click.name2', twoSpy);
            $(one).on('mousedown.name', threeSpy);

            evt = this.createAndFireEvent(one, 'click');
            evt = this.createAndFireEvent(one, 'mousedown');

            expect(oneSpy).toHaveBeenCalled();
            expect(twoSpy).toHaveBeenCalled();
            expect(threeSpy).toHaveBeenCalled();
            oneSpy.calls.reset();
            twoSpy.calls.reset();
            threeSpy.calls.reset();

            $(one).off('click');

            evt = this.createAndFireEvent(one, 'click');
            evt = this.createAndFireEvent(one, 'mousedown');

            expect(oneSpy).not.toHaveBeenCalled();
            expect(twoSpy).not.toHaveBeenCalled();
            expect(threeSpy).toHaveBeenCalled();
        });
    }); // describe('event management')

    describe('jQuery interface', function(){
        var inst;

        it('should create an instance when called as a function', function(){
            inst = $(one);

            expect(inst).toEqual(jasmine.any($));
        });

        it('should create an empty set when called with nothing', function(){
            inst = $();

            expect(inst.length).toBe(0);
            expect(inst[0]).toBeUndefined();
        });

        it('should create an empty set when called with missing id', function(){
            inst = $('#some-random-id');

            expect(inst.length).toBe(0);
            expect(inst[0]).toBeUndefined();
        });

        it('should create a new element when passed HTML', function(){
            inst = $('<div class="hi">Content</div>');

            expect(inst.length).toBe(1);
            expect(inst[0].nodeName).toBe('DIV');
            expect(inst[0]).toHaveClass('hi');
            expect(inst[0]).toHaveText('Content');
        });

        it('should query a selector when not passed HTML', function(){
            inst = $('.two', this.element.ownerDocument);

            expect(inst.length).toBe(1);
            expect(inst[0]).toBe(two);
        });

        it('should create an instance with the argument otherwise', function(){
            inst = $(two);

            expect(inst.length).toBe(1);
            expect(inst[0]).toBe(two);
        });

        it('should create an instance with a window object', function(){
            inst = $(window);

            expect(inst.length).toBe(1);
            expect(inst[0]).toBe(window);
        });

        it('should remove recursively', function(){
            $(one).on('click', oneSpy);
            $(two).on('click', twoSpy);
            $(three).on('click', threeSpy);

            $(one).remove();

            expect(one.parentElement).toBeNull();
            this.element.appendChild(one);

            evt = this.createAndFireEvent(three, 'click');

            expect(oneSpy).not.toHaveBeenCalled();
            expect(twoSpy).not.toHaveBeenCalled();
            expect(threeSpy).not.toHaveBeenCalled();
        });

        it('should add/remove events', function(){
            $(one).on('click', oneSpy);

            evt = this.createAndFireEvent(one, 'click');

            expect(oneSpy).toHaveBeenCalledWith(evt, one);
            oneSpy.calls.reset();

            $(one).off('click', oneSpy);

            evt = this.createAndFireEvent(one, 'click');

            expect(oneSpy).not.toHaveBeenCalled();
        });

        it('should support (un)bind', function(){
            $(one).bind('click', oneSpy);

            evt = this.createAndFireEvent(one, 'click');

            expect(oneSpy).toHaveBeenCalledWith(evt, one);
            oneSpy.calls.reset();

            $(one).unbind('click', oneSpy);

            evt = this.createAndFireEvent(one, 'click');

            expect(oneSpy).not.toHaveBeenCalled();
        });

        it('should support (un)delegate', function(){
            $(one).delegate('.two', 'click', oneSpy);

            evt = this.createAndFireEvent(three, 'click');

            expect(oneSpy).toHaveBeenCalledWith(evt, two);
            oneSpy.calls.reset();

            $(one).undelegate('.two', 'click', oneSpy);

            evt = this.createAndFireEvent(three, 'click');

            expect(oneSpy).not.toHaveBeenCalled();
        });
    }); // describe('jQuery interface')

    it('should load itself on the global', function(){
        expect(window.$).toBe(window.Backbone.Native);
        expect(window.$).toEqual(jasmine.any(Function));
        expect(window.$.on).toEqual(jasmine.any(Function));
        expect(window.$.off).toEqual(jasmine.any(Function));
        expect(window.$.ajax).toEqual(jasmine.any(Function));
        expect(window.$.noConflict).toEqual(jasmine.any(Function));
    });

    it('should remove itself from the global with noConflict', function(){
        expect(window.$).toBe(window.Backbone.Native);

        var BN = $.noConflict();

        expect(window.$).not.toBe(BN);
        expect(window.Backbone.Native).toBe(BN);
        expect(BN).toBe($);
    });

    it('should remove itself from the global with noConflict deep', function(){
        expect(window.$).toBe(window.Backbone.Native);

        var BN = $.noConflict(true);

        expect(window.$).not.toBe(BN);
        expect(window.Backbone.Native).not.toBe(BN);
        expect(BN).toBe($);
    });
});
