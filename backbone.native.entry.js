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

    var handlersFor = require('./lib/jquery-interface/helpers/handlers-for.js')(cacheKeyProp, id, handlers, unusedKeys);

    var clearHandlers = require('./lib/jquery-interface/helpers/clear-handlers.js')(cacheKeyProp, id, handlers, unusedKeys);

    var on = require('./lib/jquery-interface/helpers/on.js')(cacheKeyProp, id, handlers, unusedKeys);

    var off = require('./lib/jquery-interface/helpers/off.js')(cacheKeyProp, id, handlers, unusedKeys);

    /**
     * Construct a new jQuery-style element representation.
     *
     * @param {string|Element|Window} element There are several different possible values for this
     *      argument:
     *      - {string} A snippet of HTML, if it starts with a '<', or a selector to find.
     *      - {Element} An existing element to wrap.
     *      - {Window} The window object to wrap.
     * @param {Element} context The context to search within, if a selector was given.
     *      Defaults to document.
     */
    function $(element, context){
        context = context || document;

        // Call as a constructor if it was used as a function.
        if (!(this instanceof $)) return new $(element, context);

        if (!element){
            this.length = 0;
        } else if (typeof element === 'string'){
            if (/^\s*</.test(element)){
                // Parse arbitrary HTML into an element.
                var div = document.createElement('div');
                div.innerHTML = element;
                this[0] = div.firstChild;
                div.removeChild(div.firstChild);
                this.length = 1;
            } else {
                element = context.querySelector(element);

                // Length must be 0 if no elements found.
                if (element !== null){
                    this[0] = element;
                    this.length = 1;
                } else {
                    this.length = 0;
                }
            }
        } else {
            // This handles both the 'Element' and 'Window' case, as both support
            // event binding via 'addEventListener'.
            this[0] = element;
            this.length = 1;
        }
    }

    $.prototype = {
        /**
         * The following methods are used by Backbone, but only in code-paths for IE 6/7 support.
         * Since none of this will work for old IE anyway, they are not implemented, and
         * instead left for documentation purposes.
         *
         * Used in Backbone.History.prototype.start.
         */
        hide: null,
        appendTo: null,

        /**
         * Find is not supported to encourage the use of querySelector(All) as an alternative.
         *
         * e.g.
         * Instead of 'this.$(sel)', use 'this.el.querySelectorAll(sel)'.
         *
         * Used in Backbone.View.prototype.$, but not actually called internally.
         */
        find: null,

        attr: require('./lib/jquery-interface/attr.js'),
        html: require('./lib/jquery-interface/html.js'),
        remove: require('./lib/jquery-interface/remove.js')(cacheKeyProp, id, handlers, unusedKeys),

        /**
         * Bind an event handler to this element.
         *
         * @param {string} eventName The event to bind, e.g. 'click'.
         * @param {string} selector (Optional) The selector to match when an event propagates up.
         * @param {function(Event, Element)} callback The function to call when the event is fired.
         */
        on: function(eventName, selector, callback){
            on(this[0], eventName, selector, callback);
            return this;
        },

        /**
         * Unbind an event handler to this element.
         *
         * @param {string} eventName (Optional) The event to unbind, e.g. 'click'.
         * @param {string} selector (Optional) The selector to unbind.
         * @param {function(Event, Element)} callback (Optional) The function to unbind.
         */
        off: function(eventName, selector, callback){
            off(this[0], eventName, selector, callback);
            return this;
        },

        // Backbone v0.9.2 support.
        bind: function(eventName, callback){
            return this.on(eventName, callback);
        },
        unbind: function(eventName, callback){
            return this.off(eventName, callback);
        },
        delegate: function(selector, eventName, callback){
            return this.on(eventName, selector, callback);
        },
        undelegate: function(selector, eventName, callback){
            return this.off(eventName, selector, callback);
        }
    };

    $.ajax = require('./lib/ajax.js');

    // Expose on/off for external use with having to instantiate a wrapper.
    $.on = on;
    $.off = off;

    if (typeof exports !== 'undefined') {
      module.exports = $;
    } else {
      console.log('setting as root');
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
