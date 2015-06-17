(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*globals document, module*/

function el(type, clazz, child) {
    var element = document.createElement(type);

    element.className = clazz;

    if (child) {
        if (typeof child === "string" || typeof child === "number") {
            element.innerHTML = child;
        } else {
            element.appendChild(child);
        }
    }

    return element;
}

function select(selector) {
    return document.querySelector(selector);
}

function addClass(el, clazz) {
    if (!el) {
        return;
    }
    
    el.classList.add(clazz);
}

function removeClass(el, clazz) {
    if (!el) {
        return;
    }
    
    el.classList.remove(clazz);
}

function hasClass(el, clazz) {
    if (!el || !el.classList) {
        return false;
    }

    if (!el.classList.contains) {
        return false;
    }
    
    return el.classList.contains(clazz);
}

function frag(children) {
    var fragment = document.createDocumentFragment();

    children.forEach(function (child) {
        fragment.appendChild(child);
    });

    return fragment;
}

function btn(text, clazz, onClick) {
    var button = el('button', clazz, document.createTextNode(text));

    button.addEventListener('click', onClick);

    return button;
}

function findFirstParent(node, clazz) {
    if (!node) {
        return;
    }
    
    if (hasClass(node, clazz)) {
        return node;
    } else {
        return findFirstParent(node.parentNode, clazz);
    }
}

function remove(node) {
    node.parentNode.removeChild(node);
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

module.exports = {
    select: select,
    el: el,
    addClass: addClass,
    removeClass: removeClass,
    hasClass: hasClass,
    frag: frag,
    btn: btn,
    findFirstParent: findFirstParent,
    remove: remove,
    insertAfter: insertAfter
};
},{}],2:[function(require,module,exports){
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
},{"./dom":1,"./util":4,"./validator":5}],3:[function(require,module,exports){
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
},{"./form":2,"./util":4}],4:[function(require,module,exports){
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
},{"./dom":1}],5:[function(require,module,exports){
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
},{"validator":6}],6:[function(require,module,exports){
/*!
 * Copyright (c) 2015 Chris O'Hara <cohara87@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function (name, definition) {
    if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        module.exports = definition();
    } else if (typeof define === 'function' && typeof define.amd === 'object') {
        define(definition);
    } else {
        this[name] = definition();
    }
})('validator', function (validator) {

    'use strict';

    validator = { version: '3.40.1' };

    var emailUser = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e])|(\\[\x01-\x09\x0b\x0c\x0d-\x7f])))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i;

    var emailUserUtf8 = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i;

    var displayName = /^(?:[a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~\.]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(?:[a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~\.]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\s)*<(.+)>$/i;

    var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;

    var isin = /^[A-Z]{2}[0-9A-Z]{9}[0-9]$/;

    var isbn10Maybe = /^(?:[0-9]{9}X|[0-9]{10})$/
      , isbn13Maybe = /^(?:[0-9]{13})$/;

    var ipv4Maybe = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
      , ipv6Block = /^[0-9A-F]{1,4}$/i;

    var uuid = {
        '3': /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i
      , '4': /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
      , '5': /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
      , all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
    };

    var alpha = /^[A-Z]+$/i
      , alphanumeric = /^[0-9A-Z]+$/i
      , numeric = /^[-+]?[0-9]+$/
      , int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/
      , float = /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/
      , hexadecimal = /^[0-9A-F]+$/i
      , hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;

    var ascii = /^[\x00-\x7F]+$/
      , multibyte = /[^\x00-\x7F]/
      , fullWidth = /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/
      , halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;

    var surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;

    var base64 = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;

    var phones = {
      'zh-CN': /^(\+?0?86\-?)?1[345789]\d{9}$/,
      'en-ZA': /^(\+?27|0)\d{9}$/,
      'en-AU': /^(\+?61|0)4\d{8}$/,
      'en-HK': /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,
      'fr-FR': /^(\+?33|0)[67]\d{8}$/,
      'pt-PT': /^(\+351)?9[1236]\d{7}$/,
      'el-GR': /^(\+30)?((2\d{9})|(69\d{8}))$/,
      'en-GB': /^(\+?44|0)7\d{9}$/,
      'en-US': /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
      'en-ZM': /^(\+26)?09[567]\d{7}$/
    };

    validator.extend = function (name, fn) {
        validator[name] = function () {
            var args = Array.prototype.slice.call(arguments);
            args[0] = validator.toString(args[0]);
            return fn.apply(validator, args);
        };
    };

    //Right before exporting the validator object, pass each of the builtins
    //through extend() so that their first argument is coerced to a string
    validator.init = function () {
        for (var name in validator) {
            if (typeof validator[name] !== 'function' || name === 'toString' ||
                    name === 'toDate' || name === 'extend' || name === 'init') {
                continue;
            }
            validator.extend(name, validator[name]);
        }
    };

    validator.toString = function (input) {
        if (typeof input === 'object' && input !== null && input.toString) {
            input = input.toString();
        } else if (input === null || typeof input === 'undefined' || (isNaN(input) && !input.length)) {
            input = '';
        } else if (typeof input !== 'string') {
            input += '';
        }
        return input;
    };

    validator.toDate = function (date) {
        if (Object.prototype.toString.call(date) === '[object Date]') {
            return date;
        }
        date = Date.parse(date);
        return !isNaN(date) ? new Date(date) : null;
    };

    validator.toFloat = function (str) {
        return parseFloat(str);
    };

    validator.toInt = function (str, radix) {
        return parseInt(str, radix || 10);
    };

    validator.toBoolean = function (str, strict) {
        if (strict) {
            return str === '1' || str === 'true';
        }
        return str !== '0' && str !== 'false' && str !== '';
    };

    validator.equals = function (str, comparison) {
        return str === validator.toString(comparison);
    };

    validator.contains = function (str, elem) {
        return str.indexOf(validator.toString(elem)) >= 0;
    };

    validator.matches = function (str, pattern, modifiers) {
        if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
            pattern = new RegExp(pattern, modifiers);
        }
        return pattern.test(str);
    };

    var default_email_options = {
        allow_display_name: false,
        allow_utf8_local_part: true,
        require_tld: true
    };

    validator.isEmail = function (str, options) {
        options = merge(options, default_email_options);

        if (options.allow_display_name) {
            var display_email = str.match(displayName);
            if (display_email) {
                str = display_email[1];
            }
        } else if (/\s/.test(str)) {
            return false;
        }

        var parts = str.split('@')
          , domain = parts.pop()
          , user = parts.join('@');

        if (!validator.isFQDN(domain, {require_tld: options.require_tld})) {
            return false;
        }

        return options.allow_utf8_local_part ?
            emailUserUtf8.test(user) :
            emailUser.test(user);
    };

    var default_url_options = {
        protocols: [ 'http', 'https', 'ftp' ]
      , require_tld: true
      , require_protocol: false
      , allow_underscores: false
      , allow_trailing_dot: false
      , allow_protocol_relative_urls: false
    };

    validator.isURL = function (url, options) {
        if (!url || url.length >= 2083 || /\s/.test(url)) {
            return false;
        }
        if (url.indexOf('mailto:') === 0) {
            return false;
        }
        options = merge(options, default_url_options);
        var protocol, auth, host, hostname, port,
            port_str, split;
        split = url.split('://');
        if (split.length > 1) {
            protocol = split.shift();
            if (options.protocols.indexOf(protocol) === -1) {
                return false;
            }
        } else if (options.require_protocol) {
            return false;
        }  else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
            split[0] = url.substr(2);
        }
        url = split.join('://');
        split = url.split('#');
        url = split.shift();

        split = url.split('?');
        url = split.shift();

        split = url.split('/');
        url = split.shift();
        split = url.split('@');
        if (split.length > 1) {
            auth = split.shift();
            if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
                return false;
            }
        }
        hostname = split.join('@');
        split = hostname.split(':');
        host = split.shift();
        if (split.length) {
            port_str = split.join(':');
            port = parseInt(port_str, 10);
            if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
                return false;
            }
        }
        if (!validator.isIP(host) && !validator.isFQDN(host, options) &&
                host !== 'localhost') {
            return false;
        }
        if (options.host_whitelist &&
                options.host_whitelist.indexOf(host) === -1) {
            return false;
        }
        if (options.host_blacklist &&
                options.host_blacklist.indexOf(host) !== -1) {
            return false;
        }
        return true;
    };

    validator.isIP = function (str, version) {
        version = validator.toString(version);
        if (!version) {
            return validator.isIP(str, 4) || validator.isIP(str, 6);
        } else if (version === '4') {
            if (!ipv4Maybe.test(str)) {
                return false;
            }
            var parts = str.split('.').sort(function (a, b) {
                return a - b;
            });
            return parts[3] <= 255;
        } else if (version === '6') {
            var blocks = str.split(':');
            var foundOmissionBlock = false; // marker to indicate ::
            
            // At least some OS accept the last 32 bits of an IPv6 address
            // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
            // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
            // and '::a.b.c.d' is deprecated, but also valid.
            var foundIPv4TransitionBlock = validator.isIP(blocks[blocks.length - 1], 4);
            var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

            if (blocks.length > expectedNumberOfBlocks)
                return false;

            // initial or final ::
            if (str === '::') {
                return true;
            } else if (str.substr(0, 2) === '::') {
                blocks.shift();
                blocks.shift();
                foundOmissionBlock = true;
            } else if (str.substr(str.length - 2) === '::') {
                blocks.pop();
                blocks.pop();
                foundOmissionBlock = true;
            }

            for (var i = 0; i < blocks.length; ++i) {
                // test for a :: which can not be at the string start/end
                // since those cases have been handled above
                if (blocks[i] === '' && i > 0 && i < blocks.length -1) {
                    if (foundOmissionBlock)
                        return false; // multiple :: in address
                    foundOmissionBlock = true;
                } else if (foundIPv4TransitionBlock && i == blocks.length - 1) {
                    // it has been checked before that the last
                    // block is a valid IPv4 address
                } else if (!ipv6Block.test(blocks[i])) {
                    return false;
                }
            }

            if (foundOmissionBlock) {
                return blocks.length >= 1;
            } else {
                return blocks.length === expectedNumberOfBlocks;
            }
        }
        return false;
    };

    var default_fqdn_options = {
        require_tld: true
      , allow_underscores: false
      , allow_trailing_dot: false
    };

    validator.isFQDN = function (str, options) {
        options = merge(options, default_fqdn_options);

        /* Remove the optional trailing dot before checking validity */
        if (options.allow_trailing_dot && str[str.length - 1] === '.') {
            str = str.substring(0, str.length - 1);
        }
        var parts = str.split('.');
        if (options.require_tld) {
            var tld = parts.pop();
            if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
                return false;
            }
        }
        for (var part, i = 0; i < parts.length; i++) {
            part = parts[i];
            if (options.allow_underscores) {
                if (part.indexOf('__') >= 0) {
                    return false;
                }
                part = part.replace(/_/g, '');
            }
            if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
                return false;
            }
            if (part[0] === '-' || part[part.length - 1] === '-' ||
                    part.indexOf('---') >= 0) {
                return false;
            }
        }
        return true;
    };

    validator.isBoolean = function(str) {
        return (['true', 'false', '1', '0'].indexOf(str) >= 0);
    };

    validator.isAlpha = function (str) {
        return alpha.test(str);
    };

    validator.isAlphanumeric = function (str) {
        return alphanumeric.test(str);
    };

    validator.isNumeric = function (str) {
        return numeric.test(str);
    };

    validator.isHexadecimal = function (str) {
        return hexadecimal.test(str);
    };

    validator.isHexColor = function (str) {
        return hexcolor.test(str);
    };

    validator.isLowercase = function (str) {
        return str === str.toLowerCase();
    };

    validator.isUppercase = function (str) {
        return str === str.toUpperCase();
    };

    validator.isInt = function (str, options) {
        options = options || {};
        return int.test(str) && (!options.hasOwnProperty('min') || str >= options.min) && (!options.hasOwnProperty('max') || str <= options.max);
    };

    validator.isFloat = function (str, options) {
        options = options || {};
        return str !== '' && float.test(str) && (!options.hasOwnProperty('min') || str >= options.min) && (!options.hasOwnProperty('max') || str <= options.max);
    };

    validator.isDivisibleBy = function (str, num) {
        return validator.toFloat(str) % validator.toInt(num) === 0;
    };

    validator.isNull = function (str) {
        return str.length === 0;
    };

    validator.isLength = function (str, min, max) {
        var surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
        var len = str.length - surrogatePairs.length;
        return len >= min && (typeof max === 'undefined' || len <= max);
    };

    validator.isByteLength = function (str, min, max) {
        return str.length >= min && (typeof max === 'undefined' || str.length <= max);
    };

    validator.isUUID = function (str, version) {
        var pattern = uuid[version ? version : 'all'];
        return pattern && pattern.test(str);
    };

    validator.isDate = function (str) {
        return !isNaN(Date.parse(str));
    };

    validator.isAfter = function (str, date) {
        var comparison = validator.toDate(date || new Date())
          , original = validator.toDate(str);
        return !!(original && comparison && original > comparison);
    };

    validator.isBefore = function (str, date) {
        var comparison = validator.toDate(date || new Date())
          , original = validator.toDate(str);
        return original && comparison && original < comparison;
    };

    validator.isIn = function (str, options) {
        var i;
        if (Object.prototype.toString.call(options) === '[object Array]') {
            var array = [];
            for (i in options) {
                array[i] = validator.toString(options[i]);
            }
            return array.indexOf(str) >= 0;
        } else if (typeof options === 'object') {
            return options.hasOwnProperty(str);
        } else if (options && typeof options.indexOf === 'function') {
            return options.indexOf(str) >= 0;
        }
        return false;
    };

    validator.isCreditCard = function (str) {
        var sanitized = str.replace(/[^0-9]+/g, '');
        if (!creditCard.test(sanitized)) {
            return false;
        }
        var sum = 0, digit, tmpNum, shouldDouble;
        for (var i = sanitized.length - 1; i >= 0; i--) {
            digit = sanitized.substring(i, (i + 1));
            tmpNum = parseInt(digit, 10);
            if (shouldDouble) {
                tmpNum *= 2;
                if (tmpNum >= 10) {
                    sum += ((tmpNum % 10) + 1);
                } else {
                    sum += tmpNum;
                }
            } else {
                sum += tmpNum;
            }
            shouldDouble = !shouldDouble;
        }
        return !!((sum % 10) === 0 ? sanitized : false);
    };

    validator.isISIN = function (str) {
        if (!isin.test(str)) {
            return false;
        }

        var checksumStr = str.replace(/[A-Z]/g, function(character) {
            return parseInt(character, 36);
        });

        var sum = 0, digit, tmpNum, shouldDouble = true;
        for (var i = checksumStr.length - 2; i >= 0; i--) {
            digit = checksumStr.substring(i, (i + 1));
            tmpNum = parseInt(digit, 10);
            if (shouldDouble) {
                tmpNum *= 2;
                if (tmpNum >= 10) {
                    sum += tmpNum + 1;
                } else {
                    sum += tmpNum;
                }
            } else {
                sum += tmpNum;
            }
            shouldDouble = !shouldDouble;
        }

        return parseInt(str.substr(str.length - 1), 10) === (10000 - sum) % 10;
    };

    validator.isISBN = function (str, version) {
        version = validator.toString(version);
        if (!version) {
            return validator.isISBN(str, 10) || validator.isISBN(str, 13);
        }
        var sanitized = str.replace(/[\s-]+/g, '')
          , checksum = 0, i;
        if (version === '10') {
            if (!isbn10Maybe.test(sanitized)) {
                return false;
            }
            for (i = 0; i < 9; i++) {
                checksum += (i + 1) * sanitized.charAt(i);
            }
            if (sanitized.charAt(9) === 'X') {
                checksum += 10 * 10;
            } else {
                checksum += 10 * sanitized.charAt(9);
            }
            if ((checksum % 11) === 0) {
                return !!sanitized;
            }
        } else  if (version === '13') {
            if (!isbn13Maybe.test(sanitized)) {
                return false;
            }
            var factor = [ 1, 3 ];
            for (i = 0; i < 12; i++) {
                checksum += factor[i % 2] * sanitized.charAt(i);
            }
            if (sanitized.charAt(12) - ((10 - (checksum % 10)) % 10) === 0) {
                return !!sanitized;
            }
        }
        return false;
    };

    validator.isMobilePhone = function(str, locale) {
        if (locale in phones) {
            return phones[locale].test(str);
        }
        return false;
    };

    var default_currency_options = {
        symbol: '$'
      , require_symbol: false
      , allow_space_after_symbol: false
      , symbol_after_digits: false
      , allow_negatives: true
      , parens_for_negatives: false
      , negative_sign_before_digits: false
      , negative_sign_after_digits: false
      , allow_negative_sign_placeholder: false
      , thousands_separator: ','
      , decimal_separator: '.'
      , allow_space_after_digits: false
    };

    validator.isCurrency = function (str, options) {
        options = merge(options, default_currency_options);

        return currencyRegex(options).test(str);
    };

    validator.isJSON = function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    validator.isMultibyte = function (str) {
        return multibyte.test(str);
    };

    validator.isAscii = function (str) {
        return ascii.test(str);
    };

    validator.isFullWidth = function (str) {
        return fullWidth.test(str);
    };

    validator.isHalfWidth = function (str) {
        return halfWidth.test(str);
    };

    validator.isVariableWidth = function (str) {
        return fullWidth.test(str) && halfWidth.test(str);
    };

    validator.isSurrogatePair = function (str) {
        return surrogatePair.test(str);
    };

    validator.isBase64 = function (str) {
        return base64.test(str);
    };

    validator.isMongoId = function (str) {
        return validator.isHexadecimal(str) && str.length === 24;
    };

    validator.ltrim = function (str, chars) {
        var pattern = chars ? new RegExp('^[' + chars + ']+', 'g') : /^\s+/g;
        return str.replace(pattern, '');
    };

    validator.rtrim = function (str, chars) {
        var pattern = chars ? new RegExp('[' + chars + ']+$', 'g') : /\s+$/g;
        return str.replace(pattern, '');
    };

    validator.trim = function (str, chars) {
        var pattern = chars ? new RegExp('^[' + chars + ']+|[' + chars + ']+$', 'g') : /^\s+|\s+$/g;
        return str.replace(pattern, '');
    };

    validator.escape = function (str) {
        return (str.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\//g, '&#x2F;')
            .replace(/\`/g, '&#96;'));
    };

    validator.stripLow = function (str, keep_new_lines) {
        var chars = keep_new_lines ? '\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F' : '\\x00-\\x1F\\x7F';
        return validator.blacklist(str, chars);
    };

    validator.whitelist = function (str, chars) {
        return str.replace(new RegExp('[^' + chars + ']+', 'g'), '');
    };

    validator.blacklist = function (str, chars) {
        return str.replace(new RegExp('[' + chars + ']+', 'g'), '');
    };

    var default_normalize_email_options = {
        lowercase: true
    };

    validator.normalizeEmail = function (email, options) {
        options = merge(options, default_normalize_email_options);
        if (!validator.isEmail(email)) {
            return false;
        }
        var parts = email.split('@', 2);
        parts[1] = parts[1].toLowerCase();
        if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') {
            parts[0] = parts[0].toLowerCase().replace(/\./g, '');
            if (parts[0][0] === '+') {
                return false;
            }
            parts[0] = parts[0].split('+')[0];
            parts[1] = 'gmail.com';
        } else if (options.lowercase) {
            parts[0] = parts[0].toLowerCase();
        }
        return parts.join('@');
    };

    function merge(obj, defaults) {
        obj = obj || {};
        for (var key in defaults) {
            if (typeof obj[key] === 'undefined') {
                obj[key] = defaults[key];
            }
        }
        return obj;
    }

    function currencyRegex(options) {
        var symbol = '(\\' + options.symbol.replace(/\./g, '\\.') + ')' + (options.require_symbol ? '' : '?')
            , negative = '-?'
            , whole_dollar_amount_without_sep = '[1-9]\\d*'
            , whole_dollar_amount_with_sep = '[1-9]\\d{0,2}(\\' + options.thousands_separator + '\\d{3})*'
            , valid_whole_dollar_amounts = ['0', whole_dollar_amount_without_sep, whole_dollar_amount_with_sep]
            , whole_dollar_amount = '(' + valid_whole_dollar_amounts.join('|') + ')?'
            , decimal_amount = '(\\' + options.decimal_separator + '\\d{2})?';
        var pattern = whole_dollar_amount + decimal_amount;
        // default is negative sign before symbol, but there are two other options (besides parens)
        if (options.allow_negatives && !options.parens_for_negatives) {
            if (options.negative_sign_after_digits) {
                pattern += negative;
            }
            else if (options.negative_sign_before_digits) {
                pattern = negative + pattern;
            }
        }
        // South African Rand, for example, uses R 123 (space) and R-123 (no space)
        if (options.allow_negative_sign_placeholder) {
            pattern = '( (?!\\-))?' + pattern;
        }
        else if (options.allow_space_after_symbol) {
            pattern = ' ?' + pattern;
        }
        else if (options.allow_space_after_digits) {
            pattern += '( (?!$))?';
        }
        if (options.symbol_after_digits) {
            pattern += symbol;
        } else {
            pattern = symbol + pattern;
        }
        if (options.allow_negatives) {
            if (options.parens_for_negatives) {
                pattern = '(\\(' + pattern + '\\)|' + pattern + ')';
            }
            else if (!(options.negative_sign_before_digits || options.negative_sign_after_digits)) {
                pattern = negative + pattern;
            }
        }
        return new RegExp(
            '^' +
            // ensure there's a dollar and/or decimal amount, and that it doesn't start with a space or a negative sign followed by a space
            '(?!-? )(?=.*\\d)' +
            pattern +
            '$'
        );
    }

    validator.init();

    return validator;

});

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9kb20uanMiLCJqcy9mb3JtLmpzIiwianMvaW5kZXguanMiLCJqcy91dGlsLmpzIiwianMvdmFsaWRhdG9yLmpzIiwibm9kZV9tb2R1bGVzL3ZhbGlkYXRvci92YWxpZGF0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qZ2xvYmFscyBkb2N1bWVudCwgbW9kdWxlKi9cblxuZnVuY3Rpb24gZWwodHlwZSwgY2xhenosIGNoaWxkKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGF6ejtcblxuICAgIGlmIChjaGlsZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNoaWxkID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBjaGlsZCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBjaGlsZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdChzZWxlY3Rvcikge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbn1cblxuZnVuY3Rpb24gYWRkQ2xhc3MoZWwsIGNsYXp6KSB7XG4gICAgaWYgKCFlbCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhenopO1xufVxuXG5mdW5jdGlvbiByZW1vdmVDbGFzcyhlbCwgY2xhenopIHtcbiAgICBpZiAoIWVsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGF6eik7XG59XG5cbmZ1bmN0aW9uIGhhc0NsYXNzKGVsLCBjbGF6eikge1xuICAgIGlmICghZWwgfHwgIWVsLmNsYXNzTGlzdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFlbC5jbGFzc0xpc3QuY29udGFpbnMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXp6KTtcbn1cblxuZnVuY3Rpb24gZnJhZyhjaGlsZHJlbikge1xuICAgIHZhciBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblxuICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBmcmFnbWVudDtcbn1cblxuZnVuY3Rpb24gYnRuKHRleHQsIGNsYXp6LCBvbkNsaWNrKSB7XG4gICAgdmFyIGJ1dHRvbiA9IGVsKCdidXR0b24nLCBjbGF6eiwgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCkpO1xuXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljayk7XG5cbiAgICByZXR1cm4gYnV0dG9uO1xufVxuXG5mdW5jdGlvbiBmaW5kRmlyc3RQYXJlbnQobm9kZSwgY2xhenopIHtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBpZiAoaGFzQ2xhc3Mobm9kZSwgY2xhenopKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmaW5kRmlyc3RQYXJlbnQobm9kZS5wYXJlbnROb2RlLCBjbGF6eik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmUobm9kZSkge1xuICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0QWZ0ZXIocmVmZXJlbmNlTm9kZSwgbmV3Tm9kZSkge1xuICAgIHJlZmVyZW5jZU5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgcmVmZXJlbmNlTm9kZS5uZXh0U2libGluZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHNlbGVjdDogc2VsZWN0LFxuICAgIGVsOiBlbCxcbiAgICBhZGRDbGFzczogYWRkQ2xhc3MsXG4gICAgcmVtb3ZlQ2xhc3M6IHJlbW92ZUNsYXNzLFxuICAgIGhhc0NsYXNzOiBoYXNDbGFzcyxcbiAgICBmcmFnOiBmcmFnLFxuICAgIGJ0bjogYnRuLFxuICAgIGZpbmRGaXJzdFBhcmVudDogZmluZEZpcnN0UGFyZW50LFxuICAgIHJlbW92ZTogcmVtb3ZlLFxuICAgIGluc2VydEFmdGVyOiBpbnNlcnRBZnRlclxufTsiLCJ2YXIgZCA9IHJlcXVpcmUoJy4vZG9tJyk7XG52YXIgbG9nID0gcmVxdWlyZSgnLi91dGlsJykubG9nO1xudmFyIHZhbGlkYXRvciA9IHJlcXVpcmUoJy4vdmFsaWRhdG9yJyk7XG5cbi8vXCJmcm9tQWNjb3VudFwiIFwidG9BY2NvdW50XCIgXCJhbW91bnRcIiBcImRhdGVcIlxuXG5mdW5jdGlvbiBmaW5kRXJyb3IoZmllbGQpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmZpbHRlci5jYWxsKGZpZWxkLnBhcmVudE5vZGUuY2hpbGRyZW4sIGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdlcnJvckJveCcpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjaGVja1J1bGUoZmllbGQsIHZhbHVlLCBydWxlcykge1xuICAgIHJlbW92ZUVycm9yKGZpZWxkKTtcbiAgICBcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBydWxlc1tpXShmaWVsZCwgdmFsdWUpO1xuXG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGFkZEVycm9yKGZpZWxkLCByZXN1bHQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZEVycm9yKGZpZWxkLCBlcnJvck9iaikge1xuICAgIHZhciBlcnJvckJveCA9IGQuZWwoJ2RpdicsICdlcnJvckJveCcsIGVycm9yT2JqLmVycm9yKTtcblxuICAgIGZpZWxkLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZXJyb3JCb3gpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFcnJvcihmaWVsZCkge1xuICAgIHZhciBlcnJvciA9IGZpbmRFcnJvcihmaWVsZCk7XG5cbiAgICBlcnJvci5mb3JFYWNoKGQucmVtb3ZlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHcgPSBkLnNlbGVjdCgnI2Zvcm0nKTtcblxuICAgIHZhciBydWxlcyA9IHtcbiAgICAgICAgYW1vdW50OiBbdmFsaWRhdG9yLnJlcXVpcmVkLCB2YWxpZGF0b3IuaXNOdW1iZXJdLFxuICAgICAgICBkYXRlOiBbdmFsaWRhdG9yLnJlcXVpcmVkLCB2YWxpZGF0b3IuaXNEYXRlXVxuICAgIH07XG5cbiAgICB3LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgdmFyIHQgPSBldnQudGFyZ2V0O1xuXG4gICAgICAgIGxvZyh0LmlkLCB0LnZhbHVlKTtcblxuICAgICAgICBjaGVja1J1bGUodCwgdC52YWx1ZSwgcnVsZXNbdC5pZF0pO1xuICAgIH0pO1xuXG4gICAgdy5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHZhciBhbW91bnRGaWVsZCA9IGQuc2VsZWN0KCcjYW1vdW50Jyk7XG4gICAgICAgIHZhciBkYXRlRmllbGQgPSBkLnNlbGVjdCgnI2RhdGUnKTtcbiAgICAgICAgXG4gICAgICAgIGNoZWNrUnVsZShhbW91bnRGaWVsZCwgYW1vdW50RmllbGQudmFsdWUsIHJ1bGVzLmFtb3VudCk7XG4gICAgICAgIGNoZWNrUnVsZShkYXRlRmllbGQsIGRhdGVGaWVsZC52YWx1ZSwgcnVsZXMuZGF0ZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdztcbn07IiwidmFyIGZvcm0gPSByZXF1aXJlKCcuL2Zvcm0nKSgpO1xudmFyIGxvZyA9IHJlcXVpcmUoJy4vdXRpbCcpLmxvZztcblxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL011dGF0aW9uT2JzZXJ2ZXJcblxuLy8gY3JlYXRlIGFuIG9ic2VydmVyIGluc3RhbmNlXG52YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goZnVuY3Rpb24gKG11dGF0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG11dGF0aW9uKTtcblxuICAgICAgICB2YXIgaW5wdXQgPSBtdXRhdGlvbi50YXJnZXQuY2hpbGRyZW5bMV07XG5cbiAgICAgICAgaWYgKG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbG9nKGlucHV0LmlkLCBpbnB1dC52YWx1ZSwgbXV0YXRpb24uYWRkZWROb2Rlc1swXS50ZXh0Q29udGVudCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG4vLyBjb25maWd1cmF0aW9uIG9mIHRoZSBvYnNlcnZlcjpcbnZhciBjb25maWcgPSB7XG4gICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgY2hhcmFjdGVyRGF0YTogdHJ1ZSxcbiAgICBzdWJ0cmVlOiB0cnVlXG59O1xuXG4vLyBwYXNzIGluIHRoZSB0YXJnZXQgbm9kZSwgYXMgd2VsbCBhcyB0aGUgb2JzZXJ2ZXIgb3B0aW9uc1xub2JzZXJ2ZXIub2JzZXJ2ZShmb3JtLCBjb25maWcpOyIsInZhciBkID0gcmVxdWlyZSgnLi9kb20nKTtcblxudmFyIG91dCA9IGQuc2VsZWN0KCcjb3V0cHV0Jyk7XG5cbmZ1bmN0aW9uIHByaW50KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAnJyA/ICdbZW1wdHldJyA6IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBsb2coZmllbGQsIHZhbHVlLCBlcnJvck1zZykge1xuICAgIG91dC5pbm5lckhUTUwgKz0gJ3wgaW5wdXQgfCAnICsgZmllbGQgKyAnIHwgdmFsdWUgfCAnICsgcHJpbnQodmFsdWUpICsgJyB8JztcblxuICAgIGlmIChlcnJvck1zZykge1xuICAgICAgICBvdXQuaW5uZXJIVE1MICs9ICcgZXJyb3IgfCAnICsgZXJyb3JNc2cgKyAnIHwnO1xuICAgIH1cbiAgICBcbiAgICBvdXQuaW5uZXJIVE1MICs9ICc8YnI+Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbG9nOiBsb2dcbn07IiwidmFyIHZhbGlkYXRvciA9IHJlcXVpcmUoJ3ZhbGlkYXRvcicpO1xuXG5mdW5jdGlvbiBlcnJvck9iamVjdChmLCBtc2cpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBmaWVsZDogZixcbiAgICAgICAgZXJyb3I6IG1zZ1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIHJlcXVpcmVkKGZpZWxkLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXJyb3JPYmplY3QoZmllbGQsICdEdSBtw6UgZnlsbGUgdXQgbm9lIGkgZGV0dGUgZmVsdGV0IGhlcicpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoZmllbGQsIHZhbHVlKSB7XG4gICAgaWYgKHZhbGlkYXRvci5pc0ludCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVycm9yT2JqZWN0KGZpZWxkLCAnVGFsbGV0IGVyIGlra2UgZXR0IGhlbHRhbGwnKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzRGF0ZShmaWVsZCwgdmFsdWUpIHtcbiAgICBpZiAodmFsaWRhdG9yLmlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVycm9yT2JqZWN0KGZpZWxkLCAnRGF0b2VuIGVyIGlra2UgZ3lsZGlnJyk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZXF1aXJlZDogcmVxdWlyZWQsXG4gICAgaXNOdW1iZXI6IGlzTnVtYmVyLFxuICAgIGlzRGF0ZTogaXNEYXRlXG59OyIsIi8qIVxuICogQ29weXJpZ2h0IChjKSAyMDE1IENocmlzIE8nSGFyYSA8Y29oYXJhODdAZ21haWwuY29tPlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuICogYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4gKiBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbiAqIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbiAqIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG4gKiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbiAqIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0ZcbiAqIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG4gKiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbiAqIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbihmdW5jdGlvbiAobmFtZSwgZGVmaW5pdGlvbikge1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0Jykge1xuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpc1tuYW1lXSA9IGRlZmluaXRpb24oKTtcbiAgICB9XG59KSgndmFsaWRhdG9yJywgZnVuY3Rpb24gKHZhbGlkYXRvcikge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFsaWRhdG9yID0geyB2ZXJzaW9uOiAnMy40MC4xJyB9O1xuXG4gICAgdmFyIGVtYWlsVXNlciA9IC9eKCgoW2Etel18XFxkfFshI1xcJCUmJ1xcKlxcK1xcLVxcLz1cXD9cXF5fYHtcXHx9fl0pKyhcXC4oW2Etel18XFxkfFshI1xcJCUmJ1xcKlxcK1xcLVxcLz1cXD9cXF5fYHtcXHx9fl0pKykqKXwoKFxceDIyKSgoKChcXHgyMHxcXHgwOSkqKFxceDBkXFx4MGEpKT8oXFx4MjB8XFx4MDkpKyk/KChbXFx4MDEtXFx4MDhcXHgwYlxceDBjXFx4MGUtXFx4MWZcXHg3Zl18XFx4MjF8W1xceDIzLVxceDViXXxbXFx4NWQtXFx4N2VdKXwoXFxcXFtcXHgwMS1cXHgwOVxceDBiXFx4MGNcXHgwZC1cXHg3Zl0pKSkqKCgoXFx4MjB8XFx4MDkpKihcXHgwZFxceDBhKSk/KFxceDIwfFxceDA5KSspPyhcXHgyMikpKSQvaTtcblxuICAgIHZhciBlbWFpbFVzZXJVdGY4ID0gL14oKChbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKFxcLihbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKSopfCgoXFx4MjIpKCgoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oKFtcXHgwMS1cXHgwOFxceDBiXFx4MGNcXHgwZS1cXHgxZlxceDdmXXxcXHgyMXxbXFx4MjMtXFx4NWJdfFtcXHg1ZC1cXHg3ZV18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfChcXFxcKFtcXHgwMS1cXHgwOVxceDBiXFx4MGNcXHgwZC1cXHg3Zl18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSkpKigoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oXFx4MjIpKSkkL2k7XG5cbiAgICB2YXIgZGlzcGxheU5hbWUgPSAvXig/OlthLXpdfFxcZHxbISNcXCQlJidcXCpcXCtcXC1cXC89XFw/XFxeX2B7XFx8fX5cXC5dfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSsoPzpbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XFwuXXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXXxcXHMpKjwoLispPiQvaTtcblxuICAgIHZhciBjcmVkaXRDYXJkID0gL14oPzo0WzAtOV17MTJ9KD86WzAtOV17M30pP3w1WzEtNV1bMC05XXsxNH18Nig/OjAxMXw1WzAtOV1bMC05XSlbMC05XXsxMn18M1s0N11bMC05XXsxM318Myg/OjBbMC01XXxbNjhdWzAtOV0pWzAtOV17MTF9fCg/OjIxMzF8MTgwMHwzNVxcZHszfSlcXGR7MTF9KSQvO1xuXG4gICAgdmFyIGlzaW4gPSAvXltBLVpdezJ9WzAtOUEtWl17OX1bMC05XSQvO1xuXG4gICAgdmFyIGlzYm4xME1heWJlID0gL14oPzpbMC05XXs5fVh8WzAtOV17MTB9KSQvXG4gICAgICAsIGlzYm4xM01heWJlID0gL14oPzpbMC05XXsxM30pJC87XG5cbiAgICB2YXIgaXB2NE1heWJlID0gL14oXFxkKylcXC4oXFxkKylcXC4oXFxkKylcXC4oXFxkKykkL1xuICAgICAgLCBpcHY2QmxvY2sgPSAvXlswLTlBLUZdezEsNH0kL2k7XG5cbiAgICB2YXIgdXVpZCA9IHtcbiAgICAgICAgJzMnOiAvXlswLTlBLUZdezh9LVswLTlBLUZdezR9LTNbMC05QS1GXXszfS1bMC05QS1GXXs0fS1bMC05QS1GXXsxMn0kL2lcbiAgICAgICwgJzQnOiAvXlswLTlBLUZdezh9LVswLTlBLUZdezR9LTRbMC05QS1GXXszfS1bODlBQl1bMC05QS1GXXszfS1bMC05QS1GXXsxMn0kL2lcbiAgICAgICwgJzUnOiAvXlswLTlBLUZdezh9LVswLTlBLUZdezR9LTVbMC05QS1GXXszfS1bODlBQl1bMC05QS1GXXszfS1bMC05QS1GXXsxMn0kL2lcbiAgICAgICwgYWxsOiAvXlswLTlBLUZdezh9LVswLTlBLUZdezR9LVswLTlBLUZdezR9LVswLTlBLUZdezR9LVswLTlBLUZdezEyfSQvaVxuICAgIH07XG5cbiAgICB2YXIgYWxwaGEgPSAvXltBLVpdKyQvaVxuICAgICAgLCBhbHBoYW51bWVyaWMgPSAvXlswLTlBLVpdKyQvaVxuICAgICAgLCBudW1lcmljID0gL15bLStdP1swLTldKyQvXG4gICAgICAsIGludCA9IC9eKD86Wy0rXT8oPzowfFsxLTldWzAtOV0qKSkkL1xuICAgICAgLCBmbG9hdCA9IC9eKD86Wy0rXT8oPzpbMC05XSspKT8oPzpcXC5bMC05XSopPyg/OltlRV1bXFwrXFwtXT8oPzpbMC05XSspKT8kL1xuICAgICAgLCBoZXhhZGVjaW1hbCA9IC9eWzAtOUEtRl0rJC9pXG4gICAgICAsIGhleGNvbG9yID0gL14jPyhbMC05QS1GXXszfXxbMC05QS1GXXs2fSkkL2k7XG5cbiAgICB2YXIgYXNjaWkgPSAvXltcXHgwMC1cXHg3Rl0rJC9cbiAgICAgICwgbXVsdGlieXRlID0gL1teXFx4MDAtXFx4N0ZdL1xuICAgICAgLCBmdWxsV2lkdGggPSAvW15cXHUwMDIwLVxcdTAwN0VcXHVGRjYxLVxcdUZGOUZcXHVGRkEwLVxcdUZGRENcXHVGRkU4LVxcdUZGRUUwLTlhLXpBLVpdL1xuICAgICAgLCBoYWxmV2lkdGggPSAvW1xcdTAwMjAtXFx1MDA3RVxcdUZGNjEtXFx1RkY5RlxcdUZGQTAtXFx1RkZEQ1xcdUZGRTgtXFx1RkZFRTAtOWEtekEtWl0vO1xuXG4gICAgdmFyIHN1cnJvZ2F0ZVBhaXIgPSAvW1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGXS87XG5cbiAgICB2YXIgYmFzZTY0ID0gL14oPzpbQS1aMC05K1xcL117NH0pKig/OltBLVowLTkrXFwvXXsyfT09fFtBLVowLTkrXFwvXXszfT18W0EtWjAtOStcXC9dezR9KSQvaTtcblxuICAgIHZhciBwaG9uZXMgPSB7XG4gICAgICAnemgtQ04nOiAvXihcXCs/MD84NlxcLT8pPzFbMzQ1Nzg5XVxcZHs5fSQvLFxuICAgICAgJ2VuLVpBJzogL14oXFwrPzI3fDApXFxkezl9JC8sXG4gICAgICAnZW4tQVUnOiAvXihcXCs/NjF8MCk0XFxkezh9JC8sXG4gICAgICAnZW4tSEsnOiAvXihcXCs/ODUyXFwtPyk/WzU2OV1cXGR7M31cXC0/XFxkezR9JC8sXG4gICAgICAnZnItRlInOiAvXihcXCs/MzN8MClbNjddXFxkezh9JC8sXG4gICAgICAncHQtUFQnOiAvXihcXCszNTEpPzlbMTIzNl1cXGR7N30kLyxcbiAgICAgICdlbC1HUic6IC9eKFxcKzMwKT8oKDJcXGR7OX0pfCg2OVxcZHs4fSkpJC8sXG4gICAgICAnZW4tR0InOiAvXihcXCs/NDR8MCk3XFxkezl9JC8sXG4gICAgICAnZW4tVVMnOiAvXihcXCs/MSk/WzItOV1cXGR7Mn1bMi05XSg/ITExKVxcZHs2fSQvLFxuICAgICAgJ2VuLVpNJzogL14oXFwrMjYpPzA5WzU2N11cXGR7N30kL1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuZXh0ZW5kID0gZnVuY3Rpb24gKG5hbWUsIGZuKSB7XG4gICAgICAgIHZhbGlkYXRvcltuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGFyZ3NbMF0gPSB2YWxpZGF0b3IudG9TdHJpbmcoYXJnc1swXSk7XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodmFsaWRhdG9yLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLy9SaWdodCBiZWZvcmUgZXhwb3J0aW5nIHRoZSB2YWxpZGF0b3Igb2JqZWN0LCBwYXNzIGVhY2ggb2YgdGhlIGJ1aWx0aW5zXG4gICAgLy90aHJvdWdoIGV4dGVuZCgpIHNvIHRoYXQgdGhlaXIgZmlyc3QgYXJndW1lbnQgaXMgY29lcmNlZCB0byBhIHN0cmluZ1xuICAgIHZhbGlkYXRvci5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHZhbGlkYXRvcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0b3JbbmFtZV0gIT09ICdmdW5jdGlvbicgfHwgbmFtZSA9PT0gJ3RvU3RyaW5nJyB8fFxuICAgICAgICAgICAgICAgICAgICBuYW1lID09PSAndG9EYXRlJyB8fCBuYW1lID09PSAnZXh0ZW5kJyB8fCBuYW1lID09PSAnaW5pdCcpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbGlkYXRvci5leHRlbmQobmFtZSwgdmFsaWRhdG9yW25hbWVdKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YWxpZGF0b3IudG9TdHJpbmcgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCcgJiYgaW5wdXQgIT09IG51bGwgJiYgaW5wdXQudG9TdHJpbmcpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaW5wdXQudG9TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dCA9PT0gbnVsbCB8fCB0eXBlb2YgaW5wdXQgPT09ICd1bmRlZmluZWQnIHx8IChpc05hTihpbnB1dCkgJiYgIWlucHV0Lmxlbmd0aCkpIHtcbiAgICAgICAgICAgIGlucHV0ID0gJyc7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaW5wdXQgKz0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IudG9EYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRlKSA9PT0gJ1tvYmplY3QgRGF0ZV0nKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBkYXRlID0gRGF0ZS5wYXJzZShkYXRlKTtcbiAgICAgICAgcmV0dXJuICFpc05hTihkYXRlKSA/IG5ldyBEYXRlKGRhdGUpIDogbnVsbDtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLnRvRmxvYXQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHN0cik7XG4gICAgfTtcblxuICAgIHZhbGlkYXRvci50b0ludCA9IGZ1bmN0aW9uIChzdHIsIHJhZGl4KSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChzdHIsIHJhZGl4IHx8IDEwKTtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLnRvQm9vbGVhbiA9IGZ1bmN0aW9uIChzdHIsIHN0cmljdCkge1xuICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyID09PSAnMScgfHwgc3RyID09PSAndHJ1ZSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0ciAhPT0gJzAnICYmIHN0ciAhPT0gJ2ZhbHNlJyAmJiBzdHIgIT09ICcnO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuZXF1YWxzID0gZnVuY3Rpb24gKHN0ciwgY29tcGFyaXNvbikge1xuICAgICAgICByZXR1cm4gc3RyID09PSB2YWxpZGF0b3IudG9TdHJpbmcoY29tcGFyaXNvbik7XG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5jb250YWlucyA9IGZ1bmN0aW9uIChzdHIsIGVsZW0pIHtcbiAgICAgICAgcmV0dXJuIHN0ci5pbmRleE9mKHZhbGlkYXRvci50b1N0cmluZyhlbGVtKSkgPj0gMDtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLm1hdGNoZXMgPSBmdW5jdGlvbiAoc3RyLCBwYXR0ZXJuLCBtb2RpZmllcnMpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChwYXR0ZXJuKSAhPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICAgICAgICAgIHBhdHRlcm4gPSBuZXcgUmVnRXhwKHBhdHRlcm4sIG1vZGlmaWVycyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdHRlcm4udGVzdChzdHIpO1xuICAgIH07XG5cbiAgICB2YXIgZGVmYXVsdF9lbWFpbF9vcHRpb25zID0ge1xuICAgICAgICBhbGxvd19kaXNwbGF5X25hbWU6IGZhbHNlLFxuICAgICAgICBhbGxvd191dGY4X2xvY2FsX3BhcnQ6IHRydWUsXG4gICAgICAgIHJlcXVpcmVfdGxkOiB0cnVlXG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5pc0VtYWlsID0gZnVuY3Rpb24gKHN0ciwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gbWVyZ2Uob3B0aW9ucywgZGVmYXVsdF9lbWFpbF9vcHRpb25zKTtcblxuICAgICAgICBpZiAob3B0aW9ucy5hbGxvd19kaXNwbGF5X25hbWUpIHtcbiAgICAgICAgICAgIHZhciBkaXNwbGF5X2VtYWlsID0gc3RyLm1hdGNoKGRpc3BsYXlOYW1lKTtcbiAgICAgICAgICAgIGlmIChkaXNwbGF5X2VtYWlsKSB7XG4gICAgICAgICAgICAgICAgc3RyID0gZGlzcGxheV9lbWFpbFsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgvXFxzLy50ZXN0KHN0cikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwYXJ0cyA9IHN0ci5zcGxpdCgnQCcpXG4gICAgICAgICAgLCBkb21haW4gPSBwYXJ0cy5wb3AoKVxuICAgICAgICAgICwgdXNlciA9IHBhcnRzLmpvaW4oJ0AnKTtcblxuICAgICAgICBpZiAoIXZhbGlkYXRvci5pc0ZRRE4oZG9tYWluLCB7cmVxdWlyZV90bGQ6IG9wdGlvbnMucmVxdWlyZV90bGR9KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuYWxsb3dfdXRmOF9sb2NhbF9wYXJ0ID9cbiAgICAgICAgICAgIGVtYWlsVXNlclV0ZjgudGVzdCh1c2VyKSA6XG4gICAgICAgICAgICBlbWFpbFVzZXIudGVzdCh1c2VyKTtcbiAgICB9O1xuXG4gICAgdmFyIGRlZmF1bHRfdXJsX29wdGlvbnMgPSB7XG4gICAgICAgIHByb3RvY29sczogWyAnaHR0cCcsICdodHRwcycsICdmdHAnIF1cbiAgICAgICwgcmVxdWlyZV90bGQ6IHRydWVcbiAgICAgICwgcmVxdWlyZV9wcm90b2NvbDogZmFsc2VcbiAgICAgICwgYWxsb3dfdW5kZXJzY29yZXM6IGZhbHNlXG4gICAgICAsIGFsbG93X3RyYWlsaW5nX2RvdDogZmFsc2VcbiAgICAgICwgYWxsb3dfcHJvdG9jb2xfcmVsYXRpdmVfdXJsczogZmFsc2VcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLmlzVVJMID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICAgICAgICBpZiAoIXVybCB8fCB1cmwubGVuZ3RoID49IDIwODMgfHwgL1xccy8udGVzdCh1cmwpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVybC5pbmRleE9mKCdtYWlsdG86JykgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zID0gbWVyZ2Uob3B0aW9ucywgZGVmYXVsdF91cmxfb3B0aW9ucyk7XG4gICAgICAgIHZhciBwcm90b2NvbCwgYXV0aCwgaG9zdCwgaG9zdG5hbWUsIHBvcnQsXG4gICAgICAgICAgICBwb3J0X3N0ciwgc3BsaXQ7XG4gICAgICAgIHNwbGl0ID0gdXJsLnNwbGl0KCc6Ly8nKTtcbiAgICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHByb3RvY29sID0gc3BsaXQuc2hpZnQoKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnByb3RvY29scy5pbmRleE9mKHByb3RvY29sKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5yZXF1aXJlX3Byb3RvY29sKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gIGVsc2UgaWYgKG9wdGlvbnMuYWxsb3dfcHJvdG9jb2xfcmVsYXRpdmVfdXJscyAmJiB1cmwuc3Vic3RyKDAsIDIpID09PSAnLy8nKSB7XG4gICAgICAgICAgICBzcGxpdFswXSA9IHVybC5zdWJzdHIoMik7XG4gICAgICAgIH1cbiAgICAgICAgdXJsID0gc3BsaXQuam9pbignOi8vJyk7XG4gICAgICAgIHNwbGl0ID0gdXJsLnNwbGl0KCcjJyk7XG4gICAgICAgIHVybCA9IHNwbGl0LnNoaWZ0KCk7XG5cbiAgICAgICAgc3BsaXQgPSB1cmwuc3BsaXQoJz8nKTtcbiAgICAgICAgdXJsID0gc3BsaXQuc2hpZnQoKTtcblxuICAgICAgICBzcGxpdCA9IHVybC5zcGxpdCgnLycpO1xuICAgICAgICB1cmwgPSBzcGxpdC5zaGlmdCgpO1xuICAgICAgICBzcGxpdCA9IHVybC5zcGxpdCgnQCcpO1xuICAgICAgICBpZiAoc3BsaXQubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgYXV0aCA9IHNwbGl0LnNoaWZ0KCk7XG4gICAgICAgICAgICBpZiAoYXV0aC5pbmRleE9mKCc6JykgPj0gMCAmJiBhdXRoLnNwbGl0KCc6JykubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBob3N0bmFtZSA9IHNwbGl0LmpvaW4oJ0AnKTtcbiAgICAgICAgc3BsaXQgPSBob3N0bmFtZS5zcGxpdCgnOicpO1xuICAgICAgICBob3N0ID0gc3BsaXQuc2hpZnQoKTtcbiAgICAgICAgaWYgKHNwbGl0Lmxlbmd0aCkge1xuICAgICAgICAgICAgcG9ydF9zdHIgPSBzcGxpdC5qb2luKCc6Jyk7XG4gICAgICAgICAgICBwb3J0ID0gcGFyc2VJbnQocG9ydF9zdHIsIDEwKTtcbiAgICAgICAgICAgIGlmICghL15bMC05XSskLy50ZXN0KHBvcnRfc3RyKSB8fCBwb3J0IDw9IDAgfHwgcG9ydCA+IDY1NTM1KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsaWRhdG9yLmlzSVAoaG9zdCkgJiYgIXZhbGlkYXRvci5pc0ZRRE4oaG9zdCwgb3B0aW9ucykgJiZcbiAgICAgICAgICAgICAgICBob3N0ICE9PSAnbG9jYWxob3N0Jykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmhvc3Rfd2hpdGVsaXN0ICYmXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5ob3N0X3doaXRlbGlzdC5pbmRleE9mKGhvc3QpID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmhvc3RfYmxhY2tsaXN0ICYmXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5ob3N0X2JsYWNrbGlzdC5pbmRleE9mKGhvc3QpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuaXNJUCA9IGZ1bmN0aW9uIChzdHIsIHZlcnNpb24pIHtcbiAgICAgICAgdmVyc2lvbiA9IHZhbGlkYXRvci50b1N0cmluZyh2ZXJzaW9uKTtcbiAgICAgICAgaWYgKCF2ZXJzaW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdG9yLmlzSVAoc3RyLCA0KSB8fCB2YWxpZGF0b3IuaXNJUChzdHIsIDYpO1xuICAgICAgICB9IGVsc2UgaWYgKHZlcnNpb24gPT09ICc0Jykge1xuICAgICAgICAgICAgaWYgKCFpcHY0TWF5YmUudGVzdChzdHIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KCcuJykuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHBhcnRzWzNdIDw9IDI1NTtcbiAgICAgICAgfSBlbHNlIGlmICh2ZXJzaW9uID09PSAnNicpIHtcbiAgICAgICAgICAgIHZhciBibG9ja3MgPSBzdHIuc3BsaXQoJzonKTtcbiAgICAgICAgICAgIHZhciBmb3VuZE9taXNzaW9uQmxvY2sgPSBmYWxzZTsgLy8gbWFya2VyIHRvIGluZGljYXRlIDo6XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEF0IGxlYXN0IHNvbWUgT1MgYWNjZXB0IHRoZSBsYXN0IDMyIGJpdHMgb2YgYW4gSVB2NiBhZGRyZXNzXG4gICAgICAgICAgICAvLyAoaS5lLiAyIG9mIHRoZSBibG9ja3MpIGluIElQdjQgbm90YXRpb24sIGFuZCBSRkMgMzQ5MyBzYXlzXG4gICAgICAgICAgICAvLyB0aGF0ICc6OmZmZmY6YS5iLmMuZCcgaXMgdmFsaWQgZm9yIElQdjQtbWFwcGVkIElQdjYgYWRkcmVzc2VzLFxuICAgICAgICAgICAgLy8gYW5kICc6OmEuYi5jLmQnIGlzIGRlcHJlY2F0ZWQsIGJ1dCBhbHNvIHZhbGlkLlxuICAgICAgICAgICAgdmFyIGZvdW5kSVB2NFRyYW5zaXRpb25CbG9jayA9IHZhbGlkYXRvci5pc0lQKGJsb2Nrc1tibG9ja3MubGVuZ3RoIC0gMV0sIDQpO1xuICAgICAgICAgICAgdmFyIGV4cGVjdGVkTnVtYmVyT2ZCbG9ja3MgPSBmb3VuZElQdjRUcmFuc2l0aW9uQmxvY2sgPyA3IDogODtcblxuICAgICAgICAgICAgaWYgKGJsb2Nrcy5sZW5ndGggPiBleHBlY3RlZE51bWJlck9mQmxvY2tzKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgLy8gaW5pdGlhbCBvciBmaW5hbCA6OlxuICAgICAgICAgICAgaWYgKHN0ciA9PT0gJzo6Jykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdHIuc3Vic3RyKDAsIDIpID09PSAnOjonKSB7XG4gICAgICAgICAgICAgICAgYmxvY2tzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgYmxvY2tzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgZm91bmRPbWlzc2lvbkJsb2NrID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RyLnN1YnN0cihzdHIubGVuZ3RoIC0gMikgPT09ICc6OicpIHtcbiAgICAgICAgICAgICAgICBibG9ja3MucG9wKCk7XG4gICAgICAgICAgICAgICAgYmxvY2tzLnBvcCgpO1xuICAgICAgICAgICAgICAgIGZvdW5kT21pc3Npb25CbG9jayA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgLy8gdGVzdCBmb3IgYSA6OiB3aGljaCBjYW4gbm90IGJlIGF0IHRoZSBzdHJpbmcgc3RhcnQvZW5kXG4gICAgICAgICAgICAgICAgLy8gc2luY2UgdGhvc2UgY2FzZXMgaGF2ZSBiZWVuIGhhbmRsZWQgYWJvdmVcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tzW2ldID09PSAnJyAmJiBpID4gMCAmJiBpIDwgYmxvY2tzLmxlbmd0aCAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmRPbWlzc2lvbkJsb2NrKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBtdWx0aXBsZSA6OiBpbiBhZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kT21pc3Npb25CbG9jayA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmb3VuZElQdjRUcmFuc2l0aW9uQmxvY2sgJiYgaSA9PSBibG9ja3MubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpdCBoYXMgYmVlbiBjaGVja2VkIGJlZm9yZSB0aGF0IHRoZSBsYXN0XG4gICAgICAgICAgICAgICAgICAgIC8vIGJsb2NrIGlzIGEgdmFsaWQgSVB2NCBhZGRyZXNzXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghaXB2NkJsb2NrLnRlc3QoYmxvY2tzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZm91bmRPbWlzc2lvbkJsb2NrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJsb2Nrcy5sZW5ndGggPj0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJsb2Nrcy5sZW5ndGggPT09IGV4cGVjdGVkTnVtYmVyT2ZCbG9ja3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICB2YXIgZGVmYXVsdF9mcWRuX29wdGlvbnMgPSB7XG4gICAgICAgIHJlcXVpcmVfdGxkOiB0cnVlXG4gICAgICAsIGFsbG93X3VuZGVyc2NvcmVzOiBmYWxzZVxuICAgICAgLCBhbGxvd190cmFpbGluZ19kb3Q6IGZhbHNlXG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5pc0ZRRE4gPSBmdW5jdGlvbiAoc3RyLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBtZXJnZShvcHRpb25zLCBkZWZhdWx0X2ZxZG5fb3B0aW9ucyk7XG5cbiAgICAgICAgLyogUmVtb3ZlIHRoZSBvcHRpb25hbCB0cmFpbGluZyBkb3QgYmVmb3JlIGNoZWNraW5nIHZhbGlkaXR5ICovXG4gICAgICAgIGlmIChvcHRpb25zLmFsbG93X3RyYWlsaW5nX2RvdCAmJiBzdHJbc3RyLmxlbmd0aCAtIDFdID09PSAnLicpIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgc3RyLmxlbmd0aCAtIDEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXJ0cyA9IHN0ci5zcGxpdCgnLicpO1xuICAgICAgICBpZiAob3B0aW9ucy5yZXF1aXJlX3RsZCkge1xuICAgICAgICAgICAgdmFyIHRsZCA9IHBhcnRzLnBvcCgpO1xuICAgICAgICAgICAgaWYgKCFwYXJ0cy5sZW5ndGggfHwgIS9eKFthLXpcXHUwMGExLVxcdWZmZmZdezIsfXx4blthLXowLTktXXsyLH0pJC9pLnRlc3QodGxkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBwYXJ0LCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBwYXJ0ID0gcGFydHNbaV07XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5hbGxvd191bmRlcnNjb3Jlcykge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0LmluZGV4T2YoJ19fJykgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBhcnQgPSBwYXJ0LnJlcGxhY2UoL18vZywgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEvXlthLXpcXHUwMGExLVxcdWZmZmYwLTktXSskL2kudGVzdChwYXJ0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJ0WzBdID09PSAnLScgfHwgcGFydFtwYXJ0Lmxlbmd0aCAtIDFdID09PSAnLScgfHxcbiAgICAgICAgICAgICAgICAgICAgcGFydC5pbmRleE9mKCctLS0nKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuaXNCb29sZWFuID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgIHJldHVybiAoWyd0cnVlJywgJ2ZhbHNlJywgJzEnLCAnMCddLmluZGV4T2Yoc3RyKSA+PSAwKTtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLmlzQWxwaGEgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgIHJldHVybiBhbHBoYS50ZXN0KHN0cik7XG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5pc0FscGhhbnVtZXJpYyA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgcmV0dXJuIGFscGhhbnVtZXJpYy50ZXN0KHN0cik7XG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5pc051bWVyaWMgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgIHJldHVybiBudW1lcmljLnRlc3Qoc3RyKTtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLmlzSGV4YWRlY2ltYWwgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgIHJldHVybiBoZXhhZGVjaW1hbC50ZXN0KHN0cik7XG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5pc0hleENvbG9yID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICByZXR1cm4gaGV4Y29sb3IudGVzdChzdHIpO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuaXNMb3dlcmNhc2UgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIgPT09IHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuaXNVcHBlcmNhc2UgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIgPT09IHN0ci50b1VwcGVyQ2FzZSgpO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuaXNJbnQgPSBmdW5jdGlvbiAoc3RyLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICByZXR1cm4gaW50LnRlc3Qoc3RyKSAmJiAoIW9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ21pbicpIHx8IHN0ciA+PSBvcHRpb25zLm1pbikgJiYgKCFvcHRpb25zLmhhc093blByb3BlcnR5KCdtYXgnKSB8fCBzdHIgPD0gb3B0aW9ucy5tYXgpO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuaXNGbG9hdCA9IGZ1bmN0aW9uIChzdHIsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIHJldHVybiBzdHIgIT09ICcnICYmIGZsb2F0LnRlc3Qoc3RyKSAmJiAoIW9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ21pbicpIHx8IHN0ciA+PSBvcHRpb25zLm1pbikgJiYgKCFvcHRpb25zLmhhc093blByb3BlcnR5KCdtYXgnKSB8fCBzdHIgPD0gb3B0aW9ucy5tYXgpO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuaXNEaXZpc2libGVCeSA9IGZ1bmN0aW9uIChzdHIsIG51bSkge1xuICAgICAgICByZXR1cm4gdmFsaWRhdG9yLnRvRmxvYXQoc3RyKSAlIHZhbGlkYXRvci50b0ludChudW0pID09PSAwO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuaXNOdWxsID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLmxlbmd0aCA9PT0gMDtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLmlzTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgbWluLCBtYXgpIHtcbiAgICAgICAgdmFyIHN1cnJvZ2F0ZVBhaXJzID0gc3RyLm1hdGNoKC9bXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZdL2cpIHx8IFtdO1xuICAgICAgICB2YXIgbGVuID0gc3RyLmxlbmd0aCAtIHN1cnJvZ2F0ZVBhaXJzLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGxlbiA+PSBtaW4gJiYgKHR5cGVvZiBtYXggPT09ICd1bmRlZmluZWQnIHx8IGxlbiA8PSBtYXgpO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuaXNCeXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgbWluLCBtYXgpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5sZW5ndGggPj0gbWluICYmICh0eXBlb2YgbWF4ID09PSAndW5kZWZpbmVkJyB8fCBzdHIubGVuZ3RoIDw9IG1heCk7XG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5pc1VVSUQgPSBmdW5jdGlvbiAoc3RyLCB2ZXJzaW9uKSB7XG4gICAgICAgIHZhciBwYXR0ZXJuID0gdXVpZFt2ZXJzaW9uID8gdmVyc2lvbiA6ICdhbGwnXTtcbiAgICAgICAgcmV0dXJuIHBhdHRlcm4gJiYgcGF0dGVybi50ZXN0KHN0cik7XG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5pc0RhdGUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgIHJldHVybiAhaXNOYU4oRGF0ZS5wYXJzZShzdHIpKTtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLmlzQWZ0ZXIgPSBmdW5jdGlvbiAoc3RyLCBkYXRlKSB7XG4gICAgICAgIHZhciBjb21wYXJpc29uID0gdmFsaWRhdG9yLnRvRGF0ZShkYXRlIHx8IG5ldyBEYXRlKCkpXG4gICAgICAgICAgLCBvcmlnaW5hbCA9IHZhbGlkYXRvci50b0RhdGUoc3RyKTtcbiAgICAgICAgcmV0dXJuICEhKG9yaWdpbmFsICYmIGNvbXBhcmlzb24gJiYgb3JpZ2luYWwgPiBjb21wYXJpc29uKTtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLmlzQmVmb3JlID0gZnVuY3Rpb24gKHN0ciwgZGF0ZSkge1xuICAgICAgICB2YXIgY29tcGFyaXNvbiA9IHZhbGlkYXRvci50b0RhdGUoZGF0ZSB8fCBuZXcgRGF0ZSgpKVxuICAgICAgICAgICwgb3JpZ2luYWwgPSB2YWxpZGF0b3IudG9EYXRlKHN0cik7XG4gICAgICAgIHJldHVybiBvcmlnaW5hbCAmJiBjb21wYXJpc29uICYmIG9yaWdpbmFsIDwgY29tcGFyaXNvbjtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLmlzSW4gPSBmdW5jdGlvbiAoc3RyLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9wdGlvbnMpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgICAgIGZvciAoaSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSB2YWxpZGF0b3IudG9TdHJpbmcob3B0aW9uc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXJyYXkuaW5kZXhPZihzdHIpID49IDA7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShzdHIpO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuaW5kZXhPZihzdHIpID49IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuaXNDcmVkaXRDYXJkID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICB2YXIgc2FuaXRpemVkID0gc3RyLnJlcGxhY2UoL1teMC05XSsvZywgJycpO1xuICAgICAgICBpZiAoIWNyZWRpdENhcmQudGVzdChzYW5pdGl6ZWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN1bSA9IDAsIGRpZ2l0LCB0bXBOdW0sIHNob3VsZERvdWJsZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IHNhbml0aXplZC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgZGlnaXQgPSBzYW5pdGl6ZWQuc3Vic3RyaW5nKGksIChpICsgMSkpO1xuICAgICAgICAgICAgdG1wTnVtID0gcGFyc2VJbnQoZGlnaXQsIDEwKTtcbiAgICAgICAgICAgIGlmIChzaG91bGREb3VibGUpIHtcbiAgICAgICAgICAgICAgICB0bXBOdW0gKj0gMjtcbiAgICAgICAgICAgICAgICBpZiAodG1wTnVtID49IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1bSArPSAoKHRtcE51bSAlIDEwKSArIDEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN1bSArPSB0bXBOdW07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdW0gKz0gdG1wTnVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hvdWxkRG91YmxlID0gIXNob3VsZERvdWJsZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gISEoKHN1bSAlIDEwKSA9PT0gMCA/IHNhbml0aXplZCA6IGZhbHNlKTtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLmlzSVNJTiA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgaWYgKCFpc2luLnRlc3Qoc3RyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoZWNrc3VtU3RyID0gc3RyLnJlcGxhY2UoL1tBLVpdL2csIGZ1bmN0aW9uKGNoYXJhY3Rlcikge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGNoYXJhY3RlciwgMzYpO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgc3VtID0gMCwgZGlnaXQsIHRtcE51bSwgc2hvdWxkRG91YmxlID0gdHJ1ZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IGNoZWNrc3VtU3RyLmxlbmd0aCAtIDI7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBkaWdpdCA9IGNoZWNrc3VtU3RyLnN1YnN0cmluZyhpLCAoaSArIDEpKTtcbiAgICAgICAgICAgIHRtcE51bSA9IHBhcnNlSW50KGRpZ2l0LCAxMCk7XG4gICAgICAgICAgICBpZiAoc2hvdWxkRG91YmxlKSB7XG4gICAgICAgICAgICAgICAgdG1wTnVtICo9IDI7XG4gICAgICAgICAgICAgICAgaWYgKHRtcE51bSA+PSAxMCkge1xuICAgICAgICAgICAgICAgICAgICBzdW0gKz0gdG1wTnVtICsgMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdW0gKz0gdG1wTnVtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3VtICs9IHRtcE51bTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNob3VsZERvdWJsZSA9ICFzaG91bGREb3VibGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VJbnQoc3RyLnN1YnN0cihzdHIubGVuZ3RoIC0gMSksIDEwKSA9PT0gKDEwMDAwIC0gc3VtKSAlIDEwO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuaXNJU0JOID0gZnVuY3Rpb24gKHN0ciwgdmVyc2lvbikge1xuICAgICAgICB2ZXJzaW9uID0gdmFsaWRhdG9yLnRvU3RyaW5nKHZlcnNpb24pO1xuICAgICAgICBpZiAoIXZlcnNpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0b3IuaXNJU0JOKHN0ciwgMTApIHx8IHZhbGlkYXRvci5pc0lTQk4oc3RyLCAxMyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNhbml0aXplZCA9IHN0ci5yZXBsYWNlKC9bXFxzLV0rL2csICcnKVxuICAgICAgICAgICwgY2hlY2tzdW0gPSAwLCBpO1xuICAgICAgICBpZiAodmVyc2lvbiA9PT0gJzEwJykge1xuICAgICAgICAgICAgaWYgKCFpc2JuMTBNYXliZS50ZXN0KHNhbml0aXplZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgOTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY2hlY2tzdW0gKz0gKGkgKyAxKSAqIHNhbml0aXplZC5jaGFyQXQoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2FuaXRpemVkLmNoYXJBdCg5KSA9PT0gJ1gnKSB7XG4gICAgICAgICAgICAgICAgY2hlY2tzdW0gKz0gMTAgKiAxMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2hlY2tzdW0gKz0gMTAgKiBzYW5pdGl6ZWQuY2hhckF0KDkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChjaGVja3N1bSAlIDExKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIXNhbml0aXplZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlICBpZiAodmVyc2lvbiA9PT0gJzEzJykge1xuICAgICAgICAgICAgaWYgKCFpc2JuMTNNYXliZS50ZXN0KHNhbml0aXplZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZmFjdG9yID0gWyAxLCAzIF07XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgICAgIGNoZWNrc3VtICs9IGZhY3RvcltpICUgMl0gKiBzYW5pdGl6ZWQuY2hhckF0KGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNhbml0aXplZC5jaGFyQXQoMTIpIC0gKCgxMCAtIChjaGVja3N1bSAlIDEwKSkgJSAxMCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFzYW5pdGl6ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuaXNNb2JpbGVQaG9uZSA9IGZ1bmN0aW9uKHN0ciwgbG9jYWxlKSB7XG4gICAgICAgIGlmIChsb2NhbGUgaW4gcGhvbmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcGhvbmVzW2xvY2FsZV0udGVzdChzdHIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgdmFyIGRlZmF1bHRfY3VycmVuY3lfb3B0aW9ucyA9IHtcbiAgICAgICAgc3ltYm9sOiAnJCdcbiAgICAgICwgcmVxdWlyZV9zeW1ib2w6IGZhbHNlXG4gICAgICAsIGFsbG93X3NwYWNlX2FmdGVyX3N5bWJvbDogZmFsc2VcbiAgICAgICwgc3ltYm9sX2FmdGVyX2RpZ2l0czogZmFsc2VcbiAgICAgICwgYWxsb3dfbmVnYXRpdmVzOiB0cnVlXG4gICAgICAsIHBhcmVuc19mb3JfbmVnYXRpdmVzOiBmYWxzZVxuICAgICAgLCBuZWdhdGl2ZV9zaWduX2JlZm9yZV9kaWdpdHM6IGZhbHNlXG4gICAgICAsIG5lZ2F0aXZlX3NpZ25fYWZ0ZXJfZGlnaXRzOiBmYWxzZVxuICAgICAgLCBhbGxvd19uZWdhdGl2ZV9zaWduX3BsYWNlaG9sZGVyOiBmYWxzZVxuICAgICAgLCB0aG91c2FuZHNfc2VwYXJhdG9yOiAnLCdcbiAgICAgICwgZGVjaW1hbF9zZXBhcmF0b3I6ICcuJ1xuICAgICAgLCBhbGxvd19zcGFjZV9hZnRlcl9kaWdpdHM6IGZhbHNlXG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5pc0N1cnJlbmN5ID0gZnVuY3Rpb24gKHN0ciwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gbWVyZ2Uob3B0aW9ucywgZGVmYXVsdF9jdXJyZW5jeV9vcHRpb25zKTtcblxuICAgICAgICByZXR1cm4gY3VycmVuY3lSZWdleChvcHRpb25zKS50ZXN0KHN0cik7XG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5pc0pTT04gPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBKU09OLnBhcnNlKHN0cik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLmlzTXVsdGlieXRlID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICByZXR1cm4gbXVsdGlieXRlLnRlc3Qoc3RyKTtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLmlzQXNjaWkgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgIHJldHVybiBhc2NpaS50ZXN0KHN0cik7XG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5pc0Z1bGxXaWR0aCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bGxXaWR0aC50ZXN0KHN0cik7XG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5pc0hhbGZXaWR0aCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgcmV0dXJuIGhhbGZXaWR0aC50ZXN0KHN0cik7XG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5pc1ZhcmlhYmxlV2lkdGggPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgIHJldHVybiBmdWxsV2lkdGgudGVzdChzdHIpICYmIGhhbGZXaWR0aC50ZXN0KHN0cik7XG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5pc1N1cnJvZ2F0ZVBhaXIgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICAgIHJldHVybiBzdXJyb2dhdGVQYWlyLnRlc3Qoc3RyKTtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLmlzQmFzZTY0ID0gZnVuY3Rpb24gKHN0cikge1xuICAgICAgICByZXR1cm4gYmFzZTY0LnRlc3Qoc3RyKTtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLmlzTW9uZ29JZCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRvci5pc0hleGFkZWNpbWFsKHN0cikgJiYgc3RyLmxlbmd0aCA9PT0gMjQ7XG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5sdHJpbSA9IGZ1bmN0aW9uIChzdHIsIGNoYXJzKSB7XG4gICAgICAgIHZhciBwYXR0ZXJuID0gY2hhcnMgPyBuZXcgUmVnRXhwKCdeWycgKyBjaGFycyArICddKycsICdnJykgOiAvXlxccysvZztcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHBhdHRlcm4sICcnKTtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLnJ0cmltID0gZnVuY3Rpb24gKHN0ciwgY2hhcnMpIHtcbiAgICAgICAgdmFyIHBhdHRlcm4gPSBjaGFycyA/IG5ldyBSZWdFeHAoJ1snICsgY2hhcnMgKyAnXSskJywgJ2cnKSA6IC9cXHMrJC9nO1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UocGF0dGVybiwgJycpO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IudHJpbSA9IGZ1bmN0aW9uIChzdHIsIGNoYXJzKSB7XG4gICAgICAgIHZhciBwYXR0ZXJuID0gY2hhcnMgPyBuZXcgUmVnRXhwKCdeWycgKyBjaGFycyArICddK3xbJyArIGNoYXJzICsgJ10rJCcsICdnJykgOiAvXlxccyt8XFxzKyQvZztcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHBhdHRlcm4sICcnKTtcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLmVzY2FwZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgcmV0dXJuIChzdHIucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgJyYjeDI3OycpXG4gICAgICAgICAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgICAgICAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFwvL2csICcmI3gyRjsnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcYC9nLCAnJiM5NjsnKSk7XG4gICAgfTtcblxuICAgIHZhbGlkYXRvci5zdHJpcExvdyA9IGZ1bmN0aW9uIChzdHIsIGtlZXBfbmV3X2xpbmVzKSB7XG4gICAgICAgIHZhciBjaGFycyA9IGtlZXBfbmV3X2xpbmVzID8gJ1xcXFx4MDAtXFxcXHgwOVxcXFx4MEJcXFxceDBDXFxcXHgwRS1cXFxceDFGXFxcXHg3RicgOiAnXFxcXHgwMC1cXFxceDFGXFxcXHg3Ric7XG4gICAgICAgIHJldHVybiB2YWxpZGF0b3IuYmxhY2tsaXN0KHN0ciwgY2hhcnMpO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3Iud2hpdGVsaXN0ID0gZnVuY3Rpb24gKHN0ciwgY2hhcnMpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoJ1teJyArIGNoYXJzICsgJ10rJywgJ2cnKSwgJycpO1xuICAgIH07XG5cbiAgICB2YWxpZGF0b3IuYmxhY2tsaXN0ID0gZnVuY3Rpb24gKHN0ciwgY2hhcnMpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoJ1snICsgY2hhcnMgKyAnXSsnLCAnZycpLCAnJyk7XG4gICAgfTtcblxuICAgIHZhciBkZWZhdWx0X25vcm1hbGl6ZV9lbWFpbF9vcHRpb25zID0ge1xuICAgICAgICBsb3dlcmNhc2U6IHRydWVcbiAgICB9O1xuXG4gICAgdmFsaWRhdG9yLm5vcm1hbGl6ZUVtYWlsID0gZnVuY3Rpb24gKGVtYWlsLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBtZXJnZShvcHRpb25zLCBkZWZhdWx0X25vcm1hbGl6ZV9lbWFpbF9vcHRpb25zKTtcbiAgICAgICAgaWYgKCF2YWxpZGF0b3IuaXNFbWFpbChlbWFpbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFydHMgPSBlbWFpbC5zcGxpdCgnQCcsIDIpO1xuICAgICAgICBwYXJ0c1sxXSA9IHBhcnRzWzFdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChwYXJ0c1sxXSA9PT0gJ2dtYWlsLmNvbScgfHwgcGFydHNbMV0gPT09ICdnb29nbGVtYWlsLmNvbScpIHtcbiAgICAgICAgICAgIHBhcnRzWzBdID0gcGFydHNbMF0udG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXC4vZywgJycpO1xuICAgICAgICAgICAgaWYgKHBhcnRzWzBdWzBdID09PSAnKycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJ0c1swXSA9IHBhcnRzWzBdLnNwbGl0KCcrJylbMF07XG4gICAgICAgICAgICBwYXJ0c1sxXSA9ICdnbWFpbC5jb20nO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMubG93ZXJjYXNlKSB7XG4gICAgICAgICAgICBwYXJ0c1swXSA9IHBhcnRzWzBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oJ0AnKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbWVyZ2Uob2JqLCBkZWZhdWx0cykge1xuICAgICAgICBvYmogPSBvYmogfHwge307XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmpba2V5XSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IGRlZmF1bHRzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjdXJyZW5jeVJlZ2V4KG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN5bWJvbCA9ICcoXFxcXCcgKyBvcHRpb25zLnN5bWJvbC5yZXBsYWNlKC9cXC4vZywgJ1xcXFwuJykgKyAnKScgKyAob3B0aW9ucy5yZXF1aXJlX3N5bWJvbCA/ICcnIDogJz8nKVxuICAgICAgICAgICAgLCBuZWdhdGl2ZSA9ICctPydcbiAgICAgICAgICAgICwgd2hvbGVfZG9sbGFyX2Ftb3VudF93aXRob3V0X3NlcCA9ICdbMS05XVxcXFxkKidcbiAgICAgICAgICAgICwgd2hvbGVfZG9sbGFyX2Ftb3VudF93aXRoX3NlcCA9ICdbMS05XVxcXFxkezAsMn0oXFxcXCcgKyBvcHRpb25zLnRob3VzYW5kc19zZXBhcmF0b3IgKyAnXFxcXGR7M30pKidcbiAgICAgICAgICAgICwgdmFsaWRfd2hvbGVfZG9sbGFyX2Ftb3VudHMgPSBbJzAnLCB3aG9sZV9kb2xsYXJfYW1vdW50X3dpdGhvdXRfc2VwLCB3aG9sZV9kb2xsYXJfYW1vdW50X3dpdGhfc2VwXVxuICAgICAgICAgICAgLCB3aG9sZV9kb2xsYXJfYW1vdW50ID0gJygnICsgdmFsaWRfd2hvbGVfZG9sbGFyX2Ftb3VudHMuam9pbignfCcpICsgJyk/J1xuICAgICAgICAgICAgLCBkZWNpbWFsX2Ftb3VudCA9ICcoXFxcXCcgKyBvcHRpb25zLmRlY2ltYWxfc2VwYXJhdG9yICsgJ1xcXFxkezJ9KT8nO1xuICAgICAgICB2YXIgcGF0dGVybiA9IHdob2xlX2RvbGxhcl9hbW91bnQgKyBkZWNpbWFsX2Ftb3VudDtcbiAgICAgICAgLy8gZGVmYXVsdCBpcyBuZWdhdGl2ZSBzaWduIGJlZm9yZSBzeW1ib2wsIGJ1dCB0aGVyZSBhcmUgdHdvIG90aGVyIG9wdGlvbnMgKGJlc2lkZXMgcGFyZW5zKVxuICAgICAgICBpZiAob3B0aW9ucy5hbGxvd19uZWdhdGl2ZXMgJiYgIW9wdGlvbnMucGFyZW5zX2Zvcl9uZWdhdGl2ZXMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLm5lZ2F0aXZlX3NpZ25fYWZ0ZXJfZGlnaXRzKSB7XG4gICAgICAgICAgICAgICAgcGF0dGVybiArPSBuZWdhdGl2ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG9wdGlvbnMubmVnYXRpdmVfc2lnbl9iZWZvcmVfZGlnaXRzKSB7XG4gICAgICAgICAgICAgICAgcGF0dGVybiA9IG5lZ2F0aXZlICsgcGF0dGVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBTb3V0aCBBZnJpY2FuIFJhbmQsIGZvciBleGFtcGxlLCB1c2VzIFIgMTIzIChzcGFjZSkgYW5kIFItMTIzIChubyBzcGFjZSlcbiAgICAgICAgaWYgKG9wdGlvbnMuYWxsb3dfbmVnYXRpdmVfc2lnbl9wbGFjZWhvbGRlcikge1xuICAgICAgICAgICAgcGF0dGVybiA9ICcoICg/IVxcXFwtKSk/JyArIHBhdHRlcm47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3B0aW9ucy5hbGxvd19zcGFjZV9hZnRlcl9zeW1ib2wpIHtcbiAgICAgICAgICAgIHBhdHRlcm4gPSAnID8nICsgcGF0dGVybjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcHRpb25zLmFsbG93X3NwYWNlX2FmdGVyX2RpZ2l0cykge1xuICAgICAgICAgICAgcGF0dGVybiArPSAnKCAoPyEkKSk/JztcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5zeW1ib2xfYWZ0ZXJfZGlnaXRzKSB7XG4gICAgICAgICAgICBwYXR0ZXJuICs9IHN5bWJvbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhdHRlcm4gPSBzeW1ib2wgKyBwYXR0ZXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmFsbG93X25lZ2F0aXZlcykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMucGFyZW5zX2Zvcl9uZWdhdGl2ZXMpIHtcbiAgICAgICAgICAgICAgICBwYXR0ZXJuID0gJyhcXFxcKCcgKyBwYXR0ZXJuICsgJ1xcXFwpfCcgKyBwYXR0ZXJuICsgJyknO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIShvcHRpb25zLm5lZ2F0aXZlX3NpZ25fYmVmb3JlX2RpZ2l0cyB8fCBvcHRpb25zLm5lZ2F0aXZlX3NpZ25fYWZ0ZXJfZGlnaXRzKSkge1xuICAgICAgICAgICAgICAgIHBhdHRlcm4gPSBuZWdhdGl2ZSArIHBhdHRlcm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAnXicgK1xuICAgICAgICAgICAgLy8gZW5zdXJlIHRoZXJlJ3MgYSBkb2xsYXIgYW5kL29yIGRlY2ltYWwgYW1vdW50LCBhbmQgdGhhdCBpdCBkb2Vzbid0IHN0YXJ0IHdpdGggYSBzcGFjZSBvciBhIG5lZ2F0aXZlIHNpZ24gZm9sbG93ZWQgYnkgYSBzcGFjZVxuICAgICAgICAgICAgJyg/IS0/ICkoPz0uKlxcXFxkKScgK1xuICAgICAgICAgICAgcGF0dGVybiArXG4gICAgICAgICAgICAnJCdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0b3IuaW5pdCgpO1xuXG4gICAgcmV0dXJuIHZhbGlkYXRvcjtcblxufSk7XG4iXX0=
