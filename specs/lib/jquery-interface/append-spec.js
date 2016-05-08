$ = require('../../../lib/$.js');

describe('Backbone.Native jQuery interface append', function(){
  "use strict";

  var evt, one, two, three;

  beforeEach(function(){
    this.element.innerHTML =
      '<div class="one">' +
        '<div class="two">' +
          '<span id="three" class="three">' +
            'Hello world!' +
          '</span>' +
        '</div>' +
      '</div>';

    one = this.element.querySelector('.one');
    two = one.querySelector('.two');
    three = two.querySelector('.three');
  });

  it('appends nodes', function(){
    var node = document.createElement('div');
    node.id = 'random';
    node.textContent = 'New Content';
    $(two).append(node);

    expect(two.childNodes.length).toBe(2);

    var el0 = two.childNodes[0];
    expect(el0.id).toBe('three');
    expect(el0).toHaveText('Hello world!');

    var el1 = two.childNodes[1];
    expect(el1.id).toBe('random');
    expect(el1).toHaveText('New Content');
  });
});
