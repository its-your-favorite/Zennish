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
// - Have multiple text windows open at once? Closable separately?oken
// - Need new frame button
// - better gui on the unit tests. If params aren't parse-able then make the params box red.
// - Same for the other 3. 
// - Unit tests should remind semi-valid semi-json (e.g. ['aa']) to valid json ["aa"] with note
// - need to be able to rename frames and have it save back
// - need error log message when unit tests fail, plus a test # so tracking can be done
// - running a test that just failed, and seeing the fail icon still (no change) makes it difficult to know that anything has changed
// - need vertical scrolling on load dialog
// - pressing enter on click-to-edit must submit, pressing escape must cancel
// - Consolidate button UI. One class, and (that is, hover state, and mouse-down reaction) [see the link provided]
// right now, view buttons on previous steps do nothing. Instead open a read-only window of it, no rename, focus it
// [check] A) Make view button open a window and focus
// [check] B) Make support for read-only windows
// BUG: XSS on load dialog

// @todo -- below

// don't show "Saved" on a read-only. Plus it probably is saving and updating the timestamp, so don't allow that either.

// can have nameless save (which is then like impossible to rename)

// general gui issues on load dialog

// saves is super-polluted. What I propose is that save by default "overwrite" which means "delete" the old (flag). We then have a
// a view switch to "show deleted / overwritten". Saves can then be "deleted" with right-click. Or undeleted.

// need a collapse for bottom?

// Preserve all state. Nothing should be lost on a refresh.
// Let's list all inherent "State"...
// -- View state (dialogs up [intro, load], collapses,)
// -- All open tabs, and their current values
// -- how do you propose to do that? Binding to local-save?

// On completion it shows stats, (maybe allows leaderboard), maybe allows a share link,  and perhaps auto-quits.
// explain the ability to debug tests(Put a help Icon by each piece)

// needs to work better on laptop, code window too tall

// all this needs to be namespaced & wrapped so user javascript can't mess with it.
// I seem to have made some progress here...
//   -- dom manipulation ?
//          document.write ...
//   -- They can still manipulate dom Via $ ... which I guess is okay? Unless I import a pseudo-jquery via wrapping it in a closure...
//   -- Window.* , document.*
//   -- take my solutions and such out of the global scope

// line wrap option on code mirror?

// need to put mapToReduce and mapToMap in fancy for now

// Bug: Pick a save dialog malfunctions with only 1 save

// Note for:
// -- Not chrome
// -- Console not open

// need to be able to resize frames better

// Perhaps instead of windows being tied to editors, windows are just "frames" which can be Unit Tests, editors, consoles.
//      And unit-tests could be tied to any window, as could consoles be tied to any unit test.
//      this could also resolve saving questions [save frame would save unit-test + console + whatever]

// Bugs:
//  Start a new database (incognito mode). Notice the default text comes without a tab (!). Shouldn't be able to enter text
//    when there is no tab. Maybe read-only it, or auto-create a new tab.
//  Also notice that when you save this unnamed tags, the title is saving incorrectly.

// Refactor challengeSteps

//  When in parse mode (just extracting function names but not running any test)
//      - Debugger activates
//      - alert does a console log, which should not happen. No side effects should happen at all.

// write grading
// shouldn't keystrokes be per-window? Are they saved?

// Saving questions
// -- Saving just editor
//  -- Unit tests? (if so, is load a merge?)
//  -- Records of keystrokes, etc?

// animation on correct or wrong, and every attempted action
// make overlay
// make transition between steps better. Just unmasking question marks does not indicate a transition sufficiently.

// make 2nd challenge

// move pseudo console to the right... save this to last because it may become irrelevant on graphical redesign

// Intro needs to hide cleanly. When closed intro needs to hide forever by default
// Goes into what I've currently made... which then needs a way to quit back out. (escape, etc) and a good way to retrieve it.


// Big Picture: Startup interface
//      [Check] Name, author, what is this
//      [] choose challenge (use known state to resume appropriately)

// App should start with fading splash screen as it loads, not FLASHING.

// Give a default test for every challenge for clarity? Tests need to be more readable and resizing needs to allow more than two sizes

// http://adamschwartz.co/log/
// https://github.com/adamschwartz/chrome-inspector-detector
// Plus my own method. If I call debugger and there's no halt, then the console is closed.
// http://lab.hakim.se/ladda/
// Lock icon - http://dryicons.com

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
    this.tabSystem = new TabSystem(".tabsContainer", function(extraneous) {
       self.renderSave(extraneous);
    }, function(tab) {
        tab.snippet = ideContents(); //actually updating a reference
    });
};

/**
 *
 */
TheGame.prototype.showPastSolution = function(challengeId, stepId, sessionId, saveId) {
    var customDatums = this.tabSystem.enumerateTabs();
    var self = this;

    //what does this do ?
    var nameThis = function(tab, index){
        var customData = tab.getValue();
        if (customData.challenge_id == challengeId && customData.step_id == stepId && customData.session_id == sessionId) {
            self.tabSystem.selectTab(index);
            return true;
        };
        return false;
    };

    if ( !customDatums.some(nameThis)) {
            this.getSpecificLoad(stepId, challengeId, sessionId).then(function(saves){
                self.loadIntoNewTab($.extend({locked: true}, saves[0]));
            })
        //load tab
    }

    //step 1 -- is said solution already opened? If not, :
    //step 2 -- Else load it
    //step 3 -- focus it
};

