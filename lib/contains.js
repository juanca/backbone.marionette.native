module.exports = function(container, contained) {
  var parentNode = contained.parentNode;
  while(parentNode) {
    if (parentNode === container) return true;
    parentNode = parentNode.parentNode;
  }

  return false;
};
