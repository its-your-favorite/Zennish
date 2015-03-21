/**
 * Contains code for the GUI for one of the steps of a challenge
 * Needs a refactor @todo
 */
var app = angular.module('challengeStep', ['screwupCount']);
app.directive("challengeStep", function(){
    return {
        restrict: "E",
        replace: true,
        templateUrl: "angular/views/challengeStep.html",

        controller: function($scope) {
            EXPORT.loadBestScores().then(function(){
                $scope.$apply();
            });

            $scope.toggleExpanded = function(x){
                $scope.isExpanded[x] = !$scope.isExpanded[x];
            }
        },

            link: function($scope) {
            // pretty sure this isn't the correct place to put this
            $scope.showPastSolution = function() {
                $scope.theGame.showPastSolution($scope.theGame.getCurrentChallenge().id, $scope.eachStep.id, session_id());
            }

            $scope.isExpanded = [];
        }
    };
});