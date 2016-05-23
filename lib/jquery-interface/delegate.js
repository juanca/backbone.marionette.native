module.exports = function(cacheKeyProp, id, handlers, unusedKeys) {
  var on = require('./helpers/on.js')(cacheKeyProp, id, handlers, unusedKeys);

  return function(selector, eventName, callback){
    return this.on(eventName, selector, callback);
  };
};
