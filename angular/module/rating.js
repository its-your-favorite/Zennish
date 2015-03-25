var app = angular.module("rating", []);

app.directive("rating", function() {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "angular/views/rating.html",
        scope: {
            score: "=", /* bindTo: "=", */
        },

        controller: function($scope) {
            /*EXPORT.loadBestScores().then(function(){
                $scope.$apply();
            });*/

            $scope.$watch("score.val", function(newv, old){
                $scope.updateStars();
            }, true);

            $scope.updateStars = function() {
                $scope.stars = [];
                var score = $scope.score && $scope.score.val || 0;
                var lookupColor = function (x, countEarned) {
                    var lookup = ['white', 'bronze', 'silver', 'gold'];
                    if (x >= countEarned)
                        return lookup[0];
                    return lookup[countEarned] || lookup.slice(-1)[0] ;
                }
                var count = Math.max(3, score);
                for (var x = 0; x < count; x++)
                    $scope.stars.push(lookupColor(x, score));
            };
        },

        link: function($scope, object) {
            $scope.updateStars();
        },
    };
});
