var d = require('./dom');
var log = require('./util').log;
var validator = require('./validator');

//"fromAccount" "toAccount" "amount" "date"

function findError(field) {
    return Array.prototype.filter.call(field.parentNode.children, function (el) {
        return el.classList.contains('errorBox');
    });
}

function checkRule(field, value, rules) {
    removeError(field);
    
    for (var i = 0; i < rules.length; i++) {
        var result = rules[i](field, value);

        if (result) {
            addError(field, result);
            break;
        }
    }
}

function addError(field, errorObj) {
    var errorBox = d.el('div', 'errorBox', errorObj.error);

    field.parentNode.appendChild(errorBox);
}

function removeError(field) {
    var error = findError(field);

    error.forEach(d.remove);
}

module.exports = function () {
    var w = d.select('#form');

    var rules = {
        amount: [validator.required, validator.isNumber],
        date: [validator.required, validator.isDate]
    };

    w.addEventListener('change', function (evt) {
        var t = evt.target;

        log(t.id, t.value);

        checkRule(t, t.value, rules[t.id]);
    });

    w.addEventListener('submit', function (evt) {
        evt.preventDefault();

        var amountField = d.select('#amount');
        var dateField = d.select('#date');
        
        checkRule(amountField, amountField.value, rules.amount);
        checkRule(dateField, dateField.value, rules.date);
    });

    return w;
};