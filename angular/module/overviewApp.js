/**
 * Created by alexr on 11/5/13.
 */
var overviewApp = angular.module('overviewApp',
    ['rating', 'inlineEditing', 'automatedTest', 'challengeStep','scoringDiagram']);

var appSettings = null;
PersistentStorage.loadSettings().then(function(rs){
   appSettings = rs[0]; //this may be null if the DB doesn't exist at all (e.g. first load)
    if (appSettings && appSettings.showed_splash_screen) {
        if (GeneralCrap) {
            GeneralCrap.closeOverlay();
        }
    }
});

overviewApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/challenges', {
                templateUrl: 'angular/views/chooseChallenge.html',
                controller: 'chooseChallengeController'
            }).
            when('/challenge/id/:challengeId', {
                templateUrl: 'angular/views/mainApp.html',
                controller: 'gameController'
            }).
            otherwise({
                redirectTo: '/challenges'
            });
    }]);
