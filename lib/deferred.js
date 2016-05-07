/**
 * Deferred
 *
 * @param {Object} options
 */
module.exports = function(options){
  options = options || {};

  var alwaysCallbacks = [];
  var doneCallbacks = [];
  var failCallbacks = [];

  function Deferred() {
    return this;
  }

  Deferred.prototype.always = function always(callback) {
    alwaysCallbacks.push(callback);

    return this;
  };

  Deferred.prototype.done = function done(callback) {
    doneCallbacks.push(callback);

    return this;
  };

  Deferred.prototype.fail = function fail(callback) {
    failCallbacks.push(callback);

    return this;
  };

  Deferred.prototype.resolve = function resolve() {
    var actualParameters = arguments;

    doneCallbacks.forEach(function(callback) {
      callback.apply(null, actualParameters);
    });

    alwaysCallbacks.forEach(function(callback) {
      callback.apply(null, actualParameters);
    });

    doneCallbacks = [];
    alwaysCallbacks = [];
  };

  Deferred.prototype.reject = function resolve() {
    var actualParameters = arguments;

    failCallbacks.forEach(function(callback) {
      callback.apply(null, actualParameters);
    });

    alwaysCallbacks.forEach(function(callback) {
      callback.apply(null, actualParameters);
    });

    failCallbacks = [];
    alwaysCallbacks = [];
  };

  return new Deferred();
};
