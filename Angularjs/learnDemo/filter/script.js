angular.module('MyReverseModule', [])
    .filter('reverse', function () {
        return function (input, uppercase) {
            console.log(input);
            console.log(uppercase);
            input = input || '';
            var out = '';
            for (var i = 0; i < input.length; i++) {
                out = input.charAt(i) + out;
            }
            // conditional based on optional argument
            if (uppercase) {
                out = out.toUpperCase();
            }
            return out;
        };
    })
    .controller('Ctrl', ['$scope', function ($scope) {
        $scope.greeting = 'hello';
    }]);