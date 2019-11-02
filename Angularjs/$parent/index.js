angular.module('app', [
    'app.radio'
])
.controller('ctrl', function ($scope) {

    let data = 0;
    if (data === 0) {
        $scope.branch = '';

        $scope.submitVal = function () {
            console.log($scope.branch);
        }
    }
});