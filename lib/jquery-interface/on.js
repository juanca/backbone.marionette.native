/**
 * Bind an event handler to this element.
 *
 * @param {string} eventName The event to bind, e.g. 'click'.
 * @param {string} selector (Optional) The selector to match when an event propagates up.
 * @param {function(Event, Element)} callback The function to call when the event is fired.
 */
module.exports = function(cacheKeyProp, id, handlers, unusedKeys) {
  var on = require('./helpers/on.js')(cacheKeyProp, id, handlers, unusedKeys);

  return function(eventName, selector, callback){
    on(this[0], eventName, selector, callback);
    return this;
  };
};
