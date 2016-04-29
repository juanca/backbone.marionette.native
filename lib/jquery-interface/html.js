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
