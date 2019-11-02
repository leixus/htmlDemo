angular.module('app.radio', []).directive('appRadio', function () {
    return {
        restrict: 'EA',
        scope: {
            value: '=',
            ngModel: '=',
            onChange: '&',
        },
        replace: true,
        transclude: true,
        templateUrl: 'radio.html',
        controller: function ($scope) {
            $scope.changeRadio = function() {

            };
        }
    }
});