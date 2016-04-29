/**
 * Clear the event handlers for a given element.
 *
 * @param {Element} el The element to clear.
 */
module.exports = function(cacheKeyProp, id, handlers, unusedKeys){
  return function clearHandlers(el){
    var cacheKey = el[cacheKeyProp];
    if (handlers[cacheKey]){
      handlers[cacheKey] = null;
      el[cacheKeyProp] = null;
      unusedKeys.push(cacheKey);
    }
  };
};
