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

        describe('Models', function(){
            var model, xhr, success, error;

            function loadData(code, data){
                xhr.status = code || 200;
                xhr.responseText = data || '{"id":10,"attr":"responseVal"}'
                xhr.onload();
            }

            function expectSuccess(){
                if (stable){
                    expect(success).toHaveBeenCalledWith(
                        model, {id: 10, attr: 'responseVal'}, jasmine.any(Object));
                } else {
                    expect(success).toHaveBeenCalledWith(
                        model, {id: 10, attr: 'responseVal'});
                }
                expect(error).not.toHaveBeenCalled();
            }

            beforeEach(function(){
                xhr = jasmine.createSpyObj('XHR', [
                    'open',
                    'send',
                    'setRequestHeader'
                ]);
                spyOn(window, 'XMLHttpRequest').and.returnValue(xhr);
                success = jasmine.createSpy('success');
                error = jasmine.createSpy('error');

                model = new (Backbone.Model.extend({
                    url: 'model/',
                    defaults: {
                        id: 15,
                        attr: 'val'
                    }
                }));
            });

            it('should fetch', function(){
                var result = model.fetch({
                    success: success,
                    error: error
                });

                expect(result).toBe(xhr);
                expect(xhr.open).toHaveBeenCalledWith('GET', 'model/', true);
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.setRequestHeader).toHaveBeenCalledWith(
                    'Content-Type',
                    'application/x-www-form-urlencoded; charset=UTF-8');
                expect(error).not.toHaveBeenCalled();
                expect(success).not.toHaveBeenCalled();

                loadData();

                expectSuccess();
                expect(model.toJSON()).toEqual({
                    id: 10,
                    attr: 'responseVal'
                });
            });

            it('should fail to fetch on error', function(){
                var result = model.fetch({
                    success: success,
                    error: error
                });

                expect(result).toBe(xhr);
                expect(xhr.open).toHaveBeenCalledWith('GET', 'model/', true);
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.setRequestHeader).toHaveBeenCalledWith(
                    'Content-Type',
                    'application/x-www-form-urlencoded; charset=UTF-8');
                expect(error).not.toHaveBeenCalled();
                expect(success).not.toHaveBeenCalled();

                loadData(404);

                expect(error).toHaveBeenCalledWith(model, xhr, jasmine.any(Object));
                expect(success).not.toHaveBeenCalled();
                expect(model.toJSON()).toEqual({
                    id: 15,
                    attr: 'val'
                });
            });

            it('should save existing', function(){
                var result = model.save(null, {
                    success: success,
                    error: error
                });

                expect(result).toBe(xhr);
                expect(xhr.open).toHaveBeenCalledWith('PUT', 'model/', true);
                expect(xhr.send).toHaveBeenCalledWith('{"id":15,"attr":"val"}');
                expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');

                loadData();

                expectSuccess();
                expect(model.toJSON()).toEqual({
                    id: 10,
                    attr: 'responseVal'
                });
            });

            it('should save new', function(){
                model.set('id', null);

                var result = model.save(null, {
                    success: success,
                    error: error
                });

                expect(result).toBe(xhr);
                expect(xhr.open).toHaveBeenCalledWith('POST', 'model/', true);
                expect(xhr.send).toHaveBeenCalledWith('{"id":null,"attr":"val"}');
                expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');

                loadData();

                expectSuccess();
                expect(model.toJSON()).toEqual({
                    id: 10,
                    attr: 'responseVal'
                });
            });

            it('should fail to save', function(){
                var result = model.save(null, {
                    success: success,
                    error: error
                });

                expect(result).toBe(xhr);
                expect(xhr.open).toHaveBeenCalledWith('PUT', 'model/', true);
                expect(xhr.send).toHaveBeenCalledWith('{"id":15,"attr":"val"}');
                expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');

                loadData(500);

                expect(success).not.toHaveBeenCalled();
                expect(error).toHaveBeenCalledWith(model, xhr, jasmine.any(Object));
                expect(model.toJSON()).toEqual({
                    id: 15,
                    attr: 'val'
                });
            });

            it('should delete', function(){
                var result = model.destroy({
                    success: success,
                    error: error
                });

                expect(result).toBe(xhr);
                expect(xhr.open).toHaveBeenCalledWith('DELETE', 'model/', true);
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.setRequestHeader).toHaveBeenCalledWith(
                    'Content-Type',
                    'application/x-www-form-urlencoded; charset=UTF-8');

                loadData();

                expectSuccess();
                expect(model.toJSON()).toEqual({
                    id: 15,
                    attr: 'val'
                });
            });

            it('should fail to delete', function(){
                var result = model.destroy({
                    success: success,
                    error: error
                });

                expect(result).toBe(xhr);
                expect(xhr.open).toHaveBeenCalledWith('DELETE', 'model/', true);
                expect(xhr.send).toHaveBeenCalledWith(undefined);
                expect(xhr.setRequestHeader).toHaveBeenCalledWith(
                    'Content-Type',
                    'application/x-www-form-urlencoded; charset=UTF-8');

                loadData(500);

                expect(success).not.toHaveBeenCalled();
                expect(error).toHaveBeenCalledWith(model, xhr, jasmine.any(Object));
                expect(model.toJSON()).toEqual({
                    id: 15,
                    attr: 'val'
                });
            });
        }); // describe('Models')

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
