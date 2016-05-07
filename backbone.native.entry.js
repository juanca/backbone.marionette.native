(function(){
  "use strict";

  var $ = require('./lib/$.js');

  $.ajax = require('./lib/ajax.js');
  $.Deferred = require('./lib/deferred.js');

  module.exports = $;
}).call(this);
