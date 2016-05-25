module.exports = function() {
  var parentNode;

  for(var i = 0; i < this.length; i += 1) {
    parentNode = this[i].parentNode;
    if(parentNode) parentNode.removeChild(this[i]);
  }

  return this;
};
