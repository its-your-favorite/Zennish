/**
 * Made By Alex
 * Date: 4/20/13
 * Time: 3:24 PM
 */

/*
Sweet Alert http://tristanedwards.me/sweetalert
created by Tristan Edwards http://tristanedwards.me/
 */

/*
jquery.contextmenu.js
* jQuery Plugin for Context Menus
* http://www.JavascriptToolbox.com/lib/contextmenu/
*
* Copyright (c) 2008 Matt Kruse (javascripttoolbox.com)
*/

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
 *
 *  Star Icon: http://kyo-tux.deviantart.com/ (Asher)
 */
'use strict';

//export
var testContainer;
var TheGame = function(challenges, activeChallengeId)  {
    var self = this;
    this.data = {challenges: challenges};
    this.startChallenge(activeChallengeId);
    this.log = "";
    this.recordToLog("-- App Started --");
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

    var selectTabIfSameChallengeStepAndSession = function(tab, index){
        var customData = tab.getValue();
        if (customData.challenge_id == challengeId && customData.step_id == stepId && customData.created_session_id == sessionId) {
            self.tabSystem.selectTab(index);
            return true;
        };
        return false;
    };

    if ( !customDatums.some(selectTabIfSameChallengeStepAndSession)) {
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
    var currentChallenge = this.getCurrentChallenge();
    if (currentChallenge.state != 1) {
        return; //We're completed, this button shouldn't even be clickable.
    }
  assert(currentChallenge);
  var nextStep = this.currentStepNum+1;

  if (currentChallenge.steps.length <= nextStep) {
        var rating = this.scoreContestant(this.getStats(), currentChallenge.scoring);
        var label = ['bronze', 'silver','gold'];
        var applause = ["Good job", "Awesome work", "Nailed it!"];
        PersistentStorage.saveScore( rating.level, currentChallenge.id );
        currentChallenge.state = 0; //done/off
        //label[rating.level ]
        swal({   title: applause[rating.level],
            text: "You scored " + label[rating.level ] + fe("#thisRunsScore").html(),
          html: true });
        GeneralCrap.gleamingGreen(fe("#challengeExitRequest"));
        return;
  } else {
        this.gotoStep(nextStep);
  }
};

TheGame.prototype.scoreContestant = function(stats, goals) {
    var achieved = FA(goals).reject(function(goal) {
        return ((goal.hasOwnProperty('time') && (goal.time < stats.time))
                || (goal.hasOwnProperty('keystrokes') && (goal.keystrokes < stats.keystrokes))
                || (goal.hasOwnProperty("mistakes") && (goal.mistakes < stats.mistakes))
            );
    });
    return achieved.slice(-1)[0];
};

/**
 * Get the overall success metrics for the challenge, these paired with the scoring criteria will
 * determine the grade to assign
 * @returns {{keystrokes: , time: , mistakes: }}
 */
TheGame.prototype.getStats = function(){
    var that = this;
    var extractSumAcrossSteps = function(sKey) {
        return that.currentChallenge.steps.pluck(sKey).map("0|x").reduce("+");
    };
     return {
         keystrokes: extractSumAcrossSteps("keystrokes"),
         time: extractSumAcrossSteps("timeSpent"),
         mistakes: extractSumAcrossSteps("mistakes")
     };
};

TheGame.prototype.startChallenge = function(num) {
    this.currentFunctionTestee = "someFunction"; //I wish I remember why I did this line
    this.currentChallenge = this.data.challenges[num];
    this.currentChallenge.keystrokes = 0;
    this.currentChallenge.totalTimeSpent = 0;
    this.currentChallenge.state = 1; //running

    this.currentChallenge.steps = FA(this.currentChallenge.steps).map(function(x) { return new StepModel(x); });
    this.gotoStep(0);
    //testContainer.addTest({}/*demo */ );
};

TheGame.prototype.gotoStep = function(num) {
    var self = this;
    this.currentStepNum = num;
    try{
    this.startStep(this.getStep(num));
    } catch (e) {
        handleError(e);
    }

    var preload = PersistentStorage.loadCodeInitial(num, this.getCurrentChallenge().id).then(
          function(preload){
              if (false /* disable preloading, forgot why I ever implemented it*/ && preload.length){
                //preloading is automatically loading the code from any successful solution to this step from the past... across any session
                self.loadSave(preload[0]);
              } else {
                if (!self.tabSystem.tabs.length) //no tabs open, create one
                    self.loadBlankTab();
                 //otherwise just keep going in the current tab
              }
              var x;
              var currentStep = self.getCurrentStep();
              var demoTests = currentStep.demoTests;
              // add demoTests to help user understand the question
              //assert( isNestedArray(demoTests));
              for (x=0; x < demoTests.length; x++) {
                self.addTest(demoTests[x], true);
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
    if (failures.length) {
        this.recordToLog(failures[0]);
        this.getCurrentStep().mistakes = (0|this.getCurrentStep().mistakes) + 1;
    } else {

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
 *
 * @param step
 * @param challenge
 * @returns array of string explanations of failures, empty array if success
 */
TheGame.prototype.gradeSolution = function(step, challenge) {
    var userNamespace = window; //change later

    assert(step && step.tests);

    var failures = FA(step.tests).map(function(thisTest, i) {

        try {
            var test = new AutomatedTest(thisTest, step, challenge);
            return test.run(ideExtractAllCode(test.funcName, false), false);
        } catch (e) {
            return e;
        }
    }).filter();

    //write this more; @todo
    return failures;
};

TheGame.prototype.recordToLog = function(str) {
    var timestamp = (new Date()).toLocaleTimeString();
    str = timestamp + ": " + str;
    this.log += str + "\n";
    console.log(str);
    //use other console. use color @todo
};

TheGame.prototype.addTest = function(obj, fillOut) {
    if (!fillOut) {
        obj.expected = '';
    }
    this.userTests.push(new AutomatedTest(obj, this.getCurrentStep(), this.getCurrentChallenge()));
};

TheGame.prototype.removeTestById = function(id) {
    this.userTests.splice(id,1);
};

TheGame.prototype.saveCurrentEditor = function(manual, name){
    var self = this;
    var fail = NoteSystem.showNewNote.bind(NoteSystem);
    var tab = this.tabSystem.getSelectedTabOrNull();

    if (arguments.length < 2) {

        if (!tab) {
            // todo, make sure this is the appropriate place for an error
            return fail("Failed: No tab to save!");
        }
        if (tab.extraneous.locked) { // @todo this is also a violation of good coding... since "locked" Behavior isn't inherent to the tab-container it should be added in elsewhere... right?
            if (manual) {
                fail("Failed: Cannot save a read-only tab!");
            }
            return; //return either way.
        }
        name = tab.caption;
    }

    if (manual) {
        NoteSystem.showNewNote("Saved!");
    }

    if (this.currentlyLoadedSave) {
        PersistentStorage.deleteParticularSave(this.currentlyLoadedSave);
    }
    
    this.lastSessionId = session_id();
    var old = tab.extraneous.id;
    var tmp = PersistentStorage.saveCode (
        {snippet: ideContents(),
         created_session_id: this.lastSessionId,
         name: name || "unnamed",
         when: new Date(),
         isAutosave: !manual,
         challenge_id: this.getCurrentChallenge().id,
         step_id: this.getCurrentStep().id
        }
    ).then(function(result){
            tab.extraneous.id = result.insertId; //see above comment
            //this isn't quite right but it may work for now
        });
    PersistentStorage.deleteParticularSave(old);

};

TheGame.prototype.updateTimeSpentForSteps = function() {
    this.getCurrentStep().updateTimeSpent();
};

TheGame.prototype.updateTotalTimeSpent = function() {
    var stats = this.getStats();
    this.getCurrentChallenge().totalTimeSpent = prettifyTime(stats.time);
    this.getCurrentChallenge().currentRating = {val: this.scoreContestant(stats, this.currentChallenge.scoring).level + 1} ;
}

/**
 *
 */
TheGame.prototype.debugTests = function(doDebug) {
    return this.userTests.every(function(test) {
       return test.runAndDebug(doDebug);
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


TheGame.prototype.acknowledgeKeystroke = function(event) {
    var challenge = this.getCurrentChallenge();
    
    if (!challenge || !challenge.state) {
        return; //challenge not running
    }
    if (this.currentStepNum.constructor === (0).constructor){
        challenge.keystrokes++;
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

TheGame.prototype.getRecentLoadsForSession = function(iSessionId) {
    return PersistentStorage.loadAllUndeletedSaves(iSessionId, this.getCurrentChallenge().id);
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
    this.getRecentLoadsForSession(session_id()).then(function(loads){
        GeneralCrap.useLoadDialog(loads).then(function(row){
            //post successful load
             self.loadSave( loads.filter("x.id == " + row)[0] );
        }, function(){
                //fail
            });
    });
};
