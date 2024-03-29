// This helps avoid conflicts in case we inject
// this script on the same page multiple times
// without reloading.
var injected = injected || (function(){

  // An object that will contain the "methods"
  // we can use from our event script.
  var methods = {};

  // This method will eventually return
  // background colors from the current page.
  methods.getContent = function(){
    var nodes = document.querySelectorAll('*');
    return document.body.innerText;
  };

  methods.changeContent = function(text){
    document.body.innerText = text;
  };

  // This tells the script to listen for
  // messages from our extension.
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var data = {};
    // If the method the extension has requested
    // exists, call it and assign its response
    // to data.
    if (methods.hasOwnProperty(request.method)) {
      if (request.text) {
        data = methods[request.method](request.text, request);
      } else {
        data = methods[request.method]();
      }
    }

    // Send the response back to our extension.
    sendResponse({ data: data });
    return true;
  });

  return true;
})();
