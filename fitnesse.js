var id = function (el) {
    return document.getElementById(el);
};

if(id('output') === null) {
  var elemDiv = document.createElement('div');
  elemDiv.setAttribute("id", "output");
  document.body.appendChild(elemDiv);
}

var w = id('form');
var out = id('output');

function print(value) {
    return value === '' ? '[empty]' : value;
}

function log(field, value, errorMsg) {
    out.innerHTML += '| input | ' + field + ' | value | ' + print(value) + ' |';

    if (errorMsg) {
        out.innerHTML += ' error | ' + errorMsg + ' |';
    }
    
    out.innerHTML += '<br>';
}

w.addEventListener('change', function (evt) {
    var t = evt.target;

    log(t.id, t.value);
});

w.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var errorBox = document.createElement('div');
    errorBox.textContent = 'Du må fylle ut ett beløp';
    errorBox.className = 'errorBox';

    id('amount').parentNode.appendChild(errorBox);
});


// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

//// create an observer instance
//var observer = new MutationObserver(function (mutations) {
//    mutations.forEach(function (mutation) {
//        console.log(mutation);
//        
//        var input = mutation.target.children[1];
//
//        log(input.id, input.value, mutation.addedNodes[0].textContent);
//    });
//});
//
//// configuration of the observer:
//var config = {
//    attributes: true,
//    childList: true,
//    characterData: true
//};
//
//// pass in the target node, as well as the observer options
//observer.observe(id('amountWrapper'), config);