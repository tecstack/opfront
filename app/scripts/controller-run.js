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
promise.run(function($rootScope, $timeout, $filter, $cookies, SinfoService, SuserService, ShostService, SscriptService){
  // charjs 初始设置
  Chart.defaults.global.defaultFontColor = '#fff';
  Chart.defaults.global.scaleFontColor = '#fff';
  Chart.defaults.global.multiTooltipTemplate = '<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>',

  // 消息队列，用于消息区临时提示
  $rootScope.Minfos = [];

  // $rootScope.FaddInfo = function(node){
  //   SinfoService.FaddInfo(node);
  // };

  // 主机信息服务
  $rootScope.FgetHost = function(){
    var vars = {};
    ShostService.Fhost($rootScope.Mtoken).get(
      vars,
      function successCallback(callbackdata){
        $rootScope.Mhosts = callbackdata.data;
        $rootScope.MhostsNum = $rootScope.Mhosts.length;
        SinfoService.FaddInfo('已同步' + $rootScope.MhostsNum + '条主机信息');
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo('获取主机信息失败:' + callbackdata.message);
      }
    );
  };

  // 脚本信息服务
  $rootScope.FgetScriptList = function(){
    SscriptService.FgetList($rootScope.Mtoken).get(
      {},
      function successCallback(callbackdata){
        $rootScope.Mscripts = callbackdata.scripts;
        $rootScope.MscriptsNum = $rootScope.Mscripts.length;
        SinfoService.FaddInfo('已同步' + $rootScope.MscriptsNum + '条脚本信息');
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo('获取脚本信息失败:' + callbackdata.message);
      }
    );
  };

  // 自动登录，使用cookie保存token
  $rootScope.FtokenSignIn = SuserService.FtokenSignIn;
  // token刷新，包含一次自动登录
  $rootScope.FtokenRefresh = SuserService.FtokenRefresh;
  // 自动登录逻辑
  $rootScope.FcookieAuth = function(){
    var Vrefreshtoken = $cookies.get('refreshtoken');
    if (!Vrefreshtoken){
      // refreshtoken已过期或者未保持登录，不刷新，只尝试token自动登录
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
});
