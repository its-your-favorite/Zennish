/**
 * User: anfur_000
 * Date: 10/4/13, 3:25 PM
 */

function chooseChallengeController($scope, $location){
    $scope.challengeSet =  EXPORT.challengeSet;

    $scope.showOverlay = function(){
        GeneralCrap.showOverlay();
    };

    $scope.showScoringOverlay = function(){
        GeneralCrap.showScoringOverlay();
    };

    $scope.goToChallenge = function(id){
        $location.path("/challenge/id/" + id);
    };

    guiders.hideAll();
    globalCopy && (globalCopy.theGame = null);
}