beforeEach(function(){
  this.element = document.createElement('div');
  this.element.classList.add('test-element');
  document.body.appendChild(this.element);

  jasmine.addMatchers({
    toHaveClass: function(util, customMatchers){
      return {
        compare: function(actual, expected) {
          return {
            pass: actual.classList.contains(expected)
          };
        }
      };
    },
    toHaveText: function(util, customMatchers){
      return {
        compare: function(actual, expected) {
          return {
            pass: actual.textContent.trim() === expected
          };
        }
      };
    },
    toBeInstanceOf: function(util, customMatchers){
      return {
        compare: function(actual, expected) {
          return {
            pass: actual instanceof expected
          };
        }
      };
    }
  });

  /**
   * Helper for triggering mouse events.
   */
  this.createAndFireEvent = function(element, type){
    var evt;
    if (type === 'popstate' || type === 'hashchange'){
      evt = document.createEvent('HTMLEvents');
      evt.initEvent(
        type,
        false,  // bubbles
        false   // cancelable
      );
    } else {
      evt = document.createEvent('MouseEvent');
      evt.initMouseEvent(
        type,
        true,   // bubbles
        true,   // cancelable
        window,
        0,    // detail
        0,    // screenX
        0,    // screenY
        0,    // pageX
        0,    // pageY
        false,  // ctrlKey
        false,  // altKey
        false,  // shiftKey
        false,  // metaKey
        0,    // button
        (type === 'mouseover' || type === 'mouseout') ? document : null
      );
    }

    spyOn(evt, 'preventDefault').and.callThrough();
    spyOn(evt, 'stopPropagation').and.callThrough();

    element.dispatchEvent(evt);

    return evt;
  };
});

afterEach(function(){
  document.body.removeChild(this.element);
});
