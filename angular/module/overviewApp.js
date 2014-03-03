/**
 * Created by alexr on 11/5/13.
 */
var overviewApp = angular.module('overviewApp',
    ['rating', 'inlineEditing', 'automatedTest', 'challengeStep']);

var appSettings = null;
PersistentStorage.loadSettings().then(function(rs){
   appSettings = rs[0];
    if (appSettings.showed_splash_screen)
        GeneralCrap.closeOverlay();
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
