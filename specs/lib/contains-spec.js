$ = require('../../lib/$.js');

describe('Backbone.Native contains', function(){
  "use strict";

  var one, two, three, four;

  beforeEach(function(){
    this.element.innerHTML =
      '<div class="one">' +
        '<div class="two">' +
          '<span id="three" class="three">' +
            'Hello world!' +
          '</span>' +
        '</div>' +
      '</div>' +
      '<div class="four"></div>';

    one = this.element.querySelector('.one');
    two = one.querySelector('.two');
    three = two.querySelector('.three');
    four = this.element.querySelector('.four');
  });

  it('finds the immediate child', function(){
    expect($.contains(one, two)).toBe(true);
    expect($.contains(two, three)).toBe(true);
  });

  it('finds deeply nested children', function() {
    expect($.contains(one, three)).toBe(true);
  });

  it('does not find non-children', function() {
    expect($.contains(one, four)).toBe(false);
    expect($.contains(two, four)).toBe(false);
    expect($.contains(three, four)).toBe(false);
  });
});
