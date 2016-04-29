/**
 * Get the event handlers for a given element, creating an empty set if one doesn't exist.
 *
 * To avoid constantly filling the handlers object with null values, we reuse old IDs that
 * have been created and then cleared.
 *
 * @param {Element} el The element to get handlers for.
 *
 * @return {Array} An array of handlers.
 */
module.exports = function(cacheKeyProp, id, handlers, unusedKeys){
  return function handlersFor(el){
    if (!el[cacheKeyProp]){
      // Pick a new key, from the unused pool, or make a new one.
      el[cacheKeyProp] = unusedKeys.length === 0 ? ++id : unusedKeys.pop();
    }

    var cacheKey = el[cacheKeyProp];
    return handlers[cacheKey] || (handlers[cacheKey] = []);
  };
};
