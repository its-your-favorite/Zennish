/**
 * Created with JetBrains PhpStorm.
 * User: anfur_000
 * Date: 4/20/13
 * Time: 3:24 PM
 * To change this template use File | Settings | File Templates.
 */
    // all this needs to be namespaced & wrapped so user javascript can't mess with it.

'use strict';

var executeOneTest = function(functionNameToBeTested, userNamespace, /* array */parameters, comparer, expected){
    var functionToBeTested = ideExtractFunction(functionNameToBeTested);
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
    eval( myCodeMirror.getValue() + "; window.extractFunction = " + name + ";");
    return window.extractFunction;
};

var renderStepPreview = function(step, isPrivate, isActive) {
    var res = $("<span>");
    var words = isPrivate ? "???????" : step.description;

    isActive && res.addClass("active");
    isPrivate && res.addClass('future');

    res.text(words).addClass('challengeStep');
    return res[0].outerHTML;
};

//export
var testContainer;
var TheGame = function(challenges)  {
    this.data = {challenges: challenges};
    this.startChallenge(0);
    this.log = "-- App Started --\n";
    this.userTests = [];
};

TheGame.prototype.advanceStep = function(){
  assert(this.currentChallenge);
  var nextStep = this.currentStepNum+1;

  if (this.currentChallenge.steps.length <= nextStep)
        return alert("All solved!");
    else
        this.gotoStep(nextStep);
};

TheGame.prototype.startChallenge = function(num) {
    this.currentFunctionTestee = "someFunction";
    this.currentChallenge = this.data.challenges[num];
    this.gotoStep(0);
    this.currentChallenge.steps = this.currentChallenge.steps.map(function(x) { return new StepModel(x); });
    //testContainer.addTest({}/*demo */ );
};

TheGame.prototype.gotoStep = function(num) {
      this.currentStepNum = num;
      this.startStep(this.currentChallenge.steps[num]);
      var preload = retrieveData(this.getCurrentKey());
      if (preload){
        this.loadTextIntoIde( preload );
      }
};

TheGame.prototype.getKey = function(params){
    return "_WorkWorkState:" + JSON.stringify(params);
}

TheGame.prototype.getCurrentKey = function(){
      return this.getKey({"challenge" : this.currentChallenge.id, "step" : this.currentStep.id});
}

TheGame.prototype.loadTextIntoIde = function(x){
    setIdeText(x);
}

TheGame.prototype.startStep = function(step) {
    if (step.addFunction) {
        var f = step.addFunction;
        this.currentFunctionTestee = f[0];
        if (! ideContains(f[0]) ) //save'em a little typing
            appendToIde('\nvar ' + f[0] + ' = function (' + f.slice(1).join(", ") + ") { \n\n }; ");
    }
    this.currentStep = step;
};


TheGame.prototype.submitStep = function() {
    assert(this.currentStep);

    var failures = this.doTests(this.currentStep, this.currentChallenge);
    if (failures.length)
        this.recordToLog(failures[0]);
    else {
        this.recordToLog("Passed step " + (this.currentStepNum + 1));
        saveData(this.getCurrentKey(), ideContents());
        this.advanceStep();
    }
    return failures.length;
};

TheGame.prototype.currentStepTesteeFunctionName = function() {
    return this.currentFunctionTestee;
}

TheGame.prototype.doTests = function(step, challenge) {
    var userNamespace = window; //change later

    assert(step && step.tests);

    var failures = FA(step.tests).map(function(thisTest) {
        var comparer, expected, parameters, functionNameToBeTested; //name of the function to be called

        if (thisTest instanceof Array) {
            functionNameToBeTested =  false; //default to mostRecentlyUsed function
            parameters = thisTest;
            expected = false;
        } else {
            functionNameToBeTested = (thisTest.testee);
            parameters = assertIs(thisTest.params);
            expected = (thisTest.expected) || thisTest.solver || false;
        }
        functionNameToBeTested =  assert(functionNameToBeTested || step.defaultTestee || (step.addFunction && step.addFunction[0]) || challenge.defaultTestee);
        expected = assert(expected || step.defaultSolution || challenge.defaultSolution, "missing solution");

        if (expected instanceof Function ) {
            expected = expected.apply(null,parameters); //calculate expected via callback
        }

        comparer = assert(thisTest.comparer || challenge.defaultComparer);
        return executeOneTest(functionNameToBeTested, userNamespace, parameters, comparer, expected);
    }).filter();

    //write this more;
    return failures;
};

TheGame.prototype.recordToLog = function(str) {
    this.log += "\n" + str;
    //use other console. use color @todo
};

TheGame.prototype.addTest = function(obj) {
    this.userTests.push(new AutomatedTest(obj, this.currentStepTesteeFunctionName()));
}

TheGame.prototype.removeTestById = function(id) {
    this.userTests.splice(id,1);
}

TheGame.prototype.saveCurrentEditor = function()


var add = function(a,b) { return a + b; };
var toDecimal = function(a) { return parseInt(a, 16);};

/*
var averageColors = function(col1,col2) {
    debugger;
    var cols = [col1, col2];

    var mixed = FA(_.zip.apply(null,cols.map(function(col) {
        return FA(col.split("")).chunk(2).map(toDecimal);
    }))).map(function(x) { FA(x).reduce("+");}).map("/2");

    returned mixed;
};*/