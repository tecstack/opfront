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
promise.controller('Chost', function($scope, $rootScope, ShostService){
  $scope.FshowPmHelper = function(pm){
    // ['0','10.1.1.1','Fortress','MGMT']
    $rootScope.MpmNode = pm;
    $rootScope.MshowHelper = true;
  };
});

// host helper
promise.controller('ChostHelper', function($scope, $rootScope){

});
