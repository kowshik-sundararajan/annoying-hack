// Execute the inject.js in a tab and call a method,
// passing the result to a callback function.
function injectedMethod(tab, method, callback) {
  chrome.tabs.executeScript(tab.id, { file: 'inject.js' }, function() {
    chrome.tabs.sendMessage(tab.id, { method: method }, callback);
  });
}

function nextInjectedMethod(tab, method, text, callback) {
  chrome.tabs.executeScript(tab.id, { file: 'inject.js' }, function() {
    chrome.tabs.sendMessage(tab.id, { method, text }, callback);
  });
}

function getContent(tab) {
  // When we get a result back from the getBgColors
  // method, alert the data
  injectedMethod(tab, 'getContent', function (response) {
    let reply = response.data;
    console.log(typeof data);
    var req = new XMLHttpRequest();
    var data = {
      text: reply
    };
    req.open('POST', 'http://localhost:3000', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function() {
      if(req.readyState == 4) {
        let translatedText = JSON.parse(req.responseText).translatedText;
        let newLang = JSON.parse(req.responseText).targetLanguage;
        alert(`Language of the day: ${newLang}`);
        nextInjectedMethod(tab, 'changeContent', translatedText, function () {
          return true;
        });
      }
    }
    req.send(JSON.stringify(data));
  });
}

chrome.browserAction.onClicked.addListener(getContent);
