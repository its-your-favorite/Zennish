var handleError = function (x) {
    console.log(x);
    debugger;
};

var isArray = function(x) {
  return x && (x.constructor.toString().indexOf("Array") >= 0);
};

var isNestedArray = function(x) {
    return (isArray(x) && x.hasOwnProperty(0) && isArray(x[0]) );//wee bit sloppy
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
$(document).on("click", ".collapsible",function(event) {
    collapsed = !collapsed;
    fe(event.target).parent().toggleClass("collapsed");
    $(this).toggleClass("collapsed");
});

var session_id = _.memoize(function() {return +new Date();} ); //timestamp at load time

var saveData = function(key, value) {
    if(localStorage)
        localStorage[key] = value;
};

var retrieveData = function(key) {
    if (localStorage)
        return localStorage[key];
};

var summarizeTest = function(parameters, givenVal, expected) {
    return name + "(" + parameters.map(JSON.stringify).join(", ") + ") returned " + JSON.stringify(givenVal) + ", expected " + JSON.stringify(expected);
}

var executeOneTest = function (allCode,name, userNamespace, /* array */parameters, comparer, expected, useDebugger){
    var givenVal;
    try {
        givenVal =
        window.extract = function(x) { givenVal = x};
        saferEval(""
            + allCode
            + (useDebugger ? "; debugger;" : "")
            + " extract(" + name + ".apply(" + JSON.stringify(userNamespace) + ", " + JSON.stringify(parameters) + "));"
            + "");
    } catch (e) {
        givenVal = "Exception: " + e;
    }

    if (comparer(givenVal, expected))
        return false; //not a failure

    return summarizeTest(parameters, givenVal, expected);
};

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

var globalRecordToLog = function(message) {
    globalCopy.theGame.recordToLog(message);
};

var appendToIde = function(str) {
    myCodeMirror.setValue( myCodeMirror.getValue() + str);
};

// for determining if the needed function is defined yet
var ideExtractFunction = function(name) {
    var result = false;
    window.extractTo=function(x) {
        result = x;
    };
    saferEval(ideExtractAllCode(name,false) + " extractTo(" + name + ");");
    return result;
};

/**
 *  useDebugger = false/undefined/true
 *
 **/
var ideExtractAllCode = function (name, useDebugger) {
    var extracted, tmp;
    if (name.match(/[\\\{\}\[\]\(\)\.'"\s\n\r]/)) { //invalid function name @todo improve logic here
        return false;
    }

    var code = myCodeMirror.getValue() + "\n\r\n /* */; " ; //this method still works with scopes
    if (useDebugger) {
        code = code.replace(/debugger;/gi,'');
    };

    try {
        saferEval( code);
        return code;
    } catch (e) {
        if (e.message === (name + " is not defined")) {
                throw "Couldn't find any function named " + name + " in your code. Please define that function and have it return the solution.";
        }
        throw "Couldn't parse your code, you've got syntax errors.";
    }
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
            {name:'name',index:'name', width:385, sorttype:"string"}, /* these widths must also match the css for #loadDialogtable */
            {name:'prettyDate',index:'prettyDate', width:100, sorttype:"float"},
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


    var menu1 = [
        {'Delete':function(menuItem, rightClickEvent) {
            $row = $(rightClickEvent.target);
            $row.hide();
            theSaveRowNum = $row.attr("id");

            var theSaveId = $tableSelector.jqGrid ('getCell', theSaveRowNum, 'id');
            PersistentStorage.deleteParticularSave(theSaveId);
        } } /*,
        $.contextMenu.separator,
        {'Option 2':function(menuItem,menu) { alert("You clicked Option 2!"); } }*/
    ];

    $tableSelector.find('tr').contextMenu(menu1,{theme:'vista'});
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

GeneralCrap.hiddenTime = 0;
GeneralCrap.lastHideTime = null;
GeneralCrap.oldTitle = '';
GeneralCrap.vizChange = function(){

    if ((document.visibilityState == 'visible') && (!$(".textOverlay:visible").length) || (document.location.toString().indexOf("challenge/id/"))<0) {
        // todo -- that's the most hackish line in this whole codebase... probably should do it better
            if (GeneralCrap.lastHideTime) {
                GeneralCrap.hiddenTime += (+new Date() - GeneralCrap.lastHideTime);
                document.title = GeneralCrap.oldTitle;
            }
            GeneralCrap.lastHideTime = false;
            /*$("body").animate({opacity:1}, 1000);/*/
            $("#myPauseScreen").animate({opacity: 0}, 700, function(){
            $("#myPauseScreen").hide();
        });
    }
    else if (! GeneralCrap.lastHideTime) {
        GeneralCrap.lastHideTime = +new Date();
        /* $("body").animate({opacity:.3}, 800); /*/
        $("#myPauseScreen").css('opacity', 1);
        $("#myPauseScreen").show();
        GeneralCrap.oldTitle = document.title;
        if (document.title.indexOf("PAUSE") >= 0)
            alert("Double pause");
        document.title = '[PAUSED] - ' + document.title
    }
};
document.addEventListener("visibilitychange", GeneralCrap.vizChange);

GeneralCrap.closeOverlay = function(){
  fe("#mySmokescreen").hide();
  fe("#myTextPiece").hide();
  GeneralCrap.vizChange();
};

GeneralCrap.isOverlayVisible = function(){
    return !!(fe("#mySmokescreen:visible").length + fe("#myTextPiece:visible"));
};

GeneralCrap.showOverlay = function(){
    fe("#mySmokescreen").show();
    fe("#myTextPiece").show();
    GeneralCrap.vizChange();
};

$('#closeOverlay').on('click', function() {
    GeneralCrap.closeOverlay();
    PersistentStorage.saveSetting({showed_splash_screen: true});
});

GeneralCrap.setCodeMirrorLocked = function(val) {
    myCodeMirror.setOption('readOnly', val);
}

$(window).keydown(function(event) {
    //escape
    if (event.which == 27 && (GeneralCrap.isOverlayVisible())) GeneralCrap.closeOverlay();

    //control-s handler
    if (!((event.which == 115 || event.which == 83) && event.ctrlKey) && !(event.which == 19)) return true;

    if ($("#saveButton:visible").length && ! GeneralCrap.isOverlayVisible()) {
        $("#saveButton:visible")[0].click();
    }
    event.preventDefault();
    return false;


});

angular.bootstrap(document, ['inlineEditing', 'automatedTest', 'challengeStep', 'rating']);