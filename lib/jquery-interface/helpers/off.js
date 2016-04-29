/**
 * Remove an event handler from an element.
 *
 * @param {Element} parentElement The element to unbind event handlers from.
 * @param {string} eventName (Optional) The event to unbind, e.g. 'click'.
 * @param {string} selector (Optional) The selector to unbind.
 * @param {function(Event, Element)} callback (Optional) The function to unbind.
 */
module.exports = function(cacheKeyProp, id, handlers, unusedKeys){
  var namespaceRE = require('./namespace-regular-expression.js');
  var handlersFor = require('./handlers-for.js')(cacheKeyProp, id, handlers, unusedKeys);
  var clearHandlers = require('./clear-handlers.js')(cacheKeyProp, id, handlers, unusedKeys);

  return function off(parentElement, eventName, selector, callback){
    if (typeof selector === 'function'){
      callback = selector;
      selector = null;
    }

    var parts = namespaceRE.exec(eventName || '');
    eventName = parts[1];
    var namespace = parts[2];
    var handlers = handlersFor(parentElement) || [];

    if (!eventName && !namespace && !selector && !callback){
      // Fastpath to remove all handlers.
      handlers.forEach(function(item){
        parentElement.removeEventListener(item.eventName, item.handler, false);
      });
      clearHandlers(parentElement);
    } else {
      var matchedHandlers = handlers.filter(function(item){
        return ((!namespace || item.namespace === namespace) &&
          (!eventName || item.eventName === eventName) &&
          (!callback || item.callback === callback) &&
          (!selector || item.selector === selector));
      });

      matchedHandlers.forEach(function(item){
        parentElement.removeEventListener(item.eventName, item.handler, false);

        handlers.splice(handlers.indexOf(item), 1);
      });

      if (handlers.length === 0) clearHandlers(parentElement);
    }
  };
};
