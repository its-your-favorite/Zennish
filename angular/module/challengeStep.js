/**
 * Contains code for the GUI for one of the steps of a challenge
 * Needs a refactor @todo
 */
var app = angular.module('challengeStep', []);
app.directive("challengeStep", function(){
    return {
        restrict: "E",
        replace: true,
        template: '<span  ng-class="{active: (theGame.currentStepNum == eachStep.id),' +
            'future: (theGame.currentStepNum < eachStep.id),' +
            'challengeStep: true}" >' +
            '<div class="stepDescription" ng-class="{past: (theGame.currentStepNum > eachStep.id)}">{{ eachStep.visibleDescription(theGame.currentStepNum) }}</div>'+
            '<div ng-show = "(theGame.currentStepNum >= eachStep.id)" >' +
            '<div class="stepControls">'+
            '<table>' +
                '<tr>' +
                    '<td>' +
                        '<span>Attempts...</span>' +
                    '</td>' +
                    '<td>' +
                        '<span alt="Number of keystrokes used to complete this step" title="Number of keystrokes used to complete this step">{{ eachStep.keystrokes }}' +
                            '<img class="key_icon" src="assets/img/key.png"/>' +
                        '</span>' +
                    '</td>' +
                    '<td>' +
                        '<span> {{ eachStep.timeSpentPretty }} </span>' +
                    '</td>' +
                    '<td>' +
                        '<input type=button class="viewButton" value="View"  ng-class="{past: (theGame.currentStepNum > eachStep.id)}" ng-click="showPastSolution()"/>' +
                    '</td>' +
                '</tr>' +
            '</table>'+
        '</div>' +
    '</div>' +
'</span>',

        link: function($scope) {
            // pretty sure this isn't the correct place to put this
            $scope.showPastSolution = function() {
                $scope.theGame.showPastSolution($scope.theGame.getCurrentChallenge().id, $scope.eachStep.id, session_id());
            }
        }
    };
});