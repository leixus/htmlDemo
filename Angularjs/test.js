
    
        // 当前所处的步数
        // $scope.step = 1;
        $scope.step = [];

        // 是否是结束流程
        $scope.isEndStep = false;

        // 判断是否是只读
        $scope.isRead = $routeParams.isRead == 1;

        // 签章图片
        $scope.signImage = '';

        // 展示签章图片
        $scope.isPopUpSignImage = false;

        //当前阶段审核人姓名
        $scope.passPersonTel = '';
        //当前阶段审核人电话
        $scope.passPersonName = '';

        // 面包屑导航数据
        var navData =  [
            {
                name: '资源服务',
                url: '/home/resource/service'
            },
            {
                name: '我的待办',
                url: '/resource/apply/my/commission'
            },
            { name: '待办审核' }
        ];

        // 生成面包屑导航

        if($routeParams.isRead == 1){
            //详情
            $nav.setData(session.get('nav').concat({name:'申请详情'}));
        }else{
            $nav.setData([
                {
                    name: '资源服务',
                    url: '/home/resource/service'
                },
                {
                    name: '我的待办',
                    url: '/resource/apply/my/commission'
                },
                { name: '待办审核' }
            ]);
        }

        /**
         * 将json字符串转换成json数组
         *
         * @param { String } jsonStr json字符串
         */
        $scope.getJsonArrayFromString = function(jsonStr) {
            return JSON.parse(jsonStr || '{}');
        };

        // 如果当前是扩容单，则查出当前扩容前的数据
        if ($routeParams.resType === 1 || $routeParams.resType === '1') {
            $scope.resType = $routeParams.resType;
        }

        // 如果当前是减容单，则查出当前减容前的数据
        if ($routeParams.resType === 2 || $routeParams.resType === '2') {
            $scope.resType = $routeParams.resType;
        }

        /**
         * 获取扩容信息
         */
        $scope.fetchApprovalProcessK = function() {
            $api.apiApprovalProcessK()
        };

        /**
         * 获取待审核人员列表和审批信息
         */
        $user.getUserInfo(function(userInfo) {
            // 获取待审核人员列表
            $api.apiCkTaskUser({
                jSessionId: userInfo.sessionIdNew
            }).then(function(resp) {
                $scope.userList = resp.user_list;
            });

            // 审批数据
            $scope.approvalProcess = {
                all: '',
                kr: '',
                resType: ''
            };

            // 获取扩容前数据
            $api.apiApprovalProcessK({
                jSessionId: userInfo.sessionIdNew,
                taskDefKey: $routeParams.taskDefKey,
                resApplyId: $routeParams.id,
                procInsId: $routeParams.procInsId
            }).then(function(resp) {
                console.log(resp);
                // $scope.resType = resp.resAppList[0].appList.length > 0 ? 2: '';
                $scope.resType = resp.resAppList[0].reType
                $scope.expansionList = resp.resAppList[0].appList;
                // console.log($scope.expansionList,' $scope.expansionList');
                // 将数据保存到全局对象中
                $scope.approvalProcess['kr'] = resp;
                $scope.approvalProcess['resType'] = resp.resAppList[0].reType;
            });

            // 获取审批信息
            $api.apiApprovalProcess({
                jSessionId: userInfo.sessionIdNew,
                taskDefKey: $routeParams.taskDefKey,
                resApplyId: $routeParams.id,
                procInsId: $routeParams.procInsId
            }).then(function(resp) {
                // 是否加载数据成功
                $scope.isLoadDataSuccess = true;
                // 将数据保存到全局对象中
                $scope.approvalProcess['all'] = resp;

                // 如果没有获取到应用列表
                if (!resp.resAppList || !resp.resAppList.length) {
                    return;
                }

                // 如果当前是运维人员或自己审核
                $scope.needNotSign = (resp.taskDefKey === 'yunSuccess' || resp.taskDefKey === 'applycheck');

                $scope.passPersonTel = resp.sh_user_mobile;
                $scope.passPersonName = resp.sh_user_name;
                // 获取申请流程信息
                $scope.appProcess = [];

                // 科信部门审批流程
                var deptList = [];

                // 如果是标准流程
                if (resp.resAppList[0].actBranch === 'nook') {
                    // 科信状态
                    $scope.kxStepType = 1;
                }

                // 遍历流程数据
                angular.forEach(resp.resAppList, function(process, index) {
                    // 如果在前2个流程
                    switch (process.activityStatus) {
                        case 'start':  // 开始流程
                            $scope.appProcess.push(process);
                            break;
                        case 'audit1': // 第二步流程结束
                            $scope.appProcess.push(process);
                            break;
                        case 'audit2':// 第三部流程第一小流程结束
                            deptList.push(process);
                            if (index === resp.resAppList.length - 1) {
                                $scope.appProcess.push(deptList);
                            }
                            break;
                        case 'audit3':// 第三部流程第二小流程结束
                            deptList.push(process);
                            if (index === resp.resAppList.length - 1 || process.actBranch === 'ok') {
                                $scope.appProcess.push(deptList);
                            }
                            break;
                        case 'audit4':// 第三部流程第三小流程结束
                            deptList.push(process);
                            if (index === resp.resAppList.length - 1) {
                                $scope.appProcess.push(deptList);
                            }
                            break;
                        case 'audit5':// 第三部流程第三小流程结束
                            deptList.push(process);
                            $scope.appProcess.push(deptList);
                            break;
                        case 'yunSuccess':// 第四部流程结束
                            $scope.appProcess.push(process);
                            break;
                        case 'applycheck':// 第五部流程结束（或者异常结束）
                            // 如果科信审核驳回
                            if (deptList.length && $scope.appProcess.length === 2) {
                                $scope.appProcess.push(deptList);
                            }
                            // 如果有此状态，则为结束状态
                            $scope.isEndStep = true;
                            break;
                    }

                });

                console.log($scope.appProcess);

                // 设置展示描述还是资源申请
                $scope.setTitleDesc(resp.resAppList[0]);
                // 生成输入框
                $scope.getAppListInputParams(resp.resAppList[0].appList);
                // 生成当前执行的步骤
                // $scope.step = {dataNum:$filter('orderStateCode')($scope.appProcess[0].orderState, $scope.appProcess[0].actBranch),name:$scope.passPersonName,tel:$scope.passPersonTel,state: $scope.appProcess[0].orderState};
                $scope.step = resp.progress;

                //驳回修改的数据
                var a = angular.toJson($scope.appProcess[0].appList);
                $scope.deepAppList = angular.fromJson(a);
                //驳回后展示
                $scope.changeAppList = [];
                if($scope.appProcess[0].appList){
                    // $scope.changeAppList = JSON.parse($scope.appProcess[0].str1);
                    if($scope.appProcess[0].str1 == 1){
                        angular.forEach($scope.appProcess[0].appList,function(val){
                            if(val.str1){
                                $scope.changeAppList.push(JSON.parse(val.str1))
                            }
                        })
                    }
                    // angular.forEach($scope.appProcess[0].appList,function(val){
                    //     if(val.str1){
                    //         $scope.changeAppList.push(JSON.parse(val.str1))
                    //     }
                    // })
                }
                $scope.isKxReject = 0;
                //修改时，是否可以直接提交：只有被科信处驳回的时候可以直接提交
                if(resp.resAppList.length>2 && resp.resAppList[2].activityStatus == "audit2"){
                    $scope.isKxReject = 1;
                }

            });
        });http://180.76.140.202:9123
            var CITY_NAME = $rootScope.CITY_CODE == 'JS' ? '江苏省公安厅' : $rootScope.CITY_NAME
        // 设置头部文字
        $header.setHeaderName( CITY_NAME+'警务云计算平台基础设施资源服务');

        // 是否需要驳回按钮
        $scope.taskDefKey = $routeParams.taskDefKey;

        // 审核人员
        $scope.ckUser = '';

        // 大数据资源池id
        $scope.bigDataPoolId = ['41', '42', '43', '44', '45', '46', '47', '48', '49'];

        /**
         * 如果是大数据，则返回接口给的数据
         *
         * @param { Object } app 当前选择的应用
         */
        $scope.getLoginNameByType = function(app) {
            // 如果当前资源id是大数据的资源id，则返回系统默认值
            if ($scope.bigDataPoolId.inArray(app.resId)) {
                return $scope.appProcess[0].bigdataLogin;
            }
            if(JSON.parse(app.remarks).length>2){
                if(JSON.parse(app.remarks)[3].value2 == 'Linux'){
                    return 'root'
                }
            }
            return 'Administrator';
        };

        /**
         * 根据类型生成待输入框
         *
         * @param { Array } list 列表
         */
        $scope.getAppListInputParams = function(list) {
            // 如果当前不是运维人员审核
            if (!$scope.isShowTable) {
                return;
            }
            // 可以输入的内容
            $scope.inputList = [];
            // 获取列表
            angular.forEach(list, function(app) {
                if(app.isNotChange){

                }else{
                    for(var i = 0; i < Number(app.applyNum); i ++) {
                        var ips = app.ips.split(',')
                        var mountName = app.mount_name.split(',')
                        // 先深拷贝一份原来的对象
                        var inputObj = {
                            id: app.id,
                            resName: app.resName,
                            remarks: app.remarks,
                            config: JSON.parse(app.remarks || '[]'),
                            ips: ips[i],
                            ipsDisabled:!ips[i] ? false : true,
                            login_name: $scope.getLoginNameByType(app),
                            login_pwd: '@xxzx123',
                            mount_name: mountName[i],
                            mount_nameDisabled:!mountName[i] ? false : true,
                            load_add: '',
                            entity_add: '',
                            // 版本
                            version: '',
                            // 系统名称
                            typeName: '',
                            // 版本列表
                            typeList: []
                        };
                        // 默认是大数据的内容
                        inputObj.require = ['login_name', 'login_pwd'];

                        // 判断资源id
                        switch (app.resId) {
                            // 云主机
                            case '35':
                                inputObj.require = ['ips', 'login_name', 'login_pwd'];
                                // // 如果当前是centos数据库
                                // if (app.remarks.toLowerCase().indexOf('centos') >= 0) {
                                //     inputObj.login_name = 'root';
                                //     inputObj.require.push('type');
                                //     inputObj.typeName = 'CentOS';
                                //     inputObj.typeList = ['5.8', '6.8', '7.2'];
                                // }
                                // // 如果当前是Ubuntu数据库
                                // if (app.remarks.toLowerCase().indexOf('ubuntu') >= 0) {
                                //     inputObj.login_name = 'root';
                                //     inputObj.require.push('type');
                                //     inputObj.typeName = 'Ubuntu';
                                //     inputObj.typeList = ['9.1', '10.04', '11.04'];
                                // }
                                // // 如果当前是SUSE数据库
                                // if (app.remarks.toLowerCase().indexOf('suse') >= 0) {
                                //     inputObj.login_name = 'root';
                                //     inputObj.require.push('type');
                                //     inputObj.typeName = 'SUSE';
                                //     inputObj.typeList = ['10', '11.4', '12.2'];
                                // }
                                // // 如果当前是RedHat数据库
                                // if (app.remarks.toLowerCase().indexOf('redhat') >= 0) {
                                //     inputObj.login_name = 'root';
                                //     inputObj.require.push('type');
                                //     inputObj.typeName = 'RedHat';
                                //     inputObj.typeList = ['5.8', '6.4', '7.2'];
                                // }
                                break;
                            // 容器
                            case '36':
                                inputObj.require = ['ips', 'login_name', 'login_pwd'];
                                break;
                            // 云存储
                            case '37':
                                inputObj.require = ['ips', 'login_name', 'login_pwd', 'mount_name'];
                                break;
                            // 数据库服务器
                            case '38':
                                inputObj.require = ['ips', 'login_name', 'login_pwd'];
                                // // 如果当前是oracle数据库
                                // if (app.remarks.toLowerCase().indexOf('oracle') >= 0) {
                                //     inputObj.typeName = 'Oracle';
                                //     inputObj.typeList = ['11', '12'];
                                // }
                                // // 如果当前是db2数据库
                                // if (app.remarks.toLowerCase().indexOf('db2') >= 0) {
                                //     inputObj.typeName = 'db2';
                                //     inputObj.typeList = ['9.7'];
                                // }
                                // // 如果当前是db2数据库
                                // if (app.remarks.toLowerCase().indexOf('sqlserver') >= 0) {
                                //     inputObj.typeName = 'SQLServer';
                                //     inputObj.typeList = ['2005-2012'];
                                // }
                                break;
                            // 负载均衡 : 应用负载
                            case '39':
                                inputObj.require = ['load_add', 'entity_add'];
                                break;
                            // 负载均衡 : 应用负载
                            case '40':
                                inputObj.require = ['load_add', 'entity_add'];
                                break;
                        }
                        $scope.inputList.push(inputObj);
                    }
                }

            });
            // angular.forEach($scope.expansionList,function (item,index) {
            //
            // })
        };

        /**
         * 校验用户输入的内容
         */
        $scope.validInputAppList = function() {
            // 如果当前不是运维人员审核
            if (!$scope.isShowTable) {
                return true;
            }

            // 如果没有展示的内容
            if (!$scope.inputList || !$scope.inputList.length) {
                return true;
            }
            // 校验成功的标志
            var successFlag = true;
            var validIp = true;
            // 当前ip的集合
            var ipList = [];

            // 遍历所有的输入框
            angular.forEach($scope.inputList, function(input) {
                angular.forEach(input.require, function(require) {
                    if (require === 'type') {
                        successFlag = successFlag && Boolean(input['version']);
                    } else {
                        successFlag = successFlag && Boolean(input[require]);

                        // 如果当前是ip
                        if (require === 'ips') {
                            // 如果正则表达式匹配失败（IP输入不符合要求）
                            if (!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(input[require])) {
                                successFlag = false;
                                validIp = false;
                                layer.msg('请输入正确的ip地址');
                            }
                            // 如果当前校验成功，则校验ip是否重复
                            // if (successFlag && ipList.inArray(input[require])) {
                            //     successFlag = false;
                            //     validIp = false;
                            //     layer.msg('请不要输入重复的ip地址');
                            // }
                            ipList.push(input[require]);
                        }
                    }
                });
            });
            // 如果字段没有填写
            if (!successFlag && validIp) {
                layer.msg('请将详细配置信息填写完全');
            }
            return successFlag;
        };

        /**
         * 标题描述
         *
         * @param { Object } process 流程节点
         */
        $scope.setTitleDesc = function(process) {
            // 如果数据中心领导审批结束后
            if (process.orderState === '321') {
                $scope.titleDesc = '资源配置信息';
                // 展示填写明细配置的列表
                $scope.isShowTable = true;
                return;
            }
            // 如果数据中心领导审批结束后
            if (process.orderState === '31' && process.actBranch === 'ok') {
                $scope.titleDesc = '资源配置信息';
                // 展示填写明细配置的列表
                $scope.isShowTable = true;
                return;
            }
            // 展示填写明细配置的列表
            $scope.isShowTable = false;
            // 默认展示描述
            $scope.titleDesc = '描述';
        };

        /**
         * 获取科信的进程状态
         *
         * @param { Array } processList 进程状态
         */
        $scope.getKxAppProcess = function(processList) {
            // 进程列表
            if (!processList || !processList.length) {
                return 0;
            }

            // 如果状态是网络管理室驳回，显示
            if (processList[0].orderState === '4') {
                return 0;
            }

            // 如果状态是分管领导驳回，显示
            if (processList[0].orderState === '41') {
                return 1;
            }

            // 如果状态是数据中心驳回，显示
            if (processList[0].orderState === '42') {
                return 2;
            }

            // 如果状态是数据中心领导驳回，显示
            if (processList[0].orderState === '421') {
                return 3;
            }

            return processList.length;
        };

        // 审核结果
        $scope.auditResultFlag = 'yes';

        // 审批意见
        $scope.auditResultComment = '';

        // 科信状态
        $scope.kxStepType = 2;

        // 选择快速流程还是正常流程，如果是分管领导审批，则此项必填
        $scope.actBranch = 'ok';

        /**
         * 下载文件
         *
         * @param { String } path 文件路径
         */
        $scope.downloadFileHref = '';
        $scope.handlerDownloadFile = function(path,event) {
            // 如果文件没有上传
            // if (!path) {
            //     layer.msg('该文件暂未上传');
            //     return;
            // }
            // 下载文件
            //window.open($CONST.$IP + '/api/web/v1/fileDowlond?fileName=' + decodeURIComponent(path));

        };
        $scope.getEventByDown = function(e,path){
            // console.log(e);
            if(3 == e.which){
                // alert('这 是右键单击');
                $scope.downloadFileHref = $CONST.$IP + '/api/web/v1/fileDowlond?fileName=' + decodeURIComponent(path);
            }else if(1 == e.which){
                // alert('这 是左键单击');
                $scope.downloadFileHref = 'javascript:void(0);';
                window.open(decodeURIComponent(path));
            }

        };
        $scope.getFileDownPath = function(path){
            // 如果文件没有上传
            if (!path) {
                layer.msg('该文件暂未上传');
                return;
            }
            // return $CONST.$IP + '/api/web/v1/fileDowlond?fileName=' + decodeURIComponent(path);
        }

        /**
         * 签收任务
         */
        $scope.fetchTaskClaim = function(callback) {
            $user.getUserInfo(function(userInfo) {
                $api.apiTaskClaim({
                    jSessionId: userInfo.sessionIdNew,
                    taskId: $routeParams.taskId
                }).then(function() {
                    callback && callback(userInfo);
                })
            });
        };

        $scope.isEndResult = true;
        /**
         * 当是自己的时候，点击结束流程
         */
        $scope.handlerEndAuditResult = function() {
            // 默认是同意
            $scope.auditResultFlag = 'yes';
            // 先获取签收任务，后台签收任务成功后提交审核意见
            $scope.fetchTaskClaim(function(userInfo) {
                // 提交审核意见
                $api.apiSubReviewed({
                    "actFlag": $scope.auditResultFlag,
                    "orderState": $scope.appProcess[0].orderState,
                    "actComment": $scope.auditResultComment,
                    "taskId": $routeParams.taskId,
                    "taskName": $routeParams.taskName,
                    "taskDefKey": $routeParams.taskDefKey,
                    "procInsId": $routeParams.procInsId,
                    "procDefId": $routeParams.procDefId,
                    "jSessionId": userInfo.sessionIdNew,
                    "id": $routeParams.id
                }).then(function() {
                    layer.msg('已经成功结束流程', { time: 1500 }, function() {
                        // $scope.handlerPrintPage();
                        $scope.step.dataNum = 5;
                        $scope.isEndResult = false;

                        // $scope.handlerToMyToDoPage();
                        $scope.$apply();
                    }, { time: 1500 });
                });
            });
        };

        /**
         * 分割配置信息
         *
         * @param { String } configStr 配置信息
         */
        $scope.splitConfigMessage = function(configStr) {
            // 待返回的配置信息列表
            var returnConfigList = [];

            // 将数据分割后遍历 去除空字符串
            angular.forEach(configStr.split("  "), function(config) {
                if (config) {
                    returnConfigList.push(config);
                }
            });
            return returnConfigList;
        };

        /**
         * 提交审核结果
         */
        $scope.handlerToSubmitAuditResult = function() {
            // 如果没有勾选审核结果，则提示
            if (!$scope.auditResultFlag) {
                layer.msg('请勾选审核结果');
                return;
            }

            // 如果没有勾选审核结果，则提示
            // if ($scope.auditResultFlag === 'no' && !$scope.auditResultComment) {
            //     layer.msg('您当前是驳回，请填写驳回审核意见');
            //     return;
            // }

            // 如果当前是分管领导，且没有勾选审核流程，则提示
            if ($scope.auditResultFlag === 'yes' && !$scope.actBranch && $scope.appProcess[0].orderState === '3') {
                $scope.actBranch=='ok';
            }

            // 如果运维审核是，校验输入框不通过
            if (!$scope.validInputAppList()) {
                return;
            }

            angular.forEach($scope.deepAppList,function(val,num){
                val.remarks = angular.toJson(val.config)
            })

            //如果当前没有盖章，且是审核人员
            //  if (!$scope.signImage && !$scope.needNotSign) {
            //      layer.confirm("客户端已更新至新版本V9.0，是否下载最新客户端？",{btn:['我已安装','下载并安装'],btn1:function(){
            //
            //              // 1s后重新加载电子签章
            //              var version = $browserVersion.getVersion()
            //              if(version){
            //                  if(version <= 50){
            //                      layer.confirm('是否下载最新版本谷歌浏览器',{btn:['是','否'],btn1:function () {
            //                          window.open('https://50.16.129.139/f/fileDowlondByType?type=chrome')
            //                      }})
            //                  }else{
            //                      $scope.isPopUpSignImage = true;
            //                      layer.msg('正在为你生成电子签章，请确保U盾与电脑保持连接。');
            //                      $timeout(function() {
            //                          $scope.isPopUpSignImage = true;
            //                      }, 1000);
            //                  }
            //              }
            //          },btn2:function(){
            //              window.open('http://dzqz.gat.js:9080/iSignatureServer/index.htm');
            //          }});
            //      return;
            //  }

            //判断是否打印
            // if(!$scope.appProcess[0].orderState){
            //     if(!$scope.isPrint){
            //         layer.msg("请先打印");
            //         return;
            //     }
            // }
            var rejectData = "[]";
            if($scope.auditResultFlag === 'no'){
                rejectData = JSON.stringify($scope.deepAppList);
            }

            // 先获取签收任务，后台签收任务成功后提交审核意见
            $scope.fetchTaskClaim(function(userInfo) {
                // 提交审核意见
                $api.apiSubReviewed({
                    "actFlag": $scope.auditResultFlag,
                    "signImage": $scope.signImage,
                    "serverList": $scope.inputList,
                    "actBranch": $scope.appProcess[0].orderState == 3 && $scope.auditResultFlag == 'yes'?"ok" : undefined,
                    "ck_user": $scope.ckUser,
                    "actComment": $scope.auditResultComment,
                    "taskId": $routeParams.taskId,
                    "taskName": $routeParams.taskName,
                    "taskDefKey": $routeParams.taskDefKey,
                    "procInsId": $routeParams.procInsId,
                    "procDefId": $routeParams.procDefId,
                    "jSessionId": userInfo.sessionIdNew,
                    "id": $routeParams.id,
                    "str1":rejectData
                }).then(function() {
                    layer.msg('已经成功提交审核', { time: 1500 }, function() {
                        $scope.handlerToMyToDoPage();
                        $scope.$apply();
                    }, { time: 1500 });
                });
            });
        };

        /**
         * 跳转到我的代办页面
         */
        $scope.handlerToMyToDoPage = function() {
            $header.refressNumber();
            $location.url('/resource/apply/my/commission');
        };

        /**
         * 跳转到编辑申请单页面，并带过去数据
         */
        $scope.handlerToEditApplyTablePage = function() {
            // 提交信息
            $user.getUserInfo(function(userInfo) {
                // 提交审核意见
                $api.apiSubReviewed({
                    "actFlag": 'no',
                    "signImage": $scope.signImage,
                    "ck_user": $scope.ckUser,
                    "actComment": '修改申请单',
                    "taskId": $routeParams.taskId,
                    "taskName": $routeParams.taskName,
                    "taskDefKey": $routeParams.taskDefKey,
                    "procInsId": $routeParams.procInsId,
                    "procDefId": $routeParams.procDefId,
                    "jSessionId": userInfo.sessionIdNew,
                    "id": $routeParams.id
                }).then(function() {
                    $location.url('/resource/apply/table/' + $routeParams.taskId + '/' + $routeParams.procInsId+ '/' + $routeParams.reType + '/true');

                });
            });
        };

        $scope.isSubmitCommitPage = function(){
            if($scope.appProcess[0].str1 == '1'){
                $scope.handlerSubmitEditPage();
            }else {
                $scope.handlerToEditApplyTablePage();
            }
        };

        /**
         * 直接提交修改单
         */
        $scope.handlerSubmitEditPage = function(){
            var list = $scope.appProcess[0].appList;
            var serverList = [];
            angular.forEach(list,function(val){
                serverList.push({
                    name:val.resName,
                    // buyNum:JSON.parse(val.str1).applyNum || 0,
                    buyNum: val.str1?JSON.parse(val.str1).applyNum: 0,
                    network:val.net_work,
                    serverId:val.resId,
                    // config:JSON.parse(val.str1).config,
                    config:val.str1?JSON.parse(val.str1).config: [],
                    // serverInfo:JSON.parse(val.str1).remarks,
                    serverInfo:val.str1?JSON.parse(val.str1).config: '',
                })
            });

            // 获取
            $api.apiQueryApplyInfo({
                taskId: $routeParams.taskId,
                procInsId: $routeParams.procInsId
            }).then(function(resp) {
                $scope.applyTable = resp;
                $scope.applyTable.businessid = session.get("businessId");
                // 先获取用户信息
                $user.getUserInfo(function(userInfo) {
                    // 提交资源
                    angular.forEach(serverList,function(val){
                        val.serverInfo = JSON.stringify(val.serverInfo)
                    })
                    $api.apiCkServiceConfigue({
                        jSessionId: userInfo.sessionIdNew,
                        taskId: $routeParams.taskId,
                        procInsId: $routeParams.procInsId,
                        serverList: serverList,
                        appInfoJson: $scope.applyTable,
                        id:$routeParams.id
                    }).then(function() {
                        // 提示提交成功消息
                        layer.msg('提交申请成功', { time: 1500 }, function() {
                            // 跳转到我的申请页面中
                            $location.url('/myApplication');
                            $scope.$apply();
                        });
                    });
                });
            });

        };


        /**
         * 跳转到打印页面
         */
        $scope.handlerPrintPage = function() {
            $scope.isPrint = 1;
            var auditResult = {image:$scope.signImage,result:$scope.auditResultComment,time:$filter('formatTime')(new Date())};
            // 讲数据保存到session中
            session.set('approval-process', $scope.approvalProcess);
            session.set('audit-result',auditResult);
            // 打开新页面
            window.open('/ResourceApply/app/pages/print/print.html');
        };


        // 监听浏览器后退事件
        $scope.$on("$locationChangeStart", function(ev){
            if($routeParams.detail==1||$routeParams.detail==='1'){
                // ev.preventDefault();
                // 以下为监听到返回的操作
                $location.path('/resource/apply/detail/'+$routeParams.appNumber+'/'+$routeParams.appName+'/'+$routeParams.competentDept+'/'+$routeParams.startTime+'/'+$routeParams.endTime+'/'+$routeParams.showCount+'/'+$routeParams.currentPage)
            }
        });
