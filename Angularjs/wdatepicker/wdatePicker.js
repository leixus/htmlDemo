angular.module('testApp', [])
        .directive('wdatePicker', function () {
            return {
                restrict: 'A',
                scope: {
                    minDate: '@'
                },
                templateUrl: 'wdatePicker.html'
            }
        });