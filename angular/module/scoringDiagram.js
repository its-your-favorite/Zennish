var app = angular.module("scoringDiagram", ['rating']);

app.directive("scoringDiagram", function() {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "angular/views/scoringDiagram.html",
        scope: {
            bindTo: "=", /* bindTo: "=", */
        },

        controller: function($scope) {
            $scope.$watch("bindTo", function(iNewValue, old){
                $scope.redoScoring(iNewValue);
            }, true);

            $scope.redoScoring = function(aInput){
                $scope.myScoring = FO(aInput).map(function(aRow) {
                    var aCombined = $.extend({}, {mistakes: "Any", time: "Any", keystrokes: "Any"}, aRow);// ANY
                    if (typeof aCombined['mistakes'] == "number"){
                        aCombined["mistakes"] = "< " + (aCombined["mistakes"]+1);//so that we can say mistakes < x
                    }
                    if (typeof aCombined['time'] == "number") {
                        aCombined["time"] = "< " + prettifyTime(aCombined["time"]);
                    }
                    if (typeof aCombined['keystrokes'] == "number") {
                        aCombined["keystrokes"] = "< " + (aCombined["keystrokes"]);
                    }
                    aCombined['score'] = {val: aRow['level']+1};
                    return aCombined;
                });
            }
        },

        link: function($scope, object) {
            $scope.redoScoring($scope.myScoring);
        },
    };
});
