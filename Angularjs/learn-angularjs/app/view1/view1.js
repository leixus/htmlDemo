'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', '$log', '$http', function($scope, $log, $http) {
        $scope.testView1 = '123456';

        $scope.dataJson = [];

        $http({
            method: 'POST',
            url: 'https://api.apiopen.top/getWangYiNews',
            data: {
                page: 1,
                count: 10
            }
        }).then(function successCallback(response) {
            console.log(response);
            $scope.dataJson = response.data.result;
        }, function errorCallback(response) {
            // 请求失败执行代码
        });
    }]);
