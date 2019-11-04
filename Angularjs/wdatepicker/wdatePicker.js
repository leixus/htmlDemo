angular.module('testApp.wdatePicker', [])
        .directive('wdatePicker', function () {
            return {
                restrict: 'A',
                scope: {
                    minDate: "@",
                    maxDate: "@",
                    dateFmt: "="
                },
                // replace: true,
                // templateUrl: 'wdatePicker.html',
                link: function (scope, element, attrs, $ngModel) {
                    console.log($ngModel);
                    element.bind('click, focus', function () {
                        // 生成日期组件
                        WdatePicker({
                            // 最大值
                            maxDate: (scope.maxDate || ''),
                            // 最小值
                            minDate: (scope.minDate || ''),
                            dateFmt: (scope.dateFmt||"yyyy-MM-dd"),
                            // 每次选择时间组件的时候触发的时间
                            onpicking: function(dp) {
                                console.log(dp.cal.getNewDateStr(scope.dateFmt||'yyyy-MM-dd'));
                                // 更改noModel的值
                                console.log($ngModel);
                                // $ngModel.$setViewValue(dp.cal.getNewDateStr(scope.dateFmt||'yyyy-MM-dd'));
                                // $ngModel.$render();
                                // 刷新作用域
                                scope.$apply();
                            },
                            // 清除数据的时候，执行的操作
                            onclearing: function(dp) {
                                // 更改noModel的值
                                $ngModel.$setViewValue("");
                                $ngModel.$render();
                                // 刷新作用域
                                scope.$apply();
                            }
                        });
                    })
                }
            }
        });