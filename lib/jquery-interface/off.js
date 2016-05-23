/**
 * Unbind an event handler to this element.
 *
 * @param {string} eventName (Optional) The event to unbind, e.g. 'click'.
 * @param {string} selector (Optional) The selector to unbind.
 * @param {function(Event, Element)} callback (Optional) The function to unbind.
 */
module.exports = function(cacheKeyProp, id, handlers, unusedKeys) {
  var off = require('./helpers/off.js')(cacheKeyProp, id, handlers, unusedKeys);

  return function(eventName, selector, callback){
    off(this[0], eventName, selector, callback);
    return this;
  };
};
