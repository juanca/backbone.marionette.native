/**
 * Backbone.Native
 *
 * For all details and documentation:
 * http://github.com/inkling/backbone.native
 *
 * Copyright 2013 Inkling Systems, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The purpose of this library is to allow Backbone to work without needing to load jQuery or Zepto.
 * This file provides a basic jQuery-like implementation for Backbone, implementing the
 * minimum functionality for Backbone to function. We assume that Backbone applications using
 * this will not expect the standard jQuery API to work, and will instead use native JS functions.
 *
 * Keep in mind that due to the APIs in this, it will likely only work on recent browsers.
 *
 * Note:
 *  - Core Backbone only needs collections with single members, so that is all that has been
 *      supported in this library. It is expected that you will just use querySelectorAll instead.
 *      This will be most obvious if you make heavy use of 'view.$'.
 *  - Events delegated with selectors starting with '>' are not supported.
 *  - Due to 'currentTarget' being read-only on standard DOM events, we cannot make standard
 *      events behave identically to jQuery's events when delegation is used. The element matching
 *      the delegate selector is instead passed as the second argument to event handlers.
 *  - The '$.ajax' implementation is very simple and likely needs to be expanded to better support
 *      standard use-cases.
 *
 * Tested with Backbone v0.9.2 and 1.0.0.
 */
(function(){
    "use strict";

    var namespaceRE = require('./lib/jquery-interface/helpers/namespace-regular-expression.js');

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
