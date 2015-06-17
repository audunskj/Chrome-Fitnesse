// This is included and executed in the inspected page

function sendMessage(field, value) {
  var content = '| input | ' + field + ' | value | ' + value + ' |';
  content += '<br>';
  chrome.extension.sendMessage({action: 'message', content:content}, function(message){});
}

function addListener(event) {
  console.log(event.target);
  sendMessage(event.target.id, event.target.value);
  
}

document.removeEventListener("blur", addListener, true);
document.addEventListener("blur", addListener, true);
