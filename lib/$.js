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

var on = require('./jquery-interface/helpers/on.js')(cacheKeyProp, id, handlers, unusedKeys);
var off = require('./jquery-interface/helpers/off.js')(cacheKeyProp, id, handlers, unusedKeys);

function $(element, context){
  // Call as a constructor if it was used as a function.
  if (!(this instanceof $)) return new $(element, context);

  context = context || document;

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
  hide: null,
  appendTo: null,
  find: null,
  attr: require('./jquery-interface/attr.js'),
  contents: require('./jquery-interface/contents.js'),
  detach: require('./jquery-interface/detach.js'),
  html: require('./jquery-interface/html.js'),
  remove: require('./jquery-interface/remove.js')(cacheKeyProp, id, handlers, unusedKeys),
  bind: require('./jquery-interface/bind.js')(cacheKeyProp, id, handlers, unusedKeys),
  unbind: require('./jquery-interface/unbind.js')(cacheKeyProp, id, handlers, unusedKeys),
  delegate: require('./jquery-interface/delegate.js')(cacheKeyProp, id, handlers, unusedKeys),
  undelegate: require('./jquery-interface/undelegate.js')(cacheKeyProp, id, handlers, unusedKeys),
  append: require('./jquery-interface/append.js'),
  on: require('./jquery-interface/on.js')(cacheKeyProp, id, handlers, unusedKeys),
  off: require('./jquery-interface/off.js')(cacheKeyProp, id, handlers, unusedKeys),
};

$.ajax = require('./ajax.js');
$.contains = require('./contains.js');
$.Deferred = require('./deferred.js');

module.exports = $;
