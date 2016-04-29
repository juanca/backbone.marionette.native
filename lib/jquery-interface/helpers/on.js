/**
 * Add event handlers to an element.
 *
 * @param {Element} parentElement The element to bind event handlers to.
 * @param {string} eventName The event to bind, e.g. 'click'.
 * @param {string} selector (Optional) The selector to match when an event propagates up.
 * @param {function(Event, Element)} callback The function to call when the event is fired.
 */
module.exports = function(cacheKeyProp, id, handlers, unusedKeys){
  var namespaceRE = require('./namespace-regular-expression.js');
  var handlersFor = require('./handlers-for.js')(cacheKeyProp, id, handlers, unusedKeys);

  var matchesSelector = Element.prototype.matchesSelector || null;
  if (!matchesSelector){
    ['webkit', 'moz', 'o', 'ms'].forEach(function(prefix){
      var func = Element.prototype[prefix + 'MatchesSelector'];
      if (func) matchesSelector = func;
    });
  }

  return function on(parentElement, eventName, selector, callback){
    // Adjust arguments if selector was not provided.
    if (typeof selector === 'function'){
      callback = selector;
      selector = null;
    }

    var parts = namespaceRE.exec(eventName);
    eventName = parts[1] || null;
    var namespace = parts[2] || null;

    if (!eventName) return;

    var handler = callback;
    var originalCallback = callback;
    if (selector){
      // Event delegation handler to match a selector for child element events.
      handler = function(event){
        for (var el = event.target; el && el !== parentElement; el = el.parentElement){
          if (matchesSelector.call(el, selector)){
            // jQuery does not include the second argument, but we have included it
            // for simplicity because 'this' will likely be bound to the view inside
            // the callback, and as noted above, we cannot override 'currentTarget'.
            var result = originalCallback.call(el, event, el);
            if (result === false){
              event.stopPropagation();
              event.preventDefault();
            }
            return result;
          }
        }
      };
    } else {
      // Standard event handler bound directly to the element.
      handler = function(event){
        var result = originalCallback.call(parentElement, event, parentElement);
        if (result === false){
          event.stopPropagation();
          event.preventDefault();
        }
        return result;
      };
    }

    parentElement.addEventListener(eventName, handler, false);

    // Save event handler metadata so that the handler can be unbound later.
    handlersFor(parentElement).push({
      eventName: eventName,
      callback: callback,
      handler: handler,
      namespace: namespace,
      selector: selector
    });
  };
};
