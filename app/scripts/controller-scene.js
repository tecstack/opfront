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

// ------------------------------Script----------------------------
promise.controller('Cscene', function($scope, $rootScope, $timeout, $filter, SdelayService, SinfoService){
  // 表头
  $scope.MscenesDatasTh = ['名称','类型','脚本','目标','默认参数','执行次数'];
  // 展示内容
  $scope.MscenesDatasTd = [];
  // $rootScope.MscenesSelected = [];

  // 整理数据，从原始数据中整理出展示用数据
  $scope.FscenesDatasInit = function(){
    $scope.MscenesDatasTd = $filter('scenesInitFilter')($rootScope.Mscenes);
  };

  // 新建场景函数
  $scope.FcreateScene = function(){

  };

  // 克隆场景函数
  $scope.FcloneScene = function(node){

  };

  // 修改
  $scope.FmodifyScene = function(node){

  };

  // 删除
  $scope.FdeleteScene = function(node){

  };

  // 选中后的执行函数
  $scope.FshowscenesHelper = function(node){
    // ['0','10.1.1.1','Fortress','MGMT']
  };
  // 取消选择后的执行函数
  $scope.FhidescenesHelper = function(node){
    $rootScope.MshowHelper = false;
  };

  $scope.$watchCollection('Mscenes', function(newValue, oldValue){
    $scope.FscenesDatasInit();
  });

});

promise.controller('CsceneHelper', function($rootScope){

});
