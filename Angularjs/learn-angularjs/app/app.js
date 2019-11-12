'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.version',
    'pagesModule'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.when('/servicePage', {
        template: '<service-page></service-page>'
    })

    $routeProvider.otherwise({redirectTo: '/view1'});
}]);
