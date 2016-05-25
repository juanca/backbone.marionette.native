$ = require('../../../lib/$.js');

describe('Backbone.Native jQuery interface detach', function(){
  "use strict";

  var one, two, three, four;

  beforeEach(function(){
    this.element.innerHTML =
      '<div class="one">' +
        'Some text' +
        '<div class="two">' +
          '<span id="three" class="three">' +
            'Hello world!' +
          '</span>' +
        '</div>' +
        '<div class="four"></div>' +
      '</div>';

    one = $(this.element.querySelector('.one'));
    two = $(this.element.querySelector('.two'));
    three = $(this.element.querySelector('.three'));
    four = $(this.element.querySelector('.four'));
  });

  it('removes a node', function(){
    three.detach();
    expect(two[0].childNodes.length).toEqual(0);
  });

  it('removes a specific node', function(){
    four.detach();
    expect(one[0].childNodes.length).toEqual(2);
    expect(one[0].childNodes[0].textContent).toEqual('Some text');
    expect(one[0].childNodes[1]).toBe(two[0]);
  });

  it('removes all nodes', function(){
    one.contents().detach();
    expect(one[0].childNodes.length).toEqual(0);
  });
});
