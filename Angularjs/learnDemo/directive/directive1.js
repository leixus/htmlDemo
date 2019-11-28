angular.module("myApp.hello", []).directive('hello', function() {
    return {
        restrict: "EA",
        transclude: true,
        replace: true,
        scope: {
            name: '=',
            myChildClick: '&'
        },
        templateUrl: "directive1.html",
        // template: '<div>{{name}} <div ng-transclude></div></div>',
        controller: function($scope, scope) {
            console.log(scope);
            $scope.myClick = function () {
                layer.msg("我被点击了！", {time: 800})
                $scope.myChildClick() && $scope.myChildClick()('将data传过去');
            }
        },
        link: function(scope, element, attrs) {
            console.log(scope);
        }
    }
})