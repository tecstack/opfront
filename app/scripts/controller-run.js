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

  // 消息队列，用于消息区临时提示
  $rootScope.Minfos = [];
  $rootScope.FaddInfo = function(node){
    SinfoService.FaddInfo(node);
  };

  // 主机信息服务，包含所有hosts相关信息
  $rootScope.MhostsData = [];
  $rootScope.MhostsSelected = [];
  $rootScope.MhostsDataFilter = [];
  $rootScope.MhostsDataTh = [
    // th的值用于展示；filtername的值用于定位筛选，一定要和数据里的key一致
    {'th': '主机ID', 'filterName': 'hostid'},
    {'th': '主机IP', 'filterName': 'ip'},
    {'th': '主机名', 'filterName': 'host'},
    {'th': '组', 'filterName': 'name'}
  ];
  $rootScope.Mfilters = [
    {filterName:'ip', filterBool:'=', filterContent:''},
    {filterName:'host', filterBool:'=', filterContent:''},
    {filterName:'name', filterBool:'=', filterContent:''}
  ];
  $rootScope.MpageOptions = {
    'pp': '0',
    'totalPage': 1,
    'currentPage': 1
  };
  $rootScope.FaddFilter = function(){
    $rootScope.Mfilters.push({filterName:'', filterBool:'', filterContent:''});
  };
  $rootScope.FremoveFilter = function(filter){
    var Vfilters = $rootScope.Mfilters;
    Vfilters.splice(Vfilters.indexOf(filter), 1);
  };
  $rootScope.FgetHost = function(){
    var vars = {};
    if ($rootScope.MpageOptions.pp != "0") {
      vars.pp = $rootScope.MpageOptions.pp;
      vars.page = $rootScope.MpageOptions.currentPage;
    }
    ShostService.Fhost($rootScope.Mtoken).get(
      vars,
      function successCallback(callbackdata){
        $rootScope.MhostsData = callbackdata.data;
        $rootScope.MpageOptions.totalPage = callbackdata.totalpage;
        $rootScope.MhostsNum = $rootScope.MhostsData.length;
        for (var index in $rootScope.MhostsData) {
          $rootScope.MhostsData[index].select = false;
        };
        SinfoService.FaddInfo('已同步' + $rootScope.MhostsNum + '条主机信息');
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo('获取主机信息失败:' + callbackdata.message);
      }
    );
  };
  $rootScope.FprevPage = function(){
    if ($rootScope.MpageOptions.currentPage > 1) {
      $rootScope.MpageOptions.currentPage --;
    };
  };
  $rootScope.FnextPage = function(){
    if ($rootScope.MpageOptions.currentPage < $rootScope.MpageOptions.totalPage) {
      $rootScope.MpageOptions.currentPage ++;
    };
  };
  $rootScope.FgoPage = function(event, page){
    if (event.keyCode == 13){
      $rootScope.MpageOptions.currentPage = parseInt(page);
    };
  };
  $rootScope.FgoPage($rootScope.MpageOptions.currentPage);
  $rootScope.FchangeSelect = function(node){
    node.select = !node.select;
    if (node.select == true) {
      $rootScope.MhostsSelected.push(node);
    }
    else {
      $rootScope.MhostsSelected.splice($rootScope.MhostsSelected.indexOf(node), 1);
    };
  };
  $rootScope.McheckAll = {
    'status': false
  };
  $rootScope.FcheckAll = function(checkAll){
    // {"select":false, "available": "0", "groups": [{"groupid": "4", "name": "Zabbix servers"}], "host": "Zabbix server", "hostid": "10084", "interfaces": [{"interfaceid": "1", "ip": "127.0.0.1"}], "status": "1"},
    var bool = checkAll.status;
    var oldArray = $rootScope.MhostsSelected;
    var newArray = $rootScope.MhostsDataFilter;
    var hash = {};
    for (var index in oldArray) {
      hash[oldArray[index].interfaces[0].ip] = true;
    };
    for (var index in newArray) {
      $rootScope.MhostsDataFilter[index].select = bool;
      if (hash[newArray[index].interfaces[0].ip]) {
        if (bool == false) {
          hash[newArray[index].interfaces[0].ip] = undefined;
          oldArray.splice(oldArray.indexOf(newArray[index]), 1);
        }
      }
      else {
        if (bool == true) {
          hash[newArray[index].interfaces[0].ip] = true;
          oldArray.push(newArray[index]);
        }
      };
    }
    $rootScope.MhostsSelected = oldArray;
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
    var Vrftoken = $cookies.get('rftoken');
    if (!Vrftoken){
      // rftoken已过期或者未保持登录，不刷新，只尝试token自动登录
      $rootScope.MsignError = false;
      $rootScope.MisSign = false;
      $rootScope.FtokenSignIn();
    }
    else {
      // rftoken未过期，尝试刷新并自动登录
      $rootScope.FtokenRefresh();
    }
  };
  // 初始化自动登录
  $rootScope.FcookieAuth();

  // 监控区
  $rootScope.$watchGroup(['MpageOptions.currentPage','MpageOptions.pp'], function(newValue, oldValue){
    if ($rootScope.Mtoken) {
      $rootScope.FgetHost();
    };
  });
  $rootScope.$watch('MisSign', function(newValue, oldValue){
    $rootScope.MshowSign = !$rootScope.MisSign;
  });
  $rootScope.$watch('Mfilters', function(newValue, oldValue){
    $rootScope.MhostsDataFilter = $filter('hostFilter')($rootScope.MhostsData, $rootScope.Mfilters);
  }, true);
  $rootScope.$watchCollection('MhostsData', function(newValue, oldValue){
    $rootScope.MhostsDataFilter = $filter('hostFilter')($rootScope.MhostsData, $rootScope.Mfilters);
  });
  $rootScope.$watchCollection('MhostsDataFilter', function(newValue, oldValue){
    $rootScope.McheckAll.status = false;
  });
});
