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

var session_id = _.memoize(function() {return new Date()|0;} ); //timestamp at load time

var saveData = function(key, value) {
    if(localStorage)
        localStorage[key] = value;
};

var retrieveData = function(key) {
    if (localStorage)
        return localStorage[key];
};


var executeOneTest = function(functionNameToBeTested, userNamespace, /* array */parameters, comparer, expected, useDebugger){
    var functionToBeTested = ideExtractFunctionAndDebugger(functionNameToBeTested, useDebugger);
    var givenVal;

    givenVal = functionToBeTested.apply(userNamespace, parameters);
    if (comparer(givenVal, expected))
        return false; //not a failure
    return functionNameToBeTested + "(" + parameters.map(JSON.stringify).join(", ") + ") returned " + JSON.stringify(givenVal) + ", expected " + JSON.stringify(expected);
}


var ideContents = function() {
    return myCodeMirror.getValue();
};

var ideContains = function(str) {
    return ( ideContents().indexOf(str) >= 0);
};

var setIdeText = function(str){
    myCodeMirror.setValue( str || "" );
}

var appendToIde = function(str) {
    myCodeMirror.setValue( myCodeMirror.getValue() + str);
};

var ideExtractFunction = function(name) {
    window.extractFunction = {};
    var code =  myCodeMirror.getValue() + ";\n\n window.extractFunction = " + name + ";";
    eval(code);
    return window.extractFunction;
};

var ideExtractFunctionAndDebugger = function(name, useDebugger) {

    var code =  myCodeMirror.getValue() + ";\n\n window.extractFunction = function(){" ;
    if (useDebugger === false) {
        code = code.replace(/debugger;/gi,'');
    }

    if (useDebugger == true) {
        if (ideExtractFunction(name).toString().match(/debugger;/gi) === null ) {
            code += "debugger;\n";
        }
    }
    code += "return " + name + ".apply(null, arguments);};";
    window.extractFunction = {};
    eval( code);
    return window.extractFunction;
};


myCodeMirror.setSize(null, 550);