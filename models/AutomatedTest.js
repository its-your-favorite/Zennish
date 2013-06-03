/**
 * Created with JetBrains PhpStorm.
 * User: anfur_000
 * Date: 4/23/13
 * Time: 2:01 AM

 * This file is for the automatic tests the user may want to run to ensure their answers are right before submitting.
 */

var AutomatedTest;

AutomatedTest = function (obj, funcName) {
    this.obj = obj;
    this.paramsJson = "[]";
    this.expectedJson = '1';
    this.funcName = funcName;
    this.run();
};

AutomatedTest.prototype.run = function() {
    // going forward we can test that these are valid values by json decoding then encoding them
    // if they can't have those done then they are invalid
    var fname = this.funcName;
    var comparer = function(a,b) { return a == b;}, e, prob;

    try {
        var params = JSON.parse(this.paramsJson);
    } catch (e) {
        return "Parameters weren't parsable";
    }
    try {
        var expected = JSON.parse(this.expectedJson);
    } catch(e) {
        return "Expected wasn't parsable";
    }
    try {
        if (prob = executeOneTest(fname, null, /* array */params, comparer, expected)) {
            return prob;
        }
    } catch (e) {
        return e.toString();
    }
    return true;
};

AutomatedTest.prototype.doRun = function(){
    this.lastResult = (this.run() === true);
}
