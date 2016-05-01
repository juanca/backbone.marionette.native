(function(){
  "use strict";

  // The element property to save the cache key on.
  var cacheKeyProp = 'backboneNativeKey' + Math.random();
  var id = 1;
  var handlers = {};
  var unusedKeys = [];

  var on = require('./lib/jquery-interface/helpers/on.js')(cacheKeyProp, id, handlers, unusedKeys);
  var off = require('./lib/jquery-interface/helpers/off.js')(cacheKeyProp, id, handlers, unusedKeys);
  var $ = require('./lib/$.js')(on, off, cacheKeyProp, id, handlers, unusedKeys);

  $.ajax = require('./lib/ajax.js');

  // Expose on/off for external use with having to instantiate a wrapper.
  $.on = on;
  $.off = off;

  if (typeof exports !== 'undefined') {
    module.exports = $;
  } else {
    var root = this;
    var originalBackboneNative = root.Backbone ? root.Backbone.Native : null;
    var original$ = root.$;
    if (root.Backbone) root.Backbone.Native = $;
    root.$ = $;

    $.noConflict = function(deep){
      root.$ = original$;
      if (deep) root.Backbone.Native = originalBackboneNative;
      return $;
    };

    if (root.Backbone){
      if (root.Backbone.setDomLibrary){ // v0.9.2
        root.Backbone.setDomLibrary($);
      } else { // v1.0.0
        root.Backbone.$ = $;
      }
    }
  }
}).call(this);
