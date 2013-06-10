/**
 * Made By Alex
 * Date: 4/20/13
 * Time: 3:24 PM
 */

// CHECK - Add Keystrokes count
// - Add timer
// - The notice at the top should be a slide-down slide-under. If there's none, it slides down. Otherwise a new notice slides out from the one immediately above it.
// - the test parameters shouldn't need to be wrapped in [ ]
// - Grading should be done based on keystrokes. This will allow the copy-paste

// @todo
// all this needs to be namespaced & wrapped so user javascript can't mess with it.
// need to put mapToReduce and mapToMap in fancy for now
// need error log message when unit tests fail
// better gui on the unit tests. If params aren't parse-able then make the params box red. Same for the other 3. Make a result icon.
// Unit tests should auto convert semi-valid semi-json (e.g. ['aa']) to valid json ["aa"]
// running a test that just failed, and seeing the fail icon still (no change) makes it difficult to know that anything has changed

// Get a notification library for the following
// -- Not chrome
// -- Console not open
// -- tests couldn't run?

// Save buttons need better CSS (that is, hover state, and mouse-down reaction).
// Also they need post-click animations of some sort just to make it clear they've had an affect and the click didn't miss.

//http://adamschwartz.co/log/
// https://github.com/adamschwartz/chrome-inspector-detector
// Plus my own method. If I call debugger and there's no halt, then the console is closed.
// http://lab.hakim.se/ladda/

// Saving questions
// -- Saving just editor
//  -- Unit tests? (if so, is load a merge?)
//  -- Records of keystrokes, etc?

// Give a default test for every challenge ?

// Make a good user experience, intro, layover screen

/**
 * Icons - key - Yusuke Kamiyamane -
 *       - Check, X - Everaldo Coelho - Crystal Project
 */
'use strict';

//export
var testContainer;
var TheGame = function(challenges)  {
    var self = this;
    this.data = {challenges: challenges};
    this.startChallenge(0);
    this.log = "-- App Started --\n";
    this.userTests = FA([]);
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
    this.currentChallenge.keystrokes = 0;

    this.currentChallenge.steps = FA(this.currentChallenge.steps).map(function(x) { return new StepModel(x); });
    this.gotoStep(0);
    //testContainer.addTest({}/*demo */ );
};

TheGame.prototype.gotoStep = function(num) {
    var self = this;
    this.currentStepNum = num;
    this.startStep(this.getStep(num));

    var preload = PersistentStorage.loadCodeInitial(this.getCurrentStep().id, this.getCurrentChallenge().id).then(
          function(preload){
              if (preload.length){
                self.loadTextIntoIde( preload.item(0).snippet );
              }
          }, function(a) {
            alert("failed to load db");
        });
};

TheGame.prototype.getKey = function(params){
    return "_WorkWorkState:" + JSON.stringify(params);
};

TheGame.prototype.getCurrentKey = function(){
      return this.getKey({"challenge" : this.currentChallenge.id, "step" : this.getCurrentStep().id});
};

TheGame.prototype.loadTextIntoIde = function(x){
    setIdeText(x);
};

TheGame.prototype.startStep = function(step) {
    if (step.addFunction) {
        var f = step.addFunction;
        this.currentFunctionTestee = f[0];
        if (! ideContains(f[0]) ) //save'em a little typing
            appendToIde('\nvar ' + f[0] + ' = function (' + f.slice(1).join(", ") + ") { \n\n }; ");
    }
    step.keystrokes = 0;
    step.start();
};


TheGame.prototype.submitStep = function() {
    assert(this.getCurrentStep());

    var failures = this.doTests(this.getCurrentStep(), this.currentChallenge);
    if (failures.length)
        this.recordToLog(failures[0]);
    else {
        this.recordToLog("Passed step " + (this.currentStepNum + 1));
        this.saveCurrentEditor(false, "Your Correct Solution Step " + (this.currentStepNum + 1));
        this.advanceStep();
    }
    return failures.length;
};

TheGame.prototype.currentStepTesteeFunctionName = function() {
    return this.currentFunctionTestee;
};

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

TheGame.prototype.saveCurrentEditor = function(manual, name){

    PersistentStorage.saveCode (
        {snippet: ideContents(),
         session_id: session_id(),
         name: name || "unnamed",
         when: new Date(),
         isAutosave: !manual,
         challenge_id: this.getCurrentChallenge().id,
         step_id: this.getCurrentStep().id
        }
    );
    //saveData(this.getCurrentKey(), ideContents());
}

TheGame.prototype.updateTimeSpentForSteps = function() {
    this.getCurrentStep().updateTimeSpent();
}

/**
 * Meant to be run from the console
 */
TheGame.prototype.debugTests = function(doDebug) {
    return this.userTests.every(function(test) {
       test.runAndDebug(doDebug);
    });
};


/**
 * Meant to be run from the console
 */
TheGame.prototype.runAllTests = function() {
    return this.userTests.map(function(test) {
        test.doGuiRun();
    });
};

TheGame.prototype.getStep = function(n){
    return this.currentChallenge.steps[n];
}


TheGame.prototype.acknowledgeKeystroke = function() {

    var val = this.currentChallenge;
    if (val) {
        val.keystrokes++;
    }
    if (this.currentStepNum.constructor === (0).constructor){
        this.getCurrentStep().keystrokes++;
    }
}

TheGame.prototype.getCurrentStep = function() {
    var val = this.currentChallenge;
    return val.steps[this.currentStepNum];
}

TheGame.prototype.getCurrentChallenge = function() {
    return this.currentChallenge;
}