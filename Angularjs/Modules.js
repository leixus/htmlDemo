//张三，李四，王五全部输出
var app2 = angular.module("myApp2", []);

app2.controller('secondController', ['$scope', function ($scope) {
    $scope.name = "李四";

}]);

app2.controller('thirdController', ['$scope', function ($scope) {
    $scope.name = "王五";
}]);
