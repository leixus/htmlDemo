// Provide the wiring information in a module
angular.module('myApp', []).
  
// 下面是教 injector 如何构建一个 'greeter' 依赖
// 注意 greeter 本身依赖于 '$window'
factory('greeter', function($window) {
  // 这是一个 factory 函数，负责创建 'greeter' 服务 
  return {
    greet: function(text) {
      $window.alert(text);
    }
  };
});

// 从 module 创建的 injector 
// 这个常常是 Angular 启动时自动完成的
var injector = angular.injector(['myApp', 'ng']);

// 通过 injector 请求任意的依赖
var greeter = injector.get('greeter');

greeter.greet('leixu');