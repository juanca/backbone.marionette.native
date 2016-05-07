(function(){
  "use strict";

  var $ = require('./lib/$.js');

  $.ajax = require('./lib/ajax.js');
  $.Deferred = require('./lib/deferred.js');

  Backbone = require('backbone');
  var stable = ('$' in Backbone);

  if (stable){
    Backbone.$ = $;
  } else {
    Backbone.setDomLibrary($);
  }

  module.exports = $;
}).call(this);
