var myApp = angular.module("scopeInheritance", []);

myApp.controller("MainCtrl", ["$scope", function ($scope) {
    $scope.timeOfDay = '我是1';
    $scope.name = '我是2';
}])

myApp.controller('ChildCtrl', ['$scope', function ($scope) {
    $scope.name = '我是3';
}]);

myApp.controller('GrandChildCtrl', ['$scope', function ($scope) {
    $scope.timeOfDay = '我是4';
    $scope.name = '我是5';
}]);