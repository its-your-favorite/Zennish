/**
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 5/27/13
 * Time: 4:40 PM
 * To change this template use File | Settings | File Templates.
 */

var StepModel;

(function() {
    "use strict";

    StepModel = function(obj) {
        var x;
        $.extend(this, obj);
    };

    StepModel.prototype.start = function(){
        this.startTime = +(new Date()) - GeneralCrap.hiddenTime ;
        this.timeSpent = 0;
    };

    StepModel.prototype.isVisible = function(currentStage) {
        return (currentStage >= this.id);
    };

    StepModel.prototype.visibleDescription = function (currentStage) {
        return this.isVisible(currentStage) ? this.description : '?????????';

    };

    StepModel.prototype.getExpectedSolutionOutline = function() {
        if (! this.addFunction) {
            return '';
        }
        var f = this.addFunction;
        return '\nvar ' + f[0] + ' = function (' + f.slice(1).join(", ") + ") { \n\n }; ";
    };

    StepModel.prototype.updateTimeSpent = function(){
        if (document.visibilityState == 'visible') {
            var twoDig = function(x) { return ("0" + x).slice(-2);};
            var seconds = 0|((+new Date()) - this.startTime - GeneralCrap.hiddenTime)/1000;
            var minutes = (seconds / 60) | 0;
            this.timeSpentPretty = (minutes) + ":" + twoDig(seconds % 60);
            this.timeSpent = seconds;
        }
    };
}());
