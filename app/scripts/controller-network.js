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

// index
promise.controller('Cnetwork', function($scope,$rootScope,$filter){
  // 表头
  $scope.MhostsDatasTh = ['ID','IP','主机名','组'];
  // 展示内容
  $scope.MhostsDatasTd = [];
  // $rootScope.MhostsSelected = [];

  // 整理数据，从原始数据中整理出展示用数据
  // $scope.FhostsDatasInit = function(){
  //   $scope.MhostsDatasTd = [];
  //   for (var index in $rootScope.Mhosts) {
  //     var tempNode = [];
  //     tempNode.push($rootScope.Mhosts[index].id);
  //     if ($rootScope.Mhosts[index].ip.length > 0) {
  //       tempNode.push($rootScope.Mhosts[index].ip[0].ip_addr);
  //     } else {
  //       tempNode.push('Null');
  //     }
  //     tempNode.push($rootScope.Mhosts[index].name);
  //     var groups = $filter('groupsFilter')($rootScope.Mhosts[index].group);
  //     tempNode.push(groups);
  //     $scope.MhostsDatasTd.push(tempNode);
  //   }
  // };
  //
  // $scope.$watchCollection('Mhosts', function(newValue, oldValue){
  //   $scope.FhostsDatasInit();
  // });
});
