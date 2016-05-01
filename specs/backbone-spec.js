Backbone = require('backbone');

/**
 * Tests for Backbone to ensure that it works as expected when depending on Backbone.Native.
 */

// Capture the Backbone global so when the tests run they use the correct version of Backbone.
(function(Backbone){
    "use strict";

    describe('Backbone ' + Backbone.VERSION, function(){
        var stable;

        beforeEach(function(){
            stable = ('$' in Backbone);
            Backbone.Native = require('../backbone.native.entry.js');

            if (stable){
                Backbone.$ = Backbone.Native;
            } else {
                Backbone.setDomLibrary(Backbone.Native);
            }
        });

        describe('History objects', function(){
            var history, route;

            beforeEach(function(){
                history = new Backbone.History()
                history.options = {
                    pushState: true,
                    hashChange: true,
                    silent: true
                };
                spyOn(history, 'getFragment').and.returnValue('');
                history.history = jasmine.createSpyObj('History', [
                    'pushState'
                ]);
                history.location = jasmine.createSpyObj('Location', [
                    'replace'
                ]);
                history.location.href = '';
                history.location.search = '';
                history.location.pathname = '/';

                route = jasmine.createSpy('route');
                history.route(/.*/, route);
            });

            afterEach(function(){
                history.stop();
            });

            it('should add and remove state listeners', function(){
                history.start();
                history.getFragment.and.returnValue('path/route/');

                this.createAndFireEvent(window, 'popstate');

                expect(route).toHaveBeenCalledWith('path/route/');
                route.calls.reset();
                history.getFragment.and.returnValue('path/route/nextpage');

                history.stop();
                this.createAndFireEvent(window, 'popstate');

                expect(route).not.toHaveBeenCalled();
            });

            it('should add and remove hashchange listeners', function(){
                history.options.pushState = false;
                history.start();
                history.getFragment.and.returnValue('path/route/');

                this.createAndFireEvent(window, 'hashchange');

                expect(route).toHaveBeenCalledWith('path/route/');
                route.calls.reset();
                history.getFragment.and.returnValue('path/route/nextpage');

                history.stop();
                this.createAndFireEvent(window, 'hashchange');

                expect(route).not.toHaveBeenCalled();
            });
        }); // describe('History objects')
    });
})(Backbone);
