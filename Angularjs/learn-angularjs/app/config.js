angular.module('myApp.config', [])
// 请求拦截器
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(function ($q, $location, $timeout) {
        return {
            // 加载请求
            'request': function(config) {
                // 正常请求接口
                return config || $q.when(config);
            },
            // 处理返回报文
            'response': function (config) {
                // 如果是404,500等，则显示网络错误
                if (config.status != 200) {
                    layer.msg('网络错误');
                    return $q.reject('网络错误');
                }
                // 返回报文错误
                if (typeof config.data === 'object') {
                    // 如果是未登录，或者是登录失效
                    if (config.data.code === -2000 || config.data.code === '-2000') {
                        // 获取用户信息
                        var loginInfo = session.get('login-info') || {};
                        // 将sessionId传给后台
                        return $q.reject(config.data.msg);
                    }
                    if (config.data.code !== 200) {
                        layer.msg(config.data.msg);
                        return $q.reject(config.data.msg);
                    }
                    return config.data.data;
                }
                return config;
            }
        };
    });
}]);
