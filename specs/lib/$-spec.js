$ = require('../../lib/$.js');

describe('Backbone.Native jQuery interface', function(){
  "use strict";

  var evt, one, two, three, oneSpy, twoSpy, threeSpy, inst;

  beforeEach(function(){
    this.element.innerHTML =
      '<div class="one">' +
      '  <div class="two">' +
      '    <span class="three">' +
      '    </span>' +
      '  </div>' +
      '</div>';

    one = this.element.querySelector('.one');
    two = one.querySelector('.two');
    three = two.querySelector('.three');

    oneSpy = jasmine.createSpy('one');
    twoSpy = jasmine.createSpy('two');
    threeSpy = jasmine.createSpy('three');
  });

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
});
