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
