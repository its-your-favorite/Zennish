/**
 * User: anfur_000
 * Date: 5/27/13  1:50 PM
 */
var globalCopy; //For console debug purposes

function gameController($scope, $routeParams, $location) {

    $scope.backToMenu = function(id){
        confirm("Abandon challenge?") && $location.path("/");
    };

    $scope.showOverlay = function(){
        GeneralCrap.showOverlay();
    };

    // Take care of global HTML elements
    myCodeMirror = CodeMirror(fe("#ideContainer")[0], {
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
        $scope.$apply($scope.theGame.updateTimeSpentForSteps.bind($scope.theGame));
        setTimeout(updateTimers,1000);
    });
    globalCopy = $scope;

    window.debugTests = $scope.theGame.debugTests.bind($scope.theGame); //make accessible easily via console
} ;
