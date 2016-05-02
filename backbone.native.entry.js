(function(){
  "use strict";

  var $ = require('./lib/$.js');

  $.ajax = require('./lib/ajax.js');

  module.exports = $;
}).call(this);
