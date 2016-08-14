'use strict';

/**
 * @ngdoc function
 * @name promise.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the promise
 */

var promise = angular.module('promise');

// navbar
promise.controller('Cnavbar', function($scope, $rootScope){
  $rootScope.MshowHelper = false;
  $scope.FtoggleMenu = function(){
    $rootScope.MshowMenu = !$rootScope.MshowMenu
  };
});

// helper trigger
promise.controller('ChelperTrigger', function($scope,$rootScope){
  $scope.FtoggleHelper = function(){
    $rootScope.MshowHelper = !$rootScope.MshowHelper;
  };
});

// sign
promise.controller('Csign', function($scope,$rootScope,$cookies,SuserService){
  // 初始化
  $scope.MisKeep = false;
  // 切换保持登录
  $scope.FtoggleIsKeep = function(){
    $scope.MisKeep = !$scope.MisKeep;
  };
  // 手动登录
  $scope.FsignIn = SuserService.FsignIn;
  // 回车判定登陆
  $scope.FsignInEnter = function(event, VuserInfo, VisKeep){
    if (event.keyCode == 13){
      $scope.FsignIn(VuserInfo, VisKeep);
    };
  };
  // 手动登出
  $rootScope.FsignOut = SuserService.FsignOut;
});
