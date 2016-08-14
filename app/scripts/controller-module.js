'use strict';

/**
 * @ngdoc function
 * @name promise.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the promise
 */

var promise = angular.module('promise');

// --------------------------Module---------------------------
promise.controller('Cmodule', function($scope, $rootScope, $timeout, $interval, SscriptService, SwalkerService, SinfoService){
  // walker接口服务
  // 轮询集，里面存放了当前页面的所有walker轮询任务
  $scope.MinfoWalkerPromise = {};
  $scope.FcreateWalker = function(VmoduleName, VmoduleVars){
    SwalkerService.FcreateWalker($rootScope.Mtoken, VmoduleName).post(
      {},
      VmoduleVars,
      function successCallback(callbackdata){
        $scope.MwalkerId = callbackdata.walker_id;
        $scope.MerrInfo = callbackdata.message;
        $scope.MinfoWalkerPromise[$scope.MwalkerId] = $interval(
          function (){
            $scope.FinfoWalker($scope.MmoduleSelected.name, $scope.MwalkerId);
          },
          2000
        );
      },
      function errorCallback(callbackdata){
        // console.log(callbackdata);
        $scope.MshowLoading = false;
        $scope.MerrInfo = callbackdata.data.message;
      }
    );
  };
  $scope.FqueryWalker = function(VmoduleName){
    SwalkerService.FqueryWalker($rootScope.Mtoken, VmoduleName).get(
      {},
      function successCallback(callbackdata){
      },
      function errorCallback(callbackdata){
        // console.log(callbackdata);
      }
    );
  };
  $scope.FinfoWalker = function(VmoduleName, VwalkerId){
    SwalkerService.FinfoWalker($rootScope.Mtoken, VmoduleName, VwalkerId).get(
      {},
      function successCallback(callbackdata){
        var VtotalHosts = callbackdata.trails.length;
        var Vsuccess = 0;
        var Vfailed = 0;
        var Vunreachable = 0;
        var Vskipped = 0;
        for (var index in callbackdata.trails) {
          var node = callbackdata.trails[index];
          var ip = node.ip;
          $scope.Mresult[ip] = node;
          if (node.sum_changed || node.sum_ok) {
            Vsuccess += 1;
          } else if (node.sum_failures) {
            Vfailed += 1;
          } else if (node.sum_unreachable) {
            Vunreachable += 1;
          } else if (node.sum_skipped) {
            Vskipped += 1;
          }
        };
        $scope.Mprogress.success = Vsuccess;
        $scope.pro.result.current = $scope.Mprogress.success;
        $scope.Mprogress.failed = Vfailed;
        $scope.Mprogress.unreachable = Vunreachable;
        $scope.Mprogress.skipped = Vskipped;
        $scope.Mprogress.total = VtotalHosts;
        $scope.MerrInfo = callbackdata.message;
      },
      function errorCallback(callbackdata){
        $scope.MerrInfo = callbackdata.data.message;
      }
    );
  };
  // 停止所有轮询
  $scope.FstopInfoWalker = function(){
    if (!jQuery.isEmptyObject($scope.MinfoWalkerPromise)) {
      var Vnum = Object.keys($scope.MinfoWalkerPromise).length;
      for (var walkerId in $scope.MinfoWalkerPromise) {
        $interval.cancel($scope.MinfoWalkerPromise[walkerId]);
        delete $scope.MinfoWalkerPromise[walkerId];
      }
      SinfoService.FaddInfo('已停止' + Vnum + '个轮询任务');
      $scope.MshowLoading = false;
    };
  };
  $scope.$on('$destroy', function() {
    // Make sure that the interval is destroyed too
    $scope.FstopInfoWalker();
  });

  // ---------------------Module Editor---------------------
  // init
  $scope.Mprogress = {
    'success': 0,
    'failed': 0,
    'unreachable': 0,
    'skipped': 0,
    'total': 0,
  };
  $scope.MosuserOptions = [
    {'label':'选取执行用户', 'value':''},
    {'label':'ROOT', 'value':'root'},
  ];
  // codemirror 结构体
  $scope.Meditor = {};
  $scope.MeditorOptions = {
    'shell': {
      lineNumbers: true,
      theme:'monokai',
      // readOnly: 'nocursor',
      lineWrapping : false,
      mode: 'shell',
      onLoad: function(_cm){
        $scope.Meditor.shell = _cm;
      },
    },
    'script': {
      lineNumbers: true,
      theme:'monokai',
      readOnly: 'nocursor',
      lineWrapping : false,
      mode: 'python',
      onLoad: function(_cm){
        $scope.Meditor.script = _cm;
      },
    },
    'executor': {
      lineNumbers: true,
      theme:'monokai',
      readOnly: 'nocursor',
      lineWrapping : false,
      mode: 'shell',
      onLoad: function(_cm){
        $scope.Meditor.executor = _cm;
        $scope.Meditor.executor.setSize(null, '500px');
      },
    },
  };

  // $scope.Meditor.script.setSize('500px','1000px');

  $scope.MselectContent = function(Vcontent){
    $scope.MmoduleSelected.content = Vcontent;
    $rootScope.MshowHelper = false;
  };

  // shell editor
  $scope.MshellContent = {
    'shell': '',
    'osuser': ''
  };

  // script editor
  $scope.MscriptContent = {
    'scriptid': '',
    'osuser': ''
  };
  $scope.FshowScripts = function(){
    $rootScope.MshowHelper = true;
    for (var key in $rootScope.MshowHelperNode) {
      $rootScope.MshowHelperNode[key] = false;
    }
    $rootScope.MshowHelperNode.script = true;
  };

  // ---------------------Executor---------------------
  // 用来存放进度条数据
  $scope.pro = {
    'result': {
      'name': '成功个数',
      'max': 0,
      'current': 0,
    },
  };
  $scope.MpostWalkerInfo = {};
  $scope.Mresult = {};
  $scope.Fexecute = function(){
    $scope.pro.result = {
      'name': '成功个数',
      'max': 0,
      'current': 0,
    };
    $scope.MshowRight.detail = false;
    $scope.MshowRight.executor = true;
    $scope.MshowLoading = true;
    $scope.Mresult = {};
    $scope.MpostWalkerInfo = {};
    jQuery.extend($scope.MpostWalkerInfo,$scope.MmoduleSelected.content);
    $scope.MpostWalkerInfo.iplist = [];
    $scope.Mstdout = '';
    for (var kind in $scope.Mprogress) {
      $scope.Mprogress[kind] = 0;
    }
    for (var node in $rootScope.MhostsSelected) {
      var ip = $rootScope.MhostsSelected[node].interfaces[0].ip;
      $scope.MpostWalkerInfo.iplist.push(ip);
      $scope.Mresult[ip] = {};
      $scope.pro.result.max += 1;
    }
    $scope.FcreateWalker($scope.MmoduleSelected.name, $scope.MpostWalkerInfo);
  };
  $scope.Fback = function(){
    $scope.MshowRight.detail = true;
    $scope.MshowRight.executor = false;
  };
  $scope.FshowStdout = function(node){
    if (node.stdout) {
      $scope.Mstdout = node.stdout;
    }
    else if (node.stderr) {
      $scope.Mstdout = node.stderr;
    };
  };


  // ---------------------watch & show---------------------
  // 用来决定detail->module->?页面里对应模块编辑器的显示
  $scope.Mmodules = {
    'shell': false,
    'script': false
  };
  // 当前选择进行编辑的模块，name是名称，content是左侧显示栏的内容，也是后续发往createWalker的内容之一
  $scope.MmoduleSelected = {
    'name': '',
    'content': {}
  };
  // 选择模块，显示对应的编辑器，屏蔽其他模块编辑器，更改MmoduleSelected内容
  $scope.FselectModule = function(VmoduleName){
    $rootScope.MshowHelper = false;
    $scope.MmoduleSelected.name = VmoduleName;
    $scope.MmoduleSelected.content = {};
    for (var key in $scope.Mmodules) {
      $scope.Mmodules[key] = (VmoduleName == key)?true:false;
    };
    // 特殊逻辑：当选择script模块时自动弹出script列表
    if (VmoduleName == 'script') {
      $scope.FshowScripts();
    };
  };
  // 决定是否显示执行标志，只有选择了主机和编辑了模块内容后才会显示
  $scope.MshowGo = false;
  // 决定右侧的界面显示，detail代表选定编辑页面，executor代表执行过程页面，执行execute()之后便会跳转到executor
  $scope.MshowRight = {
    'detail': true,
    'executor': false,
  };
  // 决定detail编辑页面里的内容显示，hosts代表主机列表选取页面，module代表模块编辑器
  $scope.MshowRightNode = {
    'hosts': false,
    'module': false,
  };
  // 用来决定显示哪一种条件判定结果，是否选择了主机，是否选定了模块
  $scope.MshowBottomSuccess = {
    'hosts': false,
    'module': false
  };
  // 切换右侧node显示，在主机列表页面和模块编辑器之间切换
  $scope.FshowRightNode = function(name){
    for (var key in $scope.MshowRightNode) {
      $scope.MshowRightNode[key] = (key === name)?true:false;
    };
  };
  // 监控rootScope中的script变量（一般是从helper或者其他页面触发），根据语言变更编辑器的样式，更新scriptid。
  $scope.$watch('Mscript', function(newValue, oldValue){
    if ($rootScope.Mscript) {
      $scope.MeditorOptions.script.mode = $rootScope.Mscript.script_lang;
      $scope.MscriptContent.scriptid = $rootScope.Mscript.script_id;
      $scope.MscriptContent.name = $rootScope.Mscript.script_name;
    };
  });
  // 监控是否选定了模块内容，变更判定状态和字段
  $scope.$watch('MmoduleSelected.content', function(newValue, oldValue){
    $scope.MshowBottomSuccess.module = (jQuery.isEmptyObject(newValue))?false:true;
  });
  // 监控是否选定了hosts内容，变更判定状态和字段
  $scope.$watchCollection('MhostsSelected',function(newValue, oldValue){
    $scope.MshowBottomSuccess.hosts = ($rootScope.MhostsSelected.length > 0)?true:false;
  });
  // 监控两个判定状态，主机和模块，都选定之后出现执行按钮
  $scope.$watchCollection('MshowBottomSuccess', function(newValue, oldValue){
    $scope.MshowGo = ($scope.MshowBottomSuccess.hosts == true && $scope.MshowBottomSuccess.module == true)?true:false;
  });
  // 监控walker结果信息，如果成功更新了状态(ok/change/failed/unreachable/skipped)，则停止轮询
  $scope.$watchCollection('Mresult', function(newValue, oldValue){
    if (!jQuery.isEmptyObject(newValue)) {
      for (var node in newValue) {
        if (newValue[node].sum_ok || newValue[node].sum_changed || newValue[node].sum_failures || newValue[node].sum_unreachable || newValue[node].sum_skipped) {
          $scope.FstopInfoWalker();
          break;
        };
      };
    };
  });

});

// --------------------------Module Helper---------------------------
promise.controller('CmoduleHelper', function($scope, $rootScope){
  // pre-init
  $rootScope.MshowHelperNode = {
    'shell': false,
    'script': false
  };

  // action
  $scope.FselectScript = function(Vscript){
    $rootScope.Mscript = Vscript;
  };
});
