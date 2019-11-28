angular.module("myApp.hello", []).directive('hello', function() {
    return {
        restrict: "EA",
        transclude: true,
        replace: true,
        scope: {
            name: '='
        },
        templateUrl: "directive1.html",
        // template: '<div>{{name}} <div ng-transclude></div></div>',
        controller: function($scope) {

        },
        link: function(scope, element, attrs) {

        }
    }
})