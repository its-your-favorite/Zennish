var handleError = function (x) {
    console.log(x);
    debugger;
};

var assert = function (x, name /*optional*/) {
    if (!x) {
        handleError("Assertion failed: " + name);
    }
    return x;
};

/**
 * False and zero are okay.
 * @param x
 */
var assertIs = function (x) {
    assert(typeof x !== "undefined");
    assert(x !== null);
    return x;
};

/**
 * Find expected: Executes a jquery selector and throws an error if there isn't at least 1 element in it.
 */
var fe = function (selector) {
    var res = $(selector);
    assert(res.length, "Finding selector: " + selector);
    return res;
};

var collapsed = false;
fe(".collapsible").click(function() {
    collapsed = !collapsed;
    fe("#rightPanel").toggleClass("collapsedRight");
    $(this).toggleClass("collapsedRight");
});

var myCodeMirror = CodeMirror(fe("#ideContainer")[0], {
    value: "//write your javascript here\n",
    mode: "javascript"
});


var saveData = function(key, value) {
    localStorage[key] = value;
};

var retrieveData = function(key) {
    return localStorage[key];
};

myCodeMirror.setSize(null, 550);