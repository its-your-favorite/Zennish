/**
 * Devised by Tim Riley - http://icelab.com.au/articles/levelling-up-with-angularjs-building-a-reusable-click-to-edit-directive/
 * Altered by Alex Rohde
 * Date: 9/9/13, 12:38 AM
 */
var app = angular.module("inlineEditing", []);

app.directive("clickToEdit", function() {
    var editorTemplate = '<span class="click-to-edit" ng-class="{locked: locked}">' +
        '<span ng-hide="view.editorEnabled">' +
        '{{bindTo}} ' +
        '<a ng-click="enableEditor()"><img class="inlineEditIcon" alt="Edit This Text" title="Edit This Text"></a>' +
        '</span>' +
        '<span ng-show="view.editorEnabled">' +
        '<img class="inlineEditSaveIcon" href="#" ng-click="save()" title="Save Changes">' +
        '<input ng-model="view.editableValue" class="click-to-edit-textbox" data-autosize-input=\'{ "space": 1 }\'>' +
        '<img class="inlineEditCancelIcon" ng-click="disableEditor()" title="Cancel Changes">' +
        '</span>' +
        '</span>';

    return {
        restrict: "E",
        replace: true,
        template: editorTemplate,
        scope: {
            bindTo: "=",
            onChange: "&",
            locked: "=",
        },

        controller: function($scope) {
            var isLocked = false;



            $scope.view = {
                editableValue: $scope.bindTo,
                editorEnabled: false
            };

            $scope.enableEditor = function() {
                if (!!$scope.locked) {
                    return;
                }
                var editor = $('.click-to-edit-textbox').autosizeInput({"space":0}); //slightly hacky
                $scope.view.editorEnabled = true;
                $scope.view.editableValue = $scope.bindTo;
                $scope.ref.bind("keydown", function(event){
                   if (event.keyCode == 13) {
                       $scope.save();
                   }
                   if (event.keyCode == 27) {
                       $scope.disableEditor();
                   }
                });
            };

            $scope.disableEditor = function() {
                $scope.view.editorEnabled = false;
            };

            $scope.save = function() {
                if (! $scope.view.editableValue.length)
                    return;
                $scope.bindTo = $scope.view.editableValue;
                $scope.disableEditor();
                if ($scope.onChange) {
                    $scope.onChange()($scope.view.editableValue);
                }
            };
        },

        link: function($scope, object) {
            $scope.ref = object;
        },

    };
});
