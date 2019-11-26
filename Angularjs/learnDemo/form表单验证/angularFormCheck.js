var app = angular.module("angularFormCheckModule",[]);

/*这里使用MVC的模式（用来举例说明MVC而已）*/
app.controller("angularFormCheckCtrl",function($scope,angularFormCheckFactory){//function里的参数写你在函数里需要用到的
    $scope.testVar = angularFormCheckFactory.getTest();//这里就能取到$scope.testVar的值为---"练习angular表单校验";
    
    $scope.user = {};
    
    $scope.test= "sss";
    
});


/*自己可以去看factory、service、providers的区别（http://www.oschina.net/translate/angularjs-factory-vs-service-vs-provider）*/
/*用 Factory 就是创建一个对象，为它添加属性，然后把这个对象返回出来。*/
app.factory('angularFormCheckFactory',function(){
    //这里写自己的业务逻辑
    var test = "练习angular表单校验";
    var service = {};//自定义一个对象
    
    service.getTest = function(){//给对象添加方法
        return test;
    }
    
    return service;//返回自定义的service对象！！！
});

/*自定义指令--比较两个密码是否相等.angular的指令是驼峰的形式（这里是comparePwd页面就是compare-pwd）*/
app.directive('comparePwd',function(){
    /*angular 自定义指令，可上网自行查找*/
    return{
        require : 'ngModel',
        /*scope表示作用域，elem表示使用这个指令的元素对象（这里指第二个密码框），attrs。。。ctrl。。。*/
        link : function(scope,elem,attrs,ctrl){
            /*写自己的业务逻辑*/
            //注意这样取值的话，第一密码框的Id值必须要设置且必须与第二个密码框的compare-pwd属性的值相同
            var firstPwdIdObj = "#" + attrs.comparePwd;
            $(elem).add(firstPwdIdObj).on('keyup',function(){
                /*手动执行脏检查*/
                scope.$apply(function(){
                    //$(firstPwdIdObj).val()表示第一个密码框的值。elem.val()表示第二个密码框的值
                    var flag = elem.val() === $(firstPwdIdObj).val();
                    //alert(flag+",--"+elem.val()+",--"+$(firstPwdIdObj).val());
                    ctrl.$setValidity("pwdmatch",flag);//flag,表示是否相等。pwdmatch用于$error时的标识符，注意看页面，$setValidity是require中ngModel的方法！
                });
            });
        }
    }
});