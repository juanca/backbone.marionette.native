Backbone = require('backbone');
Backbone.Native = require('../../backbone.marionette.native.entry.js');

describe('Backbone.View', function(){
  "use strict";

  var view;

  beforeEach(function(){
    this.element.innerHTML = "<div class='root'></div>";
  });

  it('should set up the element if .el is a selector', function(){
    view = new (Backbone.View.extend({
      el: '.root'
    }));

    expect(view.el).toBe(this.element.querySelector('.root'));
    expect(view.$el).toBeInstanceOf(Backbone.Native);
    expect(view.$el.length).toBe(1);
    expect(view.$el[0]).toBe(this.element.querySelector('.root'));
  });

  it('should set up the element if .el is an element', function(){
    view = new (Backbone.View.extend({
      el: this.element.querySelector('.root')
    }));

    expect(view.el).toBe(this.element.querySelector('.root'));
    expect(view.$el).toBeInstanceOf(Backbone.Native);
    expect(view.$el.length).toBe(1);
    expect(view.$el[0]).toBe(this.element.querySelector('.root'));
  });

  it('should set up the element if .el is an object', function(){
    view = new (Backbone.View.extend({
      el: Backbone.Native('.root')
    }));

    expect(view.el).toBe(this.element.querySelector('.root'));
    expect(view.$el).toBeInstanceOf(Backbone.Native);
    expect(view.$el.length).toBe(1);
    expect(view.$el[0]).toBe(this.element.querySelector('.root'));
  });

  it('should set up the element if .el is an HTML snippet', function(){
    view = new (Backbone.View.extend({
      el: '<li id="el-id" class="className" disabled="disabled"' +
        'data-value="value">word1 <span>word2</span> word3</li>'
    }));

    expect(view.el.tagName).toBe('LI');
    expect(view.el.id).toBe('el-id');
    expect(view.el.className).toBe('className');
    expect(view.el.getAttribute('disabled')).toBe('disabled');
    expect(view.el.getAttribute('data-value')).toBe('value');
    expect(view.el.innerHTML).toBe('word1 <span>word2</span> word3');
    expect(view.$el).toBeInstanceOf(Backbone.Native);
    expect(view.$el.length).toBe(1);
    expect(view.$el[0]).toBe(view.el);
  });

  it('should set up the elment from view attributes', function(){
    view = new (Backbone.View.extend({
      id: 'el-id',
      className: 'className',
      tagName: 'li',
      attributes: {
        'html': 'word1 <span>word2</span> word3',
        'disabled': 'disabled',
        'data-value': 'value'
      }
    }));

    expect(view.el.tagName).toBe('LI');
    expect(view.el.id).toBe('el-id');
    expect(view.el.className).toBe('className');
    expect(view.el.getAttribute('disabled')).toBe('disabled');
    expect(view.el.getAttribute('data-value')).toBe('value');
    expect(view.el.innerHTML).toBe('word1 <span>word2</span> word3');
    expect(view.$el).toBeInstanceOf(Backbone.Native);
    expect(view.$el.length).toBe(1);
    expect(view.$el[0]).toBe(view.el);
  });

  it('should bind and clean up delegate events', function(){
    this.element.innerHTML = '<span class="name"></span>';
    var name = this.element.querySelector('.name');

    var viewClass = Backbone.View.extend({
      el: this.element,
      events: {
        'click .name': 'clickEvt_'
      },
      clickEvt_: function(){}
    });

    var view1 = new viewClass();
    spyOn(view1, 'clickEvt_');
    view1.delegateEvents();

    var view2 = new viewClass();
    spyOn(view2, 'clickEvt_');
    view2.delegateEvents();

    this.createAndFireEvent(name, 'click');

    expect(view1.clickEvt_).toHaveBeenCalled();
    expect(view2.clickEvt_).toHaveBeenCalled();
    view1.clickEvt_.calls.reset();
    view2.clickEvt_.calls.reset();
    view1.undelegateEvents();

    this.createAndFireEvent(name, 'click');

    expect(view1.clickEvt_).not.toHaveBeenCalled();
    expect(view2.clickEvt_).toHaveBeenCalled();
    view2.clickEvt_.calls.reset();
    view2.undelegateEvents();
    view1.delegateEvents();

    this.createAndFireEvent(name, 'click');

    expect(view1.clickEvt_).toHaveBeenCalled();
    expect(view2.clickEvt_).not.toHaveBeenCalled();
    view1.clickEvt_.calls.reset();
    view1.undelegateEvents();
    view2.undelegateEvents();

    this.createAndFireEvent(name, 'click');

    expect(view1.clickEvt_).not.toHaveBeenCalled();
    expect(view2.clickEvt_).not.toHaveBeenCalled();
  });

  it('should bind and clean up bound events', function(){
    this.element.innerHTML = '<span class="name"></span>';
    var name = this.element.querySelector('.name');

    var viewClass = Backbone.View.extend({
      el: this.element,
      events: {
        'click': 'clickEvt_'
      },
      clickEvt_: function(){}
    });

    var view1 = new viewClass();
    spyOn(view1, 'clickEvt_');
    view1.delegateEvents();

    var view2 = new viewClass();
    spyOn(view2, 'clickEvt_');
    view2.delegateEvents();

    this.createAndFireEvent(name, 'click');

    expect(view1.clickEvt_).toHaveBeenCalled();
    expect(view2.clickEvt_).toHaveBeenCalled();
    view1.clickEvt_.calls.reset();
    view2.clickEvt_.calls.reset();
    view1.undelegateEvents();

    this.createAndFireEvent(name, 'click');

    expect(view1.clickEvt_).not.toHaveBeenCalled();
    expect(view2.clickEvt_).toHaveBeenCalled();
    view2.clickEvt_.calls.reset();
    view2.undelegateEvents();
    view1.delegateEvents();

    this.createAndFireEvent(name, 'click');

    expect(view1.clickEvt_).toHaveBeenCalled();
    expect(view2.clickEvt_).not.toHaveBeenCalled();
    view1.clickEvt_.calls.reset();
    view1.undelegateEvents();
    view2.undelegateEvents();

    this.createAndFireEvent(name, 'click');

    expect(view1.clickEvt_).not.toHaveBeenCalled();
    expect(view2.clickEvt_).not.toHaveBeenCalled();
  });
});
