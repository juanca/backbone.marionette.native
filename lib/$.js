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
module.exports = function(on, off, cacheKeyProp, id, handlers, unusedKeys) {
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

    attr: require('./jquery-interface/attr.js'),
    html: require('./jquery-interface/html.js'),
    remove: require('./jquery-interface/remove.js')(cacheKeyProp, id, handlers, unusedKeys),

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

  return $;
};
