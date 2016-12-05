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

// angular init
promise.run(function($rootScope, $timeout, $interval, $filter, $cookies, SinfoService, SuserService, SscriptService, SeaterService, SdelayService){
  // charjs 初始设置
  Chart.defaults.global.defaultFontColor = '#fff';
  Chart.defaults.global.scaleFontColor = '#fff';
  Chart.defaults.global.multiTooltipTemplate = '<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>';

  // 超时检测，2小时超时
  $rootScope.Mexpire = new Date();

  // 消息队列，用于消息区临时提示
  $rootScope.Minfos = [];
  $rootScope.MinfosHistory = [];
  $rootScope.MloadingMissions = 0;

  // 自定义面板配置
  $rootScope.Mtest = [
    {
        title: '自定义1',
        type: 'ansibleWalkerText',
        vars: {}
    },
    {
        title: '自定义2',
        type: 'ansibleWalkerText',
        vars: {}
    }
  ];


  // Eater host服务
  $rootScope.FgetHost = function(){
    var vars = {
      'extend': true,
      'opt': 'id%%name%%group%%ip%%ip_addr%%model%%vender',
    };
    SinfoService.FstartLoading();
    SeaterService.Fhost($rootScope.Mtoken).get(
      vars,
      function successCallback(callbackdata){
        $rootScope.Mhosts = callbackdata.data;
        $rootScope.MhostsNum = $rootScope.Mhosts.length;
        SinfoService.FstopLoading();
        SinfoService.FaddInfo('已同步' + $rootScope.MhostsNum + '条主机信息');
        SdelayService.Fdelay();
      },
      function errorCallback(callbackdata){
        SinfoService.FstopLoading();
        SinfoService.FaddInfo('获取主机信息失败:' + callbackdata.message);
      }
    );
  };
  // Eater host sync服务
  $rootScope.FhostSync = function(){
    var vars = {};
    SinfoService.FstartLoading();
    SeaterService.FhostSync($rootScope.Mtoken).post(
      vars,
      {},
      function successCallback(callbackdata){},
      function errorCallback(callbackdata){}
    );
  };
  $rootScope.FinfoHostSync = function(){
    var vars = {
      
    };
    SinfoService.FstartLoading();
    SeaterService.FhostSync($rootScope.Mtoken).post(
      vars,
      {},
      function successCallback(callbackdata){},
      function errorCallback(callbackdata){}
    );
  };

  // 脚本信息服务
  $rootScope.FgetScriptList = function(){
    SinfoService.FstartLoading();
    SscriptService.FgetList($rootScope.Mtoken).get(
      {},
      function successCallback(callbackdata){
        $rootScope.Mscripts = callbackdata.scripts;
        $rootScope.MscriptsNum = $rootScope.Mscripts.length;
        SinfoService.FstopLoading();
        SinfoService.FaddInfo('已同步' + $rootScope.MscriptsNum + '条脚本信息');
        SdelayService.Fdelay();
      },
      function errorCallback(callbackdata){
        SinfoService.FstopLoading();
        SinfoService.FaddInfo('获取脚本信息失败:' + callbackdata.message);
      }
    );
  };

  // 初始化动作
  $rootScope.FinitAction = function(){
		$rootScope.FgetHost();
		$rootScope.FgetScriptList();
    SdelayService.Fdelay();
		SdelayService.FstopInterval();
		SdelayService.FstartInterval();
	};

  // 自动登录，使用cookie保存token
  $rootScope.FtokenSignIn = SuserService.FtokenSignIn;
  // token刷新，包含一次自动登录
  $rootScope.FtokenRefresh = SuserService.FtokenRefresh;
  // 自动登录逻辑
  $rootScope.FcookieAuth = function(){
    var Vrefreshtoken = $cookies.get('refreshtoken');
    if (!Vrefreshtoken){
      // refreshtoken已过期，不刷新，只尝试token自动登录
      $rootScope.MsignError = false;
      $rootScope.MisSign = false;
      $rootScope.FtokenSignIn();
    }
    else {
      // refreshtoken未过期，尝试刷新并自动登录
      $rootScope.FtokenRefresh();
    }
  };
  // 初始化自动登录
  $rootScope.FcookieAuth();

  // 监控区
  $rootScope.$watch('MisSign', function(newValue, oldValue){
    $rootScope.MshowSign = !$rootScope.MisSign;
  });
  $rootScope.$watch('MloadingMissions', function(newValue, oldValue){
    if (newValue > 0) {
      $rootScope.MshowNavLoading = true;
    } else {
      $rootScope.MshowNavLoading = false;
    }
  });

  // 销毁区
  $rootScope.$on('$destroy', function() {
    // Make sure that the interval is destroyed too
    SdelayService.FstopInterval();
  });
});