/**
 * @todo this is a junk abstraction that I am assuming I will fix later once I know exactly all the things I wish
 * to store in a save, e.g. keystroke count, unit tests?
 * @param ideText
 * @param b
 * @param c
 * @param d
 */
TheGame.prototype.renderSave = function(save,b,c,d) {
    setIdeText(save.snippet);

    if (!save) {
        GeneralCrap.setCodeMirrorLocked(true);
    }
    else {
        //should be abstracted out
        GeneralCrap.setCodeMirrorLocked(!!save.locked);
    }
};

TheGame.prototype.advanceStep = function(){
  assert(this.currentChallenge);
  var nextStep = this.currentStepNum+1;

  if (this.currentChallenge.steps.length <= nextStep) {
        return alert("All solved!");
  } else {
        this.gotoStep(nextStep);
  }
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

    var preload = PersistentStorage.loadCodeInitial(num, this.getCurrentChallenge().id).then(
          function(preload){
              if (preload.length){
                self.loadSave(preload[0]);
              } else {
                if (!self.tabSystem.tabs.length) //no tabs open, create one
                    self.loadBlankTab();
                 //otherwise just keep going in the current tab
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

TheGame.prototype.loadIntoNewTab = function(save){
    var tab = new Tab(save.name, false, save.id, $.extend({}, save) );
    this.tabSystem.addTab(tab);
};

TheGame.prototype.startStep = function(step) {
    if (step.addFunction) {
        var f = step.addFunction;
        this.currentFunctionTestee = f[0];
        if (! ideContains(f[0]) ) //save'em a little typing
            appendToIde(step.getExpectedSolutionOutline());
    }
    step.keystrokes = 0;
    step.start();
};

/**
 *
 * @returns {Number}
 */
TheGame.prototype.submitStep = function() {
    assert(this.getCurrentStep());

    var failures = this.gradeSolution(this.getCurrentStep(), this.currentChallenge);
    if (failures.length)
        this.recordToLog(failures[0]);
    else {

        this.recordToLog("Passed step " + (this.currentStepNum + 1));
        this.saveCurrentEditor(false, "Your Correct Solution Step " + (this.currentStepNum + 1));
        this.advanceStep();
    }
    return failures.length;
};

/**
 *
 * @returns {string}
 */
TheGame.prototype.currentStepTesteeFunctionName = function() {
    return this.currentFunctionTestee;
};

/**
 * Execute actual exam to see if provided answers let us move on to next step
 * @param step
 * @param challenge
 * @returns {Array}
 */
TheGame.prototype.gradeSolution = function(step, challenge) {
    var userNamespace = window; //change later

    assert(step && step.tests);

    var failures = FA(step.tests).map(function(thisTest) {
        var comparer, expected, parameters;
        var functionNameToBeTested; //name of the function which this Step is evaluating for correctness. Will be dug out of code

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

        try {
            var functionToBeTested = ideExtractFunctionAndDebugger(functionNameToBeTested, true);
        } catch (e){
            return e;
        }
        return executeOneTest(functionToBeTested, functionNameToBeTested, userNamespace, parameters, comparer, expected);
    }).filter();

    //write this more; @todo
    return failures;
};

TheGame.prototype.recordToLog = function(str) {
    this.log += "\n" + str;
    console.log(str);
    //use other console. use color @todo
};

TheGame.prototype.addTest = function(obj) {
    this.testsSoFar = (this.testsSoFar || 0);
    this.userTests.push(new AutomatedTest(obj, this.currentStepTesteeFunctionName(), this.testsSoFar));
    this.testsSoFar++;
};

TheGame.prototype.removeTestById = function(id) {
    this.userTests.splice(id,1);
};

TheGame.prototype.saveCurrentEditor = function(manual, name){
    if (arguments.length < 2) {
        var tab = this.tabSystem.getSelectedTabOrNull();
        if (!tab) {
            // todo, make sure this is the appropriate place for an error
            return NoteSystem.showNewNote("Failed: No tab to save!");
        }
        name = tab.caption;
    }
    if (manual) {
        NoteSystem.showNewNote("Saved!");
    }
    PersistentStorage.saveCode (
        {snippet: ideContents(),
         created_session_id: session_id(),
         name: name || "unnamed",
         when: new Date(),
         isAutosave: !manual,
         challenge_id: this.getCurrentChallenge().id,
         step_id: this.getCurrentStep().id
        }
    );
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

TheGame.prototype.getSpecificLoad = function(step, challenge, session) {
    return PersistentStorage.loadParticularSave(step, challenge, session);
};

/**
 * load(verb) save(noun)
 * @param obj save
 */
TheGame.prototype.loadSave = function(save) {
    this.loadIntoNewTab( save );
};

TheGame.prototype.loadBlankTab = function() {
    var tab = new Tab("Unsaved", false, (+new Date()), $.extend({snippet: '//write your javascript here\n' + this.getCurrentStep().getExpectedSolutionOutline() }) );
    this.tabSystem.addTab(tab);
};

/**
 * pick(verb) and Load(verb) [a] Save(noun)
 */
TheGame.prototype.pickAndLoadSave = function(){
    var self=this;
    this.getRecentLoads().then(function(loads){
        GeneralCrap.useLoadDialog(loads).then(function(row){
            //post successful load
             self.loadSave( loads.filter("x.id == " + row)[0] );
        });
    });

};
