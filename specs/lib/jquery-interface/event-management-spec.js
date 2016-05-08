$ = require('../../../lib/$.js');

describe('Backbone.Native jQuery interface event management', function(){
  "use strict";

  var evt, one, two, three, oneSpy, twoSpy, threeSpy;

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
});
