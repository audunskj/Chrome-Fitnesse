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