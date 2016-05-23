module.exports = function(cacheKeyProp, id, handlers, unusedKeys) {
  var off = require('./helpers/off.js')(cacheKeyProp, id, handlers, unusedKeys);

  return function(selector, eventName, callback){
    return this.off(eventName, selector, callback);
  };
};
