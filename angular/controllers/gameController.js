/**
 * User: anfur_000
 * Date: 5/27/13  1:50 PM
 */
var globalCopy; //For console debug purposes

function gameController($scope, $routeParams, $location) {

    $scope.backToMenu = function(id){

        var leave = function(){
            $location.path("/");
        };

        if (!$scope.theGame.currentChallenge.state) { //no dialog if challenge over
            leave();
        } else {
            swal({   title: "Leave Challenge?",   text: "Unsubmitted work won't be saved",   type: "info",
                showCancelButton: true,   confirmButtonColor: "#DD6B55",
                confirmButtonText: "Leave.",   closeOnConfirm: true },
                leave
            );
        }
    };

    $scope.showOverlay = function(){
        GeneralCrap.showOverlay();
    };

    $scope.showScoringOverlay = function(){
        GeneralCrap.showScoringOverlay();
    }

    // Take care of global HTML elements
    var ce = fe("#ideContainer")[0];
    window.myCodeMirror = CodeMirror(function(node){ce.parentNode.replaceChild(node, ce);}, {
        mode: "javascript",
        lineWrapping: true
    });

    myCodeMirror.setSize(null, "100%");
    ////////////////////////////////////////////

    $scope.view = GeneralCrap;
    $scope.challengeSet =  EXPORT.challengeSet;
    $scope.theGame = new TheGame($scope.challengeSet, FA($scope.challengeSet).pluck("id").indexOf($routeParams.challengeId));
    $scope.openTabs = $scope.theGame.tabSystem;
    $scope.test = $scope.challengeSet[$scope.activeTestId];

    setTimeout(function updateTimers(){
        if ($scope.theGame.getCurrentChallenge().state != 1) {
            return; // kill timers if we finished the challenge
        }
        $scope.$apply($scope.theGame.updateTimeSpentForSteps.bind($scope.theGame));
        $scope.$apply($scope.theGame.updateTotalTimeSpent.bind($scope.theGame));
        setTimeout(updateTimers,1000);
    });
    globalCopy = $scope;

    window.debugTests = $scope.theGame.debugTests.bind($scope.theGame); //make accessible easily via console
} ;
