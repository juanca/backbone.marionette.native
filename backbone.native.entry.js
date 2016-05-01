(function(){
  "use strict";

  var $ = require('./lib/$.js');

  $.ajax = require('./lib/ajax.js');

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
