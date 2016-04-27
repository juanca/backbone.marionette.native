$ = require('../../backbone.native.entry.js');

describe('Backbone.Native ajax', function(){
  "use strict";

  var xhr, data, success, error;

  beforeEach(function(){
    xhr = jasmine.createSpyObj('XMLHttpRequest', [
      'open',
      'setRequestHeader',
      'send'
    ]);
    xhr.responseText = '{"key":"value"}';
    xhr.status = 200;
    xhr.statusText = 'OK';

    spyOn(window, 'XMLHttpRequest').and.returnValue(xhr);

    data = {
      page: 3,
      arg: 'section'
    };

    success = jasmine.createSpy('success');
    error = jasmine.createSpy('error');
  });

  it('should send a basic request', function(){
    var req = $.ajax({
      url: 'http://example.com/page.html?test=val',
      success: success,
      error: error
    });

    expect(window.XMLHttpRequest).toHaveBeenCalled();
    expect(xhr.open).toHaveBeenCalledWith(
      'GET', 'http://example.com/page.html?test=val', true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    expect(xhr.send).toHaveBeenCalledWith(undefined);
    expect(xhr.onload).toEqual(jasmine.any(Function));
    expect(req).toBe(xhr);
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    xhr.onload();

    expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
    expect(error).not.toHaveBeenCalled();
  });

  it('should process data when given an object', function(){
    var req = $.ajax({
      url: 'http://example.com/page.html?test=val',
      type: 'POST',
      data: data,
      success: success,
      error: error
    });

    expect(window.XMLHttpRequest).toHaveBeenCalled();
    expect(xhr.open).toHaveBeenCalledWith('POST',
      'http://example.com/page.html?test=val', true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    expect(xhr.send).toHaveBeenCalledWith('page=3&arg=section');
    expect(xhr.onload).toEqual(jasmine.any(Function));
    expect(req).toBe(xhr);
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    xhr.onload();

    expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
    expect(error).not.toHaveBeenCalled();
  });

  it('should not process data when explicitly disabled', function(){
    var req = $.ajax({
      url: 'http://example.com/page.html?test=val',
      type: 'POST',
      data: data,
      processData: false,
      success: success,
      error: error
    });

    expect(window.XMLHttpRequest).toHaveBeenCalled();
    expect(xhr.open).toHaveBeenCalledWith('POST',
      'http://example.com/page.html?test=val', true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    expect(xhr.send).toHaveBeenCalledWith(data);
    expect(xhr.onload).toEqual(jasmine.any(Function));
    expect(req).toBe(xhr);
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    xhr.onload();

    expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
    expect(error).not.toHaveBeenCalled();
  });

  it('should place data in query parameters for GET', function(){
    var req = $.ajax({
      url: 'http://example.com/page.html?test=val',
      type: 'GET',
      data: data,
      success: success,
      error: error
    });

    expect(window.XMLHttpRequest).toHaveBeenCalled();
    expect(xhr.open).toHaveBeenCalledWith('GET',
      'http://example.com/page.html?test=val&page=3&arg=section', true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    expect(xhr.send).toHaveBeenCalledWith(undefined);
    expect(xhr.onload).toEqual(jasmine.any(Function));
    expect(req).toBe(xhr);
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    xhr.onload();

    expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
    expect(error).not.toHaveBeenCalled();
  });

  it('should place data in query parameters for HEAD', function(){
    var req = $.ajax({
      url: 'http://example.com/page.html?test=val',
      type: 'HEAD',
      data: data,
      success: success,
      error: error
    });

    expect(window.XMLHttpRequest).toHaveBeenCalled();
    expect(xhr.open).toHaveBeenCalledWith('HEAD',
      'http://example.com/page.html?test=val&page=3&arg=section', true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    expect(xhr.send).toHaveBeenCalledWith(undefined);
    expect(xhr.onload).toEqual(jasmine.any(Function));
    expect(req).toBe(xhr);
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    xhr.onload();

    expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
    expect(error).not.toHaveBeenCalled();
  });

  it('should send data directly for POST', function(){
    var req = $.ajax({
      url: 'http://example.com/page.html?test=val',
      type: 'POST',
      data: JSON.stringify(data),
      success: success,
      error: error
    });

    expect(window.XMLHttpRequest).toHaveBeenCalled();
    expect(xhr.open).toHaveBeenCalledWith('POST',
      'http://example.com/page.html?test=val', true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    expect(xhr.send).toHaveBeenCalledWith('{"page":3,"arg":"section"}');
    expect(xhr.onload).toEqual(jasmine.any(Function));
    expect(req).toBe(xhr);
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    xhr.onload();

    expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
    expect(error).not.toHaveBeenCalled();
  });

  it('should set the content type when given', function(){
    var req = $.ajax({
      url: 'http://example.com/page.html?test=val',
      contentType: 'application/x-www-form-urlencoded',
      success: success,
      error: error
    });

    expect(window.XMLHttpRequest).toHaveBeenCalled();
    expect(xhr.open).toHaveBeenCalledWith(
      'GET', 'http://example.com/page.html?test=val', true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type',
      'application/x-www-form-urlencoded');
    expect(xhr.send).toHaveBeenCalledWith(undefined);
    expect(xhr.onload).toEqual(jasmine.any(Function));
    expect(req).toBe(xhr);
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    xhr.onload();

    expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
    expect(error).not.toHaveBeenCalled();
  });

  it('should execute a beforeSend callback', function(){
    var beforeSend = jasmine.createSpy('beforeSend');
    var req = $.ajax({
      url: 'http://example.com/page.html?test=val',
      beforeSend: beforeSend,
      success: success,
      error: error
    });

    expect(window.XMLHttpRequest).toHaveBeenCalled();
    expect(xhr.open).toHaveBeenCalledWith(
      'GET', 'http://example.com/page.html?test=val', true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    expect(beforeSend).toHaveBeenCalledWith(xhr);
    expect(xhr.send).toHaveBeenCalledWith(undefined);
    expect(xhr.onload).toEqual(jasmine.any(Function));
    expect(req).toBe(xhr);
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    xhr.onload();

    expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
    expect(error).not.toHaveBeenCalled();
  });

  it('should parse JSON if dataType is json', function(){
    var req = $.ajax({
      url: 'http://example.com/page.html?test=val',
      dataType: 'json',
      success: success,
      error: error
    });

    expect(window.XMLHttpRequest).toHaveBeenCalled();
    expect(xhr.open).toHaveBeenCalledWith(
      'GET', 'http://example.com/page.html?test=val', true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    expect(xhr.send).toHaveBeenCalledWith(undefined);
    expect(xhr.onload).toEqual(jasmine.any(Function));
    expect(req).toBe(xhr);
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    xhr.onload();

    expect(success).toHaveBeenCalledWith({key:"value"}, 'OK', xhr);
    expect(error).not.toHaveBeenCalled();
  });

  it('should call success for 200 - 299', function(){
    var req = $.ajax({
      url: 'http://example.com/page.html?test=val',
      success: success,
      error: error
    });

    expect(window.XMLHttpRequest).toHaveBeenCalled();
    expect(xhr.open).toHaveBeenCalledWith(
      'GET', 'http://example.com/page.html?test=val', true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    expect(xhr.send).toHaveBeenCalledWith(undefined);
    expect(xhr.onload).toEqual(jasmine.any(Function));
    expect(req).toBe(xhr);
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    for (var i = 200; i < 300; i++){
      success.calls.reset();
      error.calls.reset();
      xhr.status = i;

      xhr.onload();

      expect(success).toHaveBeenCalledWith('{"key":"value"}', 'OK', xhr);
      expect(error).not.toHaveBeenCalled();
    }
  });

  it('should call error on JSON parse error', function(){
    var req = $.ajax({
      url: 'http://example.com/page.html?test=val',
      dataType: 'json',
      success: success,
      error: error
    });

    expect(window.XMLHttpRequest).toHaveBeenCalled();
    expect(xhr.open).toHaveBeenCalledWith(
      'GET', 'http://example.com/page.html?test=val', true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    expect(xhr.send).toHaveBeenCalledWith(undefined);
    expect(xhr.onload).toEqual(jasmine.any(Function));
    expect(req).toBe(xhr);
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    xhr.responseText = '{"key';

    xhr.onload();

    expect(success).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(xhr);
  });

  it('should call error on server error', function(){
    var req = $.ajax({
      url: 'http://example.com/page.html?test=val',
      success: success,
      error: error
    });

    expect(window.XMLHttpRequest).toHaveBeenCalled();
    expect(xhr.open).toHaveBeenCalledWith(
      'GET', 'http://example.com/page.html?test=val', true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    expect(xhr.send).toHaveBeenCalledWith(undefined);
    expect(xhr.onload).toEqual(jasmine.any(Function));
    expect(req).toBe(xhr);
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    [400, 404, 500].forEach(function(status){
      success.calls.reset();
      error.calls.reset();

      xhr.status = status;

      xhr.onload();

      expect(success).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalledWith(xhr);
    });
  });

  it('should call error on network error', function(){
    var req = $.ajax({
      url: 'http://example.com/page.html?test=val',
      dataType: 'json',
      success: success,
      error: error
    });

    expect(window.XMLHttpRequest).toHaveBeenCalled();
    expect(xhr.open).toHaveBeenCalledWith(
      'GET', 'http://example.com/page.html?test=val', true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    expect(xhr.send).toHaveBeenCalledWith(undefined);
    expect(xhr.onload).toEqual(jasmine.any(Function));
    expect(req).toBe(xhr);
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    xhr.responseText = '';

    xhr.onerror();

    expect(success).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(xhr);
  });

  it('should call error on request abort', function(){
    var req = $.ajax({
      url: 'http://example.com/page.html?test=val',
      dataType: 'json',
      success: success,
      error: error
    });

    expect(window.XMLHttpRequest).toHaveBeenCalled();
    expect(xhr.open).toHaveBeenCalledWith(
      'GET', 'http://example.com/page.html?test=val', true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8');
    expect(xhr.send).toHaveBeenCalledWith(undefined);
    expect(xhr.onload).toEqual(jasmine.any(Function));
    expect(req).toBe(xhr);
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    xhr.responseText = '';

    xhr.onabort();

    expect(success).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(xhr);
  });
});
