// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.extension.*

console.log("yo");

//document.querySelector('#executescript').addEventListener('click', function() {
//    sendObjectToInspectedPage({action: "code", content: "console.log('Inline script executed')"});
//}, false);
//
document.querySelector('#fitnesse-start').addEventListener('click', function() {
  console.log("ok");
    sendObjectToInspectedPage({action: "script", content: "inserted-script.js"});
}, false);
//
//document.querySelector('#insertmessagebutton').addEventListener('click', function() {
//    sendObjectToInspectedPage({action: "code", content: "document.body.innerHTML='<button>Send message to DevTools</button>'"});
//    sendObjectToInspectedPage({action: "script", content: "messageback-script.js"});
//}, false);