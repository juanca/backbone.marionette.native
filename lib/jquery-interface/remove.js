/**
 * Remove an element from the DOM and remove all event handlers bound to it and
 * its child elements.
 *
 * Used in Backbone.View.prototype.remove.
 *
 * @return {$} This instance.
 */
module.exports = function(cacheKeyProp, id, handlers, unusedKeys){
  var off = require('./helpers/off.js')(cacheKeyProp, id, handlers, unusedKeys);

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
