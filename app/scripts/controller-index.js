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
promise.controller('Cindex', function($scope,$rootScope){
  $scope.$watchGroup(['MhostsNum','MscriptsNum'],function(){
    $scope.MdataBar = [
      {
        value: $rootScope.MhostsNum,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "主机数量"
      },
      {
        value: $rootScope.MscriptsNum,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "脚本数量"
      }
    ];
  });
});
