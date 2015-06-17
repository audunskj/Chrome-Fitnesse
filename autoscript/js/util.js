var d = require('./dom');

var out = d.select('#output');

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

module.exports = {
    log: log
};