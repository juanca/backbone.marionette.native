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