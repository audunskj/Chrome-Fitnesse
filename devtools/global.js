console.log('injected');

document.body.addEventListener('click', function (evt) {
    //console.log(evt.target);

    chrome.runtime.sendMessage(evt.target.id);
});