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
        /**
        for (x in obj) {
            if (obj.hasOwnProperty(x)) {
                this[x] = obj[x];
            }
        }*/
        $.extend(this, obj);
    }

    StepModel.prototype.isVisible = function(currentStage) {
        return (currentStage >= this.id);
    };

    StepModel.prototype.visibleDescription = function (currentStage) {
        return this.isVisible(currentStage) ? this.description : '?????????';

    }
}());
