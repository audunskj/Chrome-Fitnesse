// This is included and executed in the inspected page

function sendMessage(type, field, value) {
  var content = '| ' + type + ' | ' + field + ' | value | ' + value + ' |';
  content += '<br>';
  chrome.extension.sendMessage({action: 'message', content:content}, function(message){});
}

function addListener(event) {
  
  if(event.target.getAttribute("type") === "submit") {
    
    sendMessage('submit', event.target.id, event.target.value);
    
  } else if(event.target.nodeName === 'INPUT') {
    
    sendMessage('input', event.target.id, event.target.value);
    
  }
  
}

document.removeEventListener("blur", addListener, true);
document.addEventListener("blur", addListener, true);

