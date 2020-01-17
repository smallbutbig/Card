function removeClass(element, cls) {
    if (hasClass(element, cls)) {
        element.classList.remove(cls)
    }
}

function addClass(element, cls) {
    if (!hasClass(element, cls)) {
        element.classList.add(cls)
    }
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}