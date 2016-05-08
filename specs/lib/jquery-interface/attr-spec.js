$ = require('../../../lib/$.js');

describe('Backbone.Native jQuery interface attr', function(){
  "use strict";

  var evt, one, two, three;

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
  });

  it('should support HTML', function(){
    $(two).attr({html: '<div id="random">New Content</div>'});

    expect(two.childNodes.length).toBe(1);
    var el = two.childNodes[0];
    expect(el.id).toBe('random');
    expect(el).toHaveText('New Content');
  });

  it('should support text', function(){
    $(two).attr({text: '<div>New Content</div>'});

    expect(two).toHaveText('<div>New Content</div>');
  });

  it('should support class', function(){
    two.classList.add('someclass');

    $(two).attr({'class': 'random other'});

    expect(two).toHaveClass('random', 'other');
    expect(two).not.toHaveClass('someclass');
  });

  it('should set attributes', function(){
    $(two).attr({value: 'A Value'});

    expect(two.getAttribute('value')).toBe('A Value');
  });

  it('should support multiple attributes', function(){
    $(two).attr({
      text: 'Content',
      id: 'OMG',
      random: 'val'
    });

    expect(two).toHaveText('Content');
    expect(two.id).toBe('OMG');
    expect(two.getAttribute('random')).toBe('val');
  });
});
