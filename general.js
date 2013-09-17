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
fe(".collapsible").click(function(event) {

    collapsed = !collapsed;
    fe(event.target).parent().toggleClass("collapsed");
    $(this).toggleClass("collapsed");
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


var executeOneTest = function (functionToBeTested,name, userNamespace, /* array */parameters, comparer, expected, useDebugger){
    var givenVal;
    try {
        givenVal = functionToBeTested.apply(userNamespace, parameters);
    } catch (e) {
        givenVal = "Exception: " + e;
    }

    if (comparer(givenVal, expected))
        return false; //not a failure
    return name + "(" + parameters.map(JSON.stringify).join(", ") + ") returned " + JSON.stringify(givenVal) + ", expected " + JSON.stringify(expected);
}

var wouldBeValidJsonIfDoubleQuotes = function(json) {
    try {
        JSON.parse(json);
        return false; //already valid
    } catch (e){
        try {
            JSON.parse(json.replace(/'/g, "\""));
            return true; //makes the difference
        } catch (e2) {
            return false; //makes no difference
        }
    }
};

// todo , use a real sandbox, but allow debugger somehow
var saferEval = function(code) {
    code = "(function() {" +
        "var window, Window, alert = console.log.bind(console);" +
        "(function() {" + code + " })();" +
        "})();"
    eval(code);
};

var notifyGently = NoteSystem.showNewNote.bind(NoteSystem);

var ideContents = function() {
    return myCodeMirror.getValue();
};

var ideContains = function(str) {
    return ( ideContents().indexOf(str) >= 0);
};

var setIdeText = function(str){
    var prev = myCodeMirror.getValue();
    myCodeMirror.setValue( str || "" );
    return prev;
}

var appendToIde = function(str) {
    myCodeMirror.setValue( myCodeMirror.getValue() + str);
};

var ideExtractFunction = function(name) {
    return ideExtractFunctionAndDebugger(name, false);
};

var ideExtractFunctionAndDebugger = function (name, removeDebugger) {
    console.log("ENSURE NAME IS valid js token");
    var extracted;
    window.extractFunction = function(x) { extracted = x};
    var code = myCodeMirror.getValue() + "; extractFunction(" + name + ");" ; //this method still works with scopes
    if (removeDebugger) {
        code = code.replace(/debugger;/gi,'');
    }
    try {
        saferEval( code);
    } catch (e) {

    }

    return extracted;
};

/**
 * So my understanding is that general crap is a set of conceptual functions that are specific to this application
 *  but only used once each.
 * @type {{}}
 */
var GeneralCrap = {};
// soo ugly.
GeneralCrap.setupLoadTable = function(){
    var $tableSelector = $("#loadDialogTable");
    $tableSelector.jqGrid({
        datatype: "local",
        colNames:['Name','Created', 'Lines of Code','is autosave','Step #','id'],
        colModel:[
            {name:'name',index:'name', width:'300', sorttype:"string"},
            {name:'prettyDate',index:'id', width:180, sorttype:"float"},
            {name:'linesOfCode', index:'linesOfCode', width: 145, sorttype:"float"},
            {name:'isAutosave',index:'isAutosave', width:100,sorttype:"float"},
            {name:'stepNum',index:'step_id', width:130, sortable:false},
            {name:'id', index:"id", key: true, width: 10} /**/
        ],

        rowNum:90,
        rowList:[10],
        sortname: 'id',
        viewrecords: true,
        sortorder: "desc",
        loadonce: true,
        height: $("#loadDialog").height()
    });

};

GeneralCrap.populateLoadTable = function(mydata){
    var $tableSelector = $("#loadDialogTable");

    $tableSelector.jqGrid('clearGridData');
    for(var i=0;i<=mydata.length;i++)
        $tableSelector.jqGrid('addRowData',i+1,mydata[i]);
};

GeneralCrap.attemptSubmitGrid = function() {
    var res = jQuery('#loadDialogTable').jqGrid('getGridParam', 'selrow');
    if (res === null)
        return;
    $("#modalLoadDialog").trigger("clickClose");
    return res;
}

GeneralCrap.useLoadDialog = function(recentLoadsArrays) {
    var $modalLoadDialog = $("#modalLoadDialog");
    var $table = $("#loadDialogTable");

    GeneralCrap.setupLoadTable();
    GeneralCrap.populateLoadTable(recentLoadsArrays);

    $modalLoadDialog.unbind();
    $modalLoadDialog.modal("show");
    $table.bind("jqGridDblClickRow", GeneralCrap.attemptSubmitGrid);

    return new Promise(function(succ, fail) {
        $modalLoadDialog.bind("hide", function() {
            fail();
        });
        $modalLoadDialog.bind("clickClose", function() {
            var theSaveRowNum = jQuery('#loadDialogTable').jqGrid('getGridParam', 'selrow');
            var theSaveId = $table.jqGrid ('getCell', theSaveRowNum, 'id');

            succ(theSaveId);
            $modalLoadDialog.modal("hide");
        })
    });
};

GeneralCrap.hideLoadDialog = function(){
    var $modalLoadDialog = $("#modalLoadDialog");
    $modalLoadDialog.modal("hide");
};

GeneralCrap.selectedTabId = 1;

GeneralCrap.setSelectedTab = function(x){
    this.selectedTabId=x;
};


myCodeMirror.setSize(null, 550);

angular.element(document).ready(function() {

    angular.bootstrap(document, ['inlineEditing', 'automatedTest']);
});