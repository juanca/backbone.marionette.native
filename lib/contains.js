module.exports = function(container, contained) {
  var parentNode = contained[0].parentNode;
  while(parentNode) {
    if (parentNode === container[0]) return true;
    parentNode = parentNode.parentNode;
  }

  return false;
};
