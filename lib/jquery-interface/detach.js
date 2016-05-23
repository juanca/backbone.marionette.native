module.exports = function(){
  var parentNode = this[0].parentNode;
  return parentNode ? parentNode.removeChild(this[0]) : void 0;
};
