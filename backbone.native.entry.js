(function(){
  "use strict";
  var $ = require('./lib/$.js');
  var stable = ('$' in Backbone);

  if (stable){
    Backbone.$ = $;
  } else {
    Backbone.setDomLibrary($);
  }

  module.exports = $;
}).call(this);
