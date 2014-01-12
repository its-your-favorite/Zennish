/**
 * Created with JetBrains PhpStorm.
 * User: anfur_000
 * Date: 4/23/13
 * Time: 2:01 AM

 * This file is for the automatic tests the user may want to run to ensure their answers are right before submitting.
 */

var app = angular.module('automatedTest', []);
app.directive("automatedTest", function(){
    return {
        restrict: "E",
        replace: true,
        template: '<div ng-class="{aTest: true,' +
        'testPassed: (test.lastResult == true),' +
        'testFailed: (test.lastResult == false)}">' +
        '<input type="button" ng-click="test.doGuiRun()" value="&gt;" />' +
        '<input ng-model="test.funcName" value="{{theGame.currentStepTesteeFunctionName()}}" class="testFuncName" ng-class="{testParamsFailed: !test.canExtractFunction()}" title="{{ {true: \'Got it\', false: \'Cannot find a function by that name in your global scope\'}[test.canExtractFunction()] }}">' +
        '(<input ng-model="test.paramsJson" class="testParams" ng-class="{testParamsFailed: !test.canParseParams()}" title="{{ {true: \'Got it\', false: \'Not valid JSON array contents\'}[test.canParseParams()] }}">) =' +
        '<input ng-model="test.expectedJson" class="testExpected" ng-class="{testParamsFailed: !test.canParseExpected()}" title="{{ {true: \'Got it\', false: \'Not valid JSON value\'}[test.canParseExpected()] }}">' +
        '<span class="deleteButton" ng-click="theGame.removeTestById($index)" title="Delete Test">×</span>' +
        '</div>',
        link: function($scope, element) {
            $scope.test.flashTo = function(color ) {
                element.css("backgroundColor", color);
                setTimeout(function() {
                    element.css("backgroundColor", "");
                    }, 300);
            };

        }
    };
});

var AutomatedTest;

/**
 * Serves as class for a user's automated Tests and also the applications testing to verify the user's answers
 * @param obj
 * @constructor
 */
AutomatedTest = function (obj, step, challenge) {
    // what the hell is this? this.obj = obj;
    this.parseFromArray(obj, step, challenge);
    this.id = AutomatedTest.getNextId();
    //this.doGuiRun(false);
};

// singleton
AutomatedTest.getNextId = function(){
    AutomatedTest.testsSoFar = AutomatedTest.testsSoFar || 0;
    return AutomatedTest.testsSoFar++;
};

// Construct from the abbreviated format I use in challenge data
AutomatedTest.prototype.parseFromArray = function(thisTest, step, challenge) {
    var UNIQUE_VALUE = {};
    var comparer, expected=UNIQUE_VALUE, parameters;
    var functionNameToBeTested; //name of the function which this Step is evaluating for correctness. Will be dug out of code

    if (thisTest instanceof Array) {
        functionNameToBeTested =  false; //default to mostRecentlyUsed function
        parameters = thisTest;
        if (thisTest.hasOwnProperty("expected"))
            expected = thisTest.expected; // sure, allow sticking a property on an array
    } else {
        functionNameToBeTested = (thisTest.testee);
        parameters = assertIs(thisTest.params);
        expected = (thisTest.expected) || thisTest.solver || false;
    }
    functionNameToBeTested =  assert(functionNameToBeTested || step.defaultTestee || (step.addFunction && step.addFunction[0]) || challenge.defaultTestee);

    if (expected === UNIQUE_VALUE) //haven't found expected yet
        expected = assert( step.defaultSolution || challenge.defaultSolution, "missing solution");

    if (expected instanceof Function ) {
        expected = expected.apply(null,parameters); //calculate expected via callback
    }

    comparer = assert(thisTest.comparer || challenge.defaultComparer);
    this.funcName = functionNameToBeTested;
    this.expectedJson = JSON.stringify(expected);
    this.paramsJson = JSON.stringify(parameters).slice(1,-1); //remove brackets
};

AutomatedTest.prototype.canParseParams = function() {
    try {
        this.parseParams();
    } catch (e) {
        return false;
    }
    return true;
};

/**
 *
 */
AutomatedTest.prototype.parseParams = function() {
    return JSON.parse("[" + this.paramsJson + "]");
};

AutomatedTest.prototype.canParseExpected = function () {
  try { JSON.parse(this.expectedJson); } catch (e) {
      return false;
  }
    return true;
};

AutomatedTest.prototype.canExtractFunction = function() {
    try {
        return typeof(ideExtractFunction(this.funcName, false)) == "function";
    } catch (e) {
        return false;
    }
};

/**
 * This runs a test and provides graphical feedback
 *
 * @param useDebugger can be undefined = neutral, true = force yes, false = force no
 * @returns Error message string on failure, false on success
 */
AutomatedTest.prototype.run = function(codebase, useDebugger) {
    // going forward we can test that these are valid values by json decoding then encoding them
    // if they can't have those done then they are invalid
    var fname = this.funcName;
    var comparer = function(a,b) { return a == b;}, e, prob;

    try {
        var params = this.parseParams();
    } catch (e) {
        if (wouldBeValidJsonIfDoubleQuotes(this.paramsJson)){
            notifyGently("It looks like the parameters for one of your tests would be valid JSON if you swapped ' with \" ");
        };
        return "Parameters weren't parsable json: [" + this.paramsJson + "]";
    }

    try {
        var expected = JSON.parse(this.expectedJson);
    } catch(e) {
        if (wouldBeValidJsonIfDoubleQuotes(this.expectedJson)){
            notifyGently("It looks like the expected value for one of your tests would be valid JSON if you swapped ' with \" ");
        }
        return "Expected wasn't parsable";
    }
    try {
        return match = executeOneTest(codebase, fname, null, params, comparer, expected, useDebugger);
    } catch (e) {
        return e.toString();
    }
};

/**
 * This simply means update the gui (i.e. the redness of the box at the right etc) because it was a test initiated by the user
 *  and they are expecting a change.
 *
 *  This is a terrible name. As evidenced by the fact that I bothered to write a doc-block.
 *
 * @param useDebugger
 */
AutomatedTest.prototype.doGuiRun = function(useDebugger){
    var returned = this.run(ideExtractAllCode(this.funcName, useDebugger), useDebugger); //probably should refactor later @todo this shouldn't just be "grabbing" stuff out of the dom in theory
    this.lastResult = (returned === false);
    if (this.lastResult) {
        this.lastMessage = 'Success';
        this.flashTo("#50FF50");
    } else {
        this.lastMessage = returned;
        this.flashTo("#FF5050");
    }
    this.lastMessage = "Test #" + this.id + ", " + this.lastMessage;
    globalRecordToLog(this.lastMessage);
    return this.lastResult;
}

/**
 *
 * @returns {boolean}
 */
AutomatedTest.prototype.runAndDebug = function() {
    if (this.doGuiRun(false)) {
        return true;
    }
    var useDebugger = true;
    return this.run(ideExtractAllCode(this.funcName, useDebugger), useDebugger); //probably should refactor later @todo this shouldn't just be "grabbing" stuff out of the dom in theory
}