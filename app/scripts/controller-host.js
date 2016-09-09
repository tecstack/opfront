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

// ------------------------------Host----------------------------
promise.controller('Chost', function($scope, $rootScope, $filter){
  // 表头
  $scope.MhostsDatasTh = ['ID','IP','主机名','组'];
  // 展示内容
  $scope.MhostsDatasTd = [];
  // $rootScope.MhostsSelected = [];

  // 整理数据，从原始数据中整理出展示用数据
  $scope.FhostsDatasInit = function(){
    $scope.MhostsDatasTd = [];
    for (var index in $rootScope.Mhosts) {
      var tempNode = [];
      tempNode.push($rootScope.Mhosts[index].hostid);
      tempNode.push($rootScope.Mhosts[index].interfaces[0].ip);
      tempNode.push($rootScope.Mhosts[index].host);
      var groups = $filter('groupsFilter')($rootScope.Mhosts[index].groups);
      tempNode.push(groups);
      $scope.MhostsDatasTd.push(tempNode);
    }
  };

  // 选中后的执行函数
  $scope.FshowHostsHelper = function(node){
    // ['0','10.1.1.1','Fortress','MGMT']
    var id = node[0];
    for (var index in $rootScope.Mhosts) {
      if ($rootScope.Mhosts.hasOwnProperty(index)) {
        if (id === $rootScope.Mhosts[index].hostid) {
          $rootScope.MhostsDataHelper = $rootScope.Mhosts[index];
          $rootScope.MshowHelper = true;
          break;
        }
      }
    }
  };
  // 取消选择后的执行函数
  $scope.FhideHostsHelper = function(node){
    $rootScope.MshowHelper = false;
  };

  $scope.$watchCollection('Mhosts', function(newValue, oldValue){
    $scope.FhostsDatasInit();
  });
});

// host helper
promise.controller('ChostHelper', function($scope, $rootScope){

});
