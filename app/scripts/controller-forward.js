/*jshint jquery: true, unused: false, undef:false*/
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
promise.controller('Cforward', function($scope, $rootScope, $timeout, $interval, $filter, SwalkerService, SinfoService, SdelayService){
  // walker service
  $scope.MinfoWalkerPromise = {};
  $scope.Msuccess = 0;
  $scope.MstatesInfo = {
    '-2': '任务已建立',
    '-1': '运行中',
    '0': 'Forward场景执行成功',
    '-3': '执行超时',
    '-4': '任务建立失败',
  };

  $scope.FcreateWalker = function(VmoduleName, VmoduleVars){
    SinfoService.FstartLoading();
    SwalkerService.FcreateWalker($rootScope.Mtoken, VmoduleName).post(
      {},
      VmoduleVars,
      function successCallback(callbackdata){
        $scope.MwalkerId = callbackdata.walker_id;
        $scope.Mstate = callbackdata.state;
        $scope.MinfoWalkerPromise[$scope.MwalkerId] = $interval(
          function (){
            $scope.FinfoWalker(VmoduleName, $scope.MwalkerId);
          },
          2000
        );
        SdelayService.Fdelay();
      },
      function errorCallback(callbackdata){
        // console.log(callbackdata);
        $scope.MshowLoading = false;
        $scope.MerrInfo = callbackdata.data.message;
        SinfoService.FstopLoading();
      }
    );
  };
  $scope.FqueryWalker = function(VmoduleName){
    SwalkerService.FqueryWalker($rootScope.Mtoken, VmoduleName).get(
      {},
      function successCallback(callbackdata){
        SdelayService.Fdelay();
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
        if (!jQuery.isEmptyObject($scope.MinfoWalkerPromise)) {
          var Vsuccess = 0;
          for (var index in callbackdata.trails) {
            var node = callbackdata.trails[index];
            var ip = node.ip;
            $scope.Mresult[ip] = node;
            if (node.sum_ok === 2) {
              Vsuccess += 1;
            }
          }
          $scope.Msuccess = Vsuccess;
          $scope.pro.result.current = $scope.Msuccess;
          $scope.Mstate = callbackdata.state;
          $scope.Mstdout = callbackdata.stdout;
          SdelayService.Fdelay();
        }
      },
      function errorCallback(callbackdata){
        $scope.MerrInfo = callbackdata.data.message;
      }
    );
  };
  $scope.FstopInfoWalker = function(){
    SinfoService.FstopLoading();
    if (!jQuery.isEmptyObject($scope.MinfoWalkerPromise)) {
      var Vnum = Object.keys($scope.MinfoWalkerPromise).length;
      for (var walkerId in $scope.MinfoWalkerPromise) {
        $interval.cancel($scope.MinfoWalkerPromise[walkerId]);
        delete $scope.MinfoWalkerPromise[walkerId];
      }
      SinfoService.FaddInfo('已停止' + Vnum + '个轮询任务');
      $scope.MshowLoading = false;
    }
  };
  $scope.$on('$destroy', function() {
    // Make sure that the interval is destroyed too
    $scope.FstopInfoWalker();
  });

  // hosts data
  $scope.MhostsDatasTh = ['ID','IP','主机名','厂家','型号','组'];
  $scope.MhostsDatasTd = [];
  $scope.FhostsDatasInit = function(){
    $scope.MhostsDatasTd = $filter('hostsInitFilter')($rootScope.Mhosts);
  };

  // script data
  $scope.MscriptsDatasTh = ['名称','语言','类型','公开','创建人','最后更新时间'];
  $scope.MscriptsDatasTd = [];
  $scope.FscriptsDatasInit = function(){
    $scope.MscriptsDatasTd = $filter('scriptsInitFilter')($rootScope.Mscripts, 2);
  };

  // Code Mirror
  $scope.Meditor = {};
  $scope.MeditorOptions = {
    'script': {
      lineNumbers: true,
      theme:'monokai',
      readOnly: true,
      lineWrapping : false,
      mode: 'python',
      onLoad: function(_cm){
        _cm.setSize(null, '300px');
      },
    },
    'executor': {
      lineNumbers: true,
      theme:'monokai',
      readOnly: true,
      lineWrapping : false,
      mode: 'shell',
      onLoad: function(_cm){
        _cm.setSize(null, '500px');
      },
    },
  };

  // Module select
  $scope.MmoduleSelected = {
    'name': 'forward',
    'content': {
      'scriptid': '',
      'params': '',
    },
  };
  $scope.FshowSelector = function(Vselector){
    for (var key in $scope.MshowSelector) {
      if ($scope.MshowSelector.hasOwnProperty(key)) {
        $scope.MshowSelector[key] = (key === Vselector)?true:false;
      }
    }
  };

  // Go
  $scope.MosuserOptions = [
    {'label':'选取执行用户', 'value':''},
    // {'label':'ROOT执行', 'value':'root'},
    {'label':'Admin执行', 'value':'admin'},
  ];
  $scope.Mosuser = 'admin';

  // Hosts Selector
  $scope.MhostsSelected = [];
  $scope.FselectHost = function(Vnode){
    var Vip = Vnode[1];
    if (jQuery.inArray(Vip, $scope.MhostsSelected) === -1) {
      $scope.MhostsSelected.push(Vip);
    }
  };
  $scope.FunSelectHost = function(Vnode){
    var Vip = Vnode[1];
    var Vindex = jQuery.inArray(Vip, $scope.MhostsSelected);
    if (Vindex !== -1) {
      $scope.MhostsSelected.splice(Vindex, 1);
    }
  };

  // Scripts Selector
  $scope.MscriptShow = {};
  $scope.MscriptSelected = {};
  $scope.FselectScript = function(Vnode){
    var Vtime = Vnode[5];
    for (var index in $rootScope.Mscripts) {
      if ($rootScope.Mscripts.hasOwnProperty(index)) {
        if ($rootScope.Mscripts[index].time_last_edit === Vtime) {
          $scope.MscriptShow = $rootScope.Mscripts[index];
          $scope.MmoduleSelected.content.scriptid = $scope.MscriptShow.script_id;
          $scope.MmoduleSelected.content.params = '';
          $scope.MeditorOptions.script.mode = $scope.MscriptShow.script_lang;
          $scope.MshowSelector.scripts = false;
          break;
        }
      }
    }
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
  $scope.Fjudge = function(){
    if ($scope.MhostsSelected.length === 0) {
      SinfoService.FaddInfo('请先选择目标主机！');
      return false;
    }
    if ($scope.MmoduleSelected.content.hasOwnProperty('scriptid')){
      if ($scope.MmoduleSelected.content.scriptid === '') {
        SinfoService.FaddInfo('请选取脚本！');
        return false;
      }
    }
    return true;
  };
  $scope.Fexecute = function(){
    if ($scope.Fjudge()) {
      $scope.pro.result = {
        'name': '成功个数',
        'max': 0,
        'current': 0,
      };
      $scope.MresultSelected = '';
      $scope.MshowExecutor = true;
      $scope.MshowLoading = true;
      $scope.Mresult = {};
      $scope.MpostWalkerInfo = {};
      // iplist [] , osuser '', xx
      jQuery.extend($scope.MpostWalkerInfo,$scope.MmoduleSelected.content);
      $scope.MpostWalkerInfo.iplist = $scope.MhostsSelected;
      $scope.MpostWalkerInfo.osuser = $scope.Mosuser;

      $scope.Mstdout = '';
      $scope.MerrInfo = '';
      $scope.Msuccess = 0;
      for (var index in $scope.MhostsSelected) {
        var ip = $scope.MhostsSelected[index];
        $scope.Mresult[ip] = {};
        $scope.pro.result.max += 1;
      }
      $scope.FcreateWalker($scope.MmoduleSelected.name, $scope.MpostWalkerInfo);
    }
  };
  $scope.Fback = function(){
    $scope.MshowExecutor = false;
    $scope.FstopInfoWalker();
  };

  // ---------------------watch & show---------------------
  $scope.MshowSelector = {
    'hosts': false,
    'scripts': false,
  };
  // 监控walker结果信息，如果成功更新了状态(ok/change/failed/unreachable/skipped)，则停止轮询
  $scope.$watch('Mstate', function(newValue, oldValue){
    if (!jQuery.isEmptyObject($scope.MinfoWalkerPromise)) {
      if (newValue >= 0 || newValue ===-3 || newValue === -4) {
        // success or timeout or fialed
        $scope.FstopInfoWalker();
        SinfoService.FaddInfo('任务结束');
        $scope.MerrInfo = $scope.MstatesInfo[$scope.Mstate];
      } else if (newValue === -1 || newValue === -2) {
        // established or running
        $scope.MerrInfo = $scope.MstatesInfo[$scope.Mstate];
      }
    }
  });

  $scope.$watchCollection('Mhosts', function(newValue, oldValue){
    $scope.FhostsDatasInit();
  });
  $scope.$watchCollection('Mscripts', function(newValue, oldValue){
    $scope.FscriptsDatasInit();
  });
});

// --------------------------Module Helper---------------------------
promise.controller('CforwardHelper', function($scope, $rootScope){
});
