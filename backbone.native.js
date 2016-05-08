window["jQuery"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	(function(){
	  "use strict";

	  var $ = __webpack_require__(1);

	  $.ajax = __webpack_require__(10);
	  $.Deferred = __webpack_require__(11);

	  Backbone = __webpack_require__(12);
	  var stable = ('$' in Backbone);

	  if (stable){
	    Backbone.$ = $;
	  } else {
	    Backbone.setDomLibrary($);
	  }

	  module.exports = $;
	}).call(this);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Construct a new jQuery-style element representation.
	 *
	 * @param {string|Element|Window} element There are several different possible values for this
	 *    argument:
	 *    - {string} A snippet of HTML, if it starts with a '<', or a selector to find.
	 *    - {Element} An existing element to wrap.
	 *    - {Window} The window object to wrap.
	 * @param {Element} context The context to search within, if a selector was given.
	 *    Defaults to document.
	 */

	// The element property to save the cache key on.
	var cacheKeyProp = 'backboneNativeKey' + Math.random();
	var id = 1;
	var handlers = {};
	var unusedKeys = [];

	var on = __webpack_require__(2)(cacheKeyProp, id, handlers, unusedKeys);
	var off = __webpack_require__(5)(cacheKeyProp, id, handlers, unusedKeys);

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
	};

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

	  attr: __webpack_require__(7),
	  html: __webpack_require__(8),
	  remove: __webpack_require__(9)(cacheKeyProp, id, handlers, unusedKeys),

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
	  },

	  // Marionette support
	  append: function(fragment) {
	    this[0].appendChild(fragment);
	    return this;
	  },
	};

	module.exports = $;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Add event handlers to an element.
	 *
	 * @param {Element} parentElement The element to bind event handlers to.
	 * @param {string} eventName The event to bind, e.g. 'click'.
	 * @param {string} selector (Optional) The selector to match when an event propagates up.
	 * @param {function(Event, Element)} callback The function to call when the event is fired.
	 */
	module.exports = function(cacheKeyProp, id, handlers, unusedKeys){
	  var namespaceRE = __webpack_require__(3);
	  var handlersFor = __webpack_require__(4)(cacheKeyProp, id, handlers, unusedKeys);

	  var matchesSelector = Element.prototype.matchesSelector || null;
	  if (!matchesSelector){
	    ['webkit', 'moz', 'o', 'ms'].forEach(function(prefix){
	      var func = Element.prototype[prefix + 'MatchesSelector'];
	      if (func) matchesSelector = func;
	    });
	  }

	  return function on(parentElement, eventName, selector, callback){
	    // Adjust arguments if selector was not provided.
	    if (typeof selector === 'function'){
	      callback = selector;
	      selector = null;
	    }

	    var parts = namespaceRE.exec(eventName);
	    eventName = parts[1] || null;
	    var namespace = parts[2] || null;

	    if (!eventName) return;

	    var handler = callback;
	    var originalCallback = callback;
	    if (selector){
	      // Event delegation handler to match a selector for child element events.
	      handler = function(event){
	        for (var el = event.target; el && el !== parentElement; el = el.parentElement){
	          if (matchesSelector.call(el, selector)){
	            // jQuery does not include the second argument, but we have included it
	            // for simplicity because 'this' will likely be bound to the view inside
	            // the callback, and as noted above, we cannot override 'currentTarget'.
	            var result = originalCallback.call(el, event, el);
	            if (result === false){
	              event.stopPropagation();
	              event.preventDefault();
	            }
	            return result;
	          }
	        }
	      };
	    } else {
	      // Standard event handler bound directly to the element.
	      handler = function(event){
	        var result = originalCallback.call(parentElement, event, parentElement);
	        if (result === false){
	          event.stopPropagation();
	          event.preventDefault();
	        }
	        return result;
	      };
	    }

	    parentElement.addEventListener(eventName, handler, false);

	    // Save event handler metadata so that the handler can be unbound later.
	    handlersFor(parentElement).push({
	      eventName: eventName,
	      callback: callback,
	      handler: handler,
	      namespace: namespace,
	      selector: selector
	    });
	  };
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	// Regular expression to match an event name and/or a namespace.
	module.exports = /^([^.]+)?(?:\.([^.]+))?$/;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Get the event handlers for a given element, creating an empty set if one doesn't exist.
	 *
	 * To avoid constantly filling the handlers object with null values, we reuse old IDs that
	 * have been created and then cleared.
	 *
	 * @param {Element} el The element to get handlers for.
	 *
	 * @return {Array} An array of handlers.
	 */
	module.exports = function(cacheKeyProp, id, handlers, unusedKeys){
	  return function handlersFor(el){
	    if (!el[cacheKeyProp]){
	      // Pick a new key, from the unused pool, or make a new one.
	      el[cacheKeyProp] = unusedKeys.length === 0 ? ++id : unusedKeys.pop();
	    }

	    var cacheKey = el[cacheKeyProp];
	    return handlers[cacheKey] || (handlers[cacheKey] = []);
	  };
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Remove an event handler from an element.
	 *
	 * @param {Element} parentElement The element to unbind event handlers from.
	 * @param {string} eventName (Optional) The event to unbind, e.g. 'click'.
	 * @param {string} selector (Optional) The selector to unbind.
	 * @param {function(Event, Element)} callback (Optional) The function to unbind.
	 */
	module.exports = function(cacheKeyProp, id, handlers, unusedKeys){
	  var namespaceRE = __webpack_require__(3);
	  var handlersFor = __webpack_require__(4)(cacheKeyProp, id, handlers, unusedKeys);
	  var clearHandlers = __webpack_require__(6)(cacheKeyProp, id, handlers, unusedKeys);

	  return function off(parentElement, eventName, selector, callback){
	    if (typeof selector === 'function'){
	      callback = selector;
	      selector = null;
	    }

	    var parts = namespaceRE.exec(eventName || '');
	    eventName = parts[1];
	    var namespace = parts[2];
	    var handlers = handlersFor(parentElement) || [];

	    if (!eventName && !namespace && !selector && !callback){
	      // Fastpath to remove all handlers.
	      handlers.forEach(function(item){
	        parentElement.removeEventListener(item.eventName, item.handler, false);
	      });
	      clearHandlers(parentElement);
	    } else {
	      var matchedHandlers = handlers.filter(function(item){
	        return ((!namespace || item.namespace === namespace) &&
	          (!eventName || item.eventName === eventName) &&
	          (!callback || item.callback === callback) &&
	          (!selector || item.selector === selector));
	      });

	      matchedHandlers.forEach(function(item){
	        parentElement.removeEventListener(item.eventName, item.handler, false);

	        handlers.splice(handlers.indexOf(item), 1);
	      });

	      if (handlers.length === 0) clearHandlers(parentElement);
	    }
	  };
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Clear the event handlers for a given element.
	 *
	 * @param {Element} el The element to clear.
	 */
	module.exports = function(cacheKeyProp, id, handlers, unusedKeys){
	  return function clearHandlers(el){
	    var cacheKey = el[cacheKeyProp];
	    if (handlers[cacheKey]){
	      handlers[cacheKey] = null;
	      el[cacheKeyProp] = null;
	      unusedKeys.push(cacheKey);
	    }
	  };
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * Add attributes to the element.
	 *
	 * Used in Backbone.View.prototype.make.
	 *
	 * @param {Object} attributes A set of attributes to apply to the element.
	 *
	 * @return {$} This instance.
	 */
	module.exports = function(attrs){
	  Object.keys(attrs).forEach(function(attr){
	    switch (attr){
	      case 'html':
	        this[0].innerHTML = attrs[attr];
	        break;
	      case 'text':
	        this[0].textContent = attrs[attr];
	        break;
	      case 'class':
	        this[0].className = attrs[attr];
	        break;
	      default:
	        this[0].setAttribute(attr, attrs[attr]);
	        break;
	    }
	  }, this);

	  return this;
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Set the HTML content of the element. Backbone does not use the no-argument version
	 * to read innerHTML, so that has not been implemented.
	 *
	 * Used in Backbone.View.prototype.make.
	 *
	 * @param {string} html The HTML to set as the element content.
	 *
	 * @return {$} This instance.
	 */
	module.exports = function(html){
	  this[0].innerHTML = html;

	  return this;
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Remove an element from the DOM and remove all event handlers bound to it and
	 * its child elements.
	 *
	 * Used in Backbone.View.prototype.remove.
	 *
	 * @return {$} This instance.
	 */
	module.exports = function(cacheKeyProp, id, handlers, unusedKeys){
	  var off = __webpack_require__(5)(cacheKeyProp, id, handlers, unusedKeys);

	  return function() {
	    var el = this[0];
	    if (el.parentElement) el.parentElement.removeChild(el);

	    // Unbind all event handlers on the element and children.
	    (function removeChildEvents(element){
	      off(element);

	      for (var i = 0, len = element.childNodes.length; i < len; i++){
	        if (element.childNodes[i].nodeType !== Node.TEXT_NODE){
	          removeChildEvents(element.childNodes[i]);
	        }
	      }
	    })(el);

	    return this;
	  };
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * Send an AJAX request.
	 *
	 * @param {Object} options The options to use for the connection:
	 *    - {string} url The URL to connect to.
	 *    - {string} type The type of request, e.g. 'GET', or 'POST'.
	 *    - {string} dataType The type of data expected, 'json'.
	 *    - {string} contentType The content-type of the data.
	 *    - {string|object} data The content to send.
	 *    - {function(XMLHttpRequest)} beforeSend A callback to call before sending.
	 *    - {boolean} processData True if 'data' should be converted
	 *      to a query string from an object.
	 *    - {function({string|object}, {string}, {XMLHttpRequest})} success The success callback.
	 *    - {function({XMLHttpRequest})} error The error callback.
	 */
	module.exports = function(options){
	  options = options || {};
	  var type = options.type || 'GET';
	  var url = options.url;
	  var processData = options.processData === undefined ? true : !!options.processData;
	  var contentType = options.contentType || 'application/x-www-form-urlencoded; charset=UTF-8';

	  // Process the data for sending.
	  var data = options.data;
	  if (processData && typeof data === 'object'){
	    var params = Object.keys(data).map(function(prop){
	      return encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop]);
	    });
	    data = params.join('&');
	  }

	  // Data for GET and HEAD goes in the URL.
	  if (data && (type === 'GET' || type === 'HEAD')){
	    url += (url.indexOf('?') === -1 ? '?' : '&') + data;
	    data = undefined;
	  }

	  var xhr = new XMLHttpRequest();
	  xhr.open(type, url, true);

	  xhr.setRequestHeader('Content-Type', contentType);
	  if (options.beforeSend) options.beforeSend(xhr);

	  xhr.onload = function(){
	    var error = false;
	    var content = xhr.responseText;

	    // Parse the JSON before calling success.
	    if (options.dataType === 'json'){
	      try {
	        content = JSON.parse(content);
	      } catch (e){
	        error = true
	      }
	    }

	    if (!error && (xhr.status >= 200 && xhr.status < 300)){
	      // The last two arguments only apply to v0.9.2.
	      if (options.success) options.success(content, xhr.statusText, xhr);
	    } else {
	      // This signature is inconsistent with v0.9.2, but is correct for 1.0.0.
	      if (options.error) options.error(xhr);
	    }
	  }.bind(this);

	  xhr.onerror = xhr.onabort = function(){
	    if (options.error) options.error(xhr);
	  };

	  xhr.send(data);

	  return xhr;
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

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


/***/ },
/* 12 */
/***/ function(module, exports) {

	(function() { module.exports = window["Backbone"]; }());

/***/ }
/******/ ]);