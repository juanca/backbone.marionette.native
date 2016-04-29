$ = require('../../../backbone.native.entry.js');

describe('Backbone.Native jQuery interface', function(){
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

  it('should set HTML content', function(){
    $(two).html('<div id="random">New Content</div>');

    expect(two.childNodes.length).toBe(1);
    var el = two.childNodes[0];
    expect(el.id).toBe('random');
    expect(el).toHaveText('New Content');
  });
});
