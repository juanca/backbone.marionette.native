module.exports = function($){
  return function() {
    return $(this[0].childNodes);
  };
};
