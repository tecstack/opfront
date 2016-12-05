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

promise.controller('Cuser', function($scope, $rootScope, SinfoService){
  $scope.Finfo = function(){
    SinfoService.FaddInfo('其实自己是不能删除自己的...');
  };
});
