var form = require('./form')();
var log = require('./util').log;

// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

// create an observer instance
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        console.log(mutation);

        var input = mutation.target.children[1];

        if (mutation.addedNodes.length > 0) {
            log(input.id, input.value, mutation.addedNodes[0].textContent);
        }
    });
});

// configuration of the observer:
var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
};

// pass in the target node, as well as the observer options
observer.observe(form, config);