angular.module('serviceModule')
    .component('servicePage', {
        templateUrl: 'pages/service/service.component.html',
        controller: [function serviceModuleController() {
            console.log('1')
        }]
    })
