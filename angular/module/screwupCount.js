var app = angular.module("screwupCount", []);

app.directive("screwupCount", function() {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "angular/views/screwupCount.html",
        scope: {
            bindTo: "=", /* bindTo: "=", */
        },

        controller: function($scope) {
            $scope.$watch("bindTo.mistakes", function(iNewValue, old){
                $scope.errors = iNewValue;
            }, true);
        },

        link: function($scope, object) {
            $scope.errors = -1;
        },
    };
});
