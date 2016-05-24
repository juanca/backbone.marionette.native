$ = require('../../../lib/$.js');

describe('Backbone.Native jQuery interface contents', function(){
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

  it('captures all nodes', function() {
    var contents = one.contents();
    expect(contents.length).toBe(3);
    expect(contents[0].textContent).toEqual('Some text');
    expect(contents[1]).toEqual(two[0]);
    expect(contents[2]).toEqual(four[0]);
  });

  it('captures regular nodes', function() {
    var contents = two.contents();
    expect(contents.length).toBe(1);
    expect(contents[0]).toEqual(three[0]);
  });

  it('captures text nodes', function(){
    var contents = three.contents();
    expect(contents.length).toBe(1);
    expect(contents[0].textContent).toEqual('Hello world!');
  });

  it('captures empty nodes', function(){
    var contents = four.contents();
    expect(contents.length).toBe(0);
    expect(contents.length[0]).toBeUndefined();
  });
});
