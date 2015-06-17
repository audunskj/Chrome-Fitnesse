var validator = require('validator');

function errorObject(f, msg) {
    return {
        field: f,
        error: msg
    };
}

function required(field, value) {
    if (value) {
        return null;
    } else {
        return errorObject(field, 'Du må fylle ut noe i dette feltet her');
    }
}

function isNumber(field, value) {
    if (validator.isInt(value)) {
        return null;
    } else {
        return errorObject(field, 'Tallet er ikke ett heltall');
    }
}

function isDate(field, value) {
    if (validator.isDate(value)) {
        return null;
    } else {
        return errorObject(field, 'Datoen er ikke gyldig');
    }
}

module.exports = {
    required: required,
    isNumber: isNumber,
    isDate: isDate
};