angular.module('testApp', ['testApp.wdatePicker'])
        .controller('testCtrl', function ($scope) {
            console.log(1);

            // $scope.startTime = '';

            $scope.submitVal = function () {
                console.log($scope.startTime);
            }
        });