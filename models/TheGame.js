/**
 * Made By Alex
 * Date: 4/20/13
 * Time: 3:24 PM
 */

// CHECK - Add Keystrokes count
// - Grading should be done based on keystrokes. This will allow the copy-paste
// - The notice at the top should be a slide-down slide-under. If there's none, it slides down. Otherwise a new notice slides out from the one immediately above it.
// - the test parameters shouldn't need to be wrapped in [ ]
// - Add timer
// - Replace save system with much more powerful web Sql one.
// - Use promises to power web sql queries.
// - Implement load system
// - Implement modal load dialog here. http://twitter.github.io/bootstrap/javascript.html
// - Have multiple text windows open at once? Closable separately?
// - Need new frame button
// - better gui on the unit tests. If params aren't parse-able then make the params box red.
// - Same for the other 3. 

// @todo -- below



// Big Picture: Startup interface
//      Name, author, what is this
//      choose challenge (use known state to resume appropriately)



// Goes into what I've currently made... which then needs a way to quit back out.
// On completion it shows stats, (maybe allows leaderboard), maybe allows a share link,  and perhaps auto-quits.
//

// need to be able to rename frames and have it save back

// need error log message when unit tests fail
// Unit tests should auto convert semi-valid semi-json (e.g. ['aa']) to valid json ["aa"]
// running a test that just failed, and seeing the fail icon still (no change) makes it difficult to know that anything has changed

// all this needs to be namespaced & wrapped so user javascript can't mess with it.
// need to put mapToReduce and mapToMap in fancy for now

// Note for:
// -- Not chrome
// -- Console not open
// -- tests couldn't run?

// Perhaps instead of windows being tied to editors, windows are just "frames" which can be Unit Tests, editors, consoles.
//      And unit-tests could be tied to any window, as could consoles be tied to any unit test.
//      this could also resolve saving questions [save frame would save unit-test + console + whatever]

// http://adamschwartz.co/log/
// https://github.com/adamschwartz/chrome-inspector-detector
// Plus my own method. If I call debugger and there's no halt, then the console is closed.
// http://lab.hakim.se/ladda/


// Saving questions
// -- Saving just editor
//  -- Unit tests? (if so, is load a merge?)
//  -- Records of keystrokes, etc?

// animation on correct or wrong

// Give a default test for every challenge ?
// Consolidate button UI (that is, hover state, and mouse-down reaction).
// Also they need post-click animations of some sort just to make it clear they've had an affect and the click didn't miss.


// Make a good user experience, intro, layover screen
// make 2nd challenge

/**
 * Icons - key - Yusuke Kamiyamane -
 *       - Check, X - Everaldo Coelho - Crystal Project
 *
 *
 *  Pencil Icon - Icon Pack:Crystal ProjectDesigner:YellowIcon
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
    this.tabSystem = new TabSystem(".tabsContainer", setIdeText);
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
                self.loadSavedText(preload[0]);
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

TheGame.prototype.loadTextInNewTab = function(code, name){
    this.tabSystem.addTab(new Tab(code,name));
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

        var functionToBeTested = ideExtractFunctionAndDebugger(functionToBeTested);
        return executeOneTest(functionToBeTested, userNamespace, parameters, comparer, expected);
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
};

TheGame.prototype.removeTestById = function(id) {
    this.userTests.splice(id,1);
};

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
};

TheGame.prototype.updateTimeSpentForSteps = function() {
    this.getCurrentStep().updateTimeSpent();
};

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
};


TheGame.prototype.acknowledgeKeystroke = function() {

    var val = this.currentChallenge;
    if (val) {
        val.keystrokes++;
    }
    if (this.currentStepNum.constructor === (0).constructor){
        this.getCurrentStep().keystrokes++;
    }
};

TheGame.prototype.getCurrentStep = function() {
    var val = this.currentChallenge;
    return val.steps[this.currentStepNum];
};

TheGame.prototype.getCurrentChallenge = function() {
    return this.currentChallenge;
};

TheGame.prototype.getRecentLoads = function() {
    return PersistentStorage.loadAllSaves(this.getCurrentStep().id, this.getCurrentChallenge().id);
};

/**
 * load(verb) save(noun)
 * @param obj save
 */
TheGame.prototype.loadSavedText = function(save) {
    this.loadTextInNewTab( save.snippet, save.name );
};

/**
 * pick(verb) and Load(verb) [a] Save(noun)
 */
TheGame.prototype.pickAndLoadSave = function(){
    var self=this;
    this.getRecentLoads().then(function(loads){
        GeneralCrap.useLoadDialog(loads).then(function(x){
             self.loadSavedText( loads.filter("x.id == " + x)[0] );
        });
    });

};