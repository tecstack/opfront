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

promise.controller('Csetting', function($scope, $rootScope, SinfoService, SuserService){
  // service
  $scope.FgetUserList = function(){
    SuserService.FgetUserList($rootScope.Mtoken).get(
      {},
      function successCallback(callbackdata){
        $scope.MuserInfos = callbackdata.user_list;
        SinfoService.FaddInfo('已同步' + $scope.MuserInfos.length + '条用户信息');
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
      }
    );
  };
  $scope.FcreateUser = function(VuserInfo){
    SuserService.FcreateUser($rootScope.Mtoken).post(
      {},
      VuserInfo,
      function successCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.message);
        $scope.MshowUserForm = false;
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
      }
    );
  };
  $scope.FgetRoleList = function(){
    SuserService.FgetRoleList($rootScope.Mtoken).get(
      {},
      function successCallback(callbackdata){
        $scope.MroleInfos = callbackdata.role_list;
        SinfoService.FaddInfo('当前有' + $scope.MroleInfos.length + '种角色可用');
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
      }
    );
  };

  // binding
  $scope.FshowUserForm = function(){
    $scope.McreateUserInfo = {
      'role_name_list': []
    };
    $scope.MshowUserForm = true;
    $scope.FgetRoleList();
  };
  $scope.FselectRole = function(Vrole){
    var name = Vrole.role_name;
    for (var index in $scope.McreateUserInfo.role_name_list) {
      if ($scope.McreateUserInfo.role_name_list.hasOwnProperty(index)) {
        if (name === $scope.McreateUserInfo.role_name_list[index]) {
          $scope.McreateUserInfo.role_name_list.splice(index, 1);
          return true;
        }
      }
    }
    $scope.McreateUserInfo.role_name_list.push(name);
  };

  // show & watch

  // on
  // $scope.FgetUserList();
});
