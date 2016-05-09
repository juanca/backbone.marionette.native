(function(){
  "use strict";
  var $ = require('./lib/$.js');

  if ('$' in Backbone) {
    Backbone.$ = $;
  } else {
    Backbone.setDomLibrary($);
  }

  module.exports = $;
}).call(this);
