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

promise.controller('Csetting', function($scope, $rootScope, SinfoService, SuserService, SdelayService){
  // service
  $scope.FgetUserList = function(){
    SuserService.FgetUserList($rootScope.Mtoken).get(
      {},
      function successCallback(callbackdata){
        $scope.MuserInfos = callbackdata.user_list;
        SinfoService.FaddInfo('已同步' + $scope.MuserInfos.length + '条用户信息');
        SdelayService.Fdelay();
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
        $scope.MshowMask.createUser = false;
        $scope.FgetUserList();
        SdelayService.Fdelay();
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
      }
    );
  };
  $scope.FdeleteUser = function(VuserInfo){
    SuserService.FdeleteUser($rootScope.Mtoken).delete(
      {'user_id': VuserInfo.user_id},
      function successCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.message);
        $scope.FgetUserList();
        SdelayService.Fdelay();
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
        SinfoService.FaddInfo('已同步' + $scope.MroleInfos.length + '条角色信息');
        $scope.Finit();
        SdelayService.Fdelay();
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
      }
    );
  };
  $scope.FcreateRole = function(VroleInfo){
    SuserService.FcreateRole($rootScope.Mtoken).post(
      {},
      VroleInfo,
      function successCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.message);
        $scope.MshowMask.createRole = false;
        $scope.FgetRoleList();
        SdelayService.Fdelay();
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
      }
    );
  };
  $scope.FdeleteRole = function(VroleInfo){
    SuserService.FdeleteRole($rootScope.Mtoken).delete(
      {'role_id': VroleInfo.role_id},
      function successCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.message);
        $scope.FgetRoleList();
        SdelayService.Fdelay();
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
      }
    );
  };

  $scope.FgetPrivilegeList = function(){
    SuserService.FgetPrivilegeList($rootScope.Mtoken).get(
      {},
      function successCallback(callbackdata){
        $scope.MprivilegeInfos = callbackdata.privilege_list;
        SinfoService.FaddInfo('已同步' + $scope.MprivilegeInfos.length + '条权限信息');
        $scope.Finit();
        SdelayService.Fdelay();
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
      }
    );
  };
  $scope.FdeletePrivilege = function(){};

  // binding
  $scope.Finit = function(){
    for (var index in $scope.MuserInfos) {
      if ($scope.MuserInfos.hasOwnProperty(index)) {
        $scope.MuserSelected[$scope.MuserInfos[index].user_id] = false;
      }
    }
    for (var index in $scope.MroleInfos) {
      if ($scope.MroleInfos.hasOwnProperty(index)) {
        $scope.MroleSelected[$scope.MroleInfos[index].role_id] = false;
      }
    }
    for (var index in $scope.MprivilegeInfos) {
      if ($scope.MprivilegeInfos.hasOwnProperty(index)) {
        $scope.MprivilegeSelected[$scope.MprivilegeInfos[index].privilege_id] = false;
      }
    }
  };
  $scope.FshowUserCreateMask = function(){
    $scope.McreateUserInfo = {
      'role_id_list': [],
    };
    $scope.Finit();
    $scope.Fshow($scope.MshowMask, 'createUser');
  };
  $scope.FshowRoleCreateMask = function(){
    $scope.McreateRoleInfo = {
      'privilege_id_list': [],
      'user_id_list': [],
    };
    $scope.Finit();
    $scope.Fshow($scope.MshowMask, 'createRole');
  };

  $scope.MuserSelected = {};
  $scope.MroleSelected = {};
  $scope.MprivilegeSelected = {};
  $scope.FselectUser = function(Vuser){
    var id = Vuser.user_id;
    $scope.MuserSelected[id] = !$scope.MuserSelected[id];
    var userArray = [];
    for (var node in $scope.MuserSelected) {
      if ($scope.MuserSelected.hasOwnProperty(node)) {
        if ($scope.MuserSelected[node] === true) {
          userArray.push(node);
        }
      }
    }
    $scope.McreateRoleInfo.user_id_list = userArray;
  };
  $scope.FselectRole = function(Vrole){
    var id = Vrole.role_id;
    $scope.MroleSelected[id] = !$scope.MroleSelected[id];
    var roleArray = [];
    for (var node in $scope.MroleSelected) {
      if ($scope.MroleSelected.hasOwnProperty(node)) {
        if ($scope.MroleSelected[node] === true) {
          roleArray.push(node);
        }
      }
    }
    $scope.McreateUserInfo.role_id_list = roleArray;
  };
  $scope.FselectPrivilege = function(Vprivilege){
    var id = Vprivilege.privilege_id;
    $scope.MprivilegeSelected[id] = !$scope.MprivilegeSelected[id];
    var privilegeArray = [];
    for (var node in $scope.MprivilegeSelected) {
      if ($scope.MprivilegeSelected.hasOwnProperty(node)) {
        if ($scope.MprivilegeSelected[node] === true) {
          privilegeArray.push(node);
        }
      }
    }
    $scope.McreateRoleInfo.privilege_id_list = privilegeArray;
  };
  // show & watch
  $scope.MshowMask = {
    'createUser': false,
    'createRole': false,
  };
  $scope.MshowRightCol = {
    'user': true,
    'role': false,
    'privilege': false,
  }
  $scope.Fshow = function(Vdict, Vkey){
    for (var node in Vdict) {
      if (Vdict.hasOwnProperty(node)) {
        Vdict[node] = false;
      }
    }
    Vdict[Vkey] = true;
  };
  $scope.$watch('Mtoken', function(){
    if ($rootScope.Mtoken) {
      $scope.FgetUserList();
      $scope.FgetRoleList();
      $scope.FgetPrivilegeList();
    }
  });
  // on
  // $scope.FgetUserList();
});
