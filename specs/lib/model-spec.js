Backbone = require('backbone');
Backbone.Native = require('../../backbone.marionette.native.entry.js');

describe('Backbone.Model', function(){
  "use strict";

  var model, xhr, success, error;

  function loadData(code, data){
    xhr.status = code || 200;
    xhr.responseText = data || '{"id":10,"attr":"responseVal"}'
    xhr.onload();
  }

  function expectSuccess(){
    if ('$' in Backbone){
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
