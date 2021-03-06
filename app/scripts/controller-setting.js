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
    SinfoService.FstartLoading();
    SuserService.FgetUserList($rootScope.Mtoken).get(
      {},
      function successCallback(callbackdata){
        $scope.MuserInfos = callbackdata.user_list;
        SinfoService.FaddInfo('已同步' + $scope.MuserInfos.length + '条用户信息');
        SinfoService.FstopLoading();
        SdelayService.Fdelay();
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
        SinfoService.FstopLoading();
      }
    );
  };
  $scope.FcreateUser = function(VuserInfo){
    SinfoService.FstartLoading();
    SuserService.FcreateUser($rootScope.Mtoken).post(
      {},
      VuserInfo,
      function successCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.message);
        $scope.MshowMask.user = false;
        $scope.FgetUserList();
        SdelayService.Fdelay();
        SinfoService.FstopLoading();
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
        SinfoService.FstopLoading();
      }
    );
  };
  $scope.FmodifyUser = function(VuserInfo){
    SinfoService.FstartLoading();
    SuserService.FmodifyUser($rootScope.Mtoken).put(
      {
        'user_id': VuserInfo.user_id,
      },
      VuserInfo,
      function successCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.message);
        $scope.MshowMask.user = false;
        $scope.FgetUserList();
        SdelayService.Fdelay();
        SinfoService.FstopLoading();
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
        SinfoService.FstopLoading();
      }
    );
  };
  $scope.FdeleteUser = function(VuserInfo){
    SinfoService.FstartLoading();
    SuserService.FdeleteUser($rootScope.Mtoken).delete(
      {'user_id': VuserInfo.user_id},
      function successCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.message);
        $scope.FgetUserList();
        SdelayService.Fdelay();
        SinfoService.FstopLoading();
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
        SinfoService.FstopLoading();
      }
    );
  };

  $scope.FgetRoleList = function(){
    SinfoService.FstartLoading();
    SuserService.FgetRoleList($rootScope.Mtoken).get(
      {},
      function successCallback(callbackdata){
        $scope.MroleInfos = callbackdata.role_list;
        SinfoService.FaddInfo('已同步' + $scope.MroleInfos.length + '条角色信息');
        $scope.Finit();
        SdelayService.Fdelay();
        SinfoService.FstopLoading();
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
        SinfoService.FstopLoading();
      }
    );
  };
  $scope.FcreateRole = function(VroleInfo){
    SinfoService.FstartLoading();
    SuserService.FcreateRole($rootScope.Mtoken).post(
      {},
      VroleInfo,
      function successCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.message);
        $scope.MshowMask.role = false;
        $scope.FgetRoleList();
        SdelayService.Fdelay();
        SinfoService.FstopLoading();
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
        SinfoService.FstopLoading();
      }
    );
  };
  $scope.FmodifyRole = function(VroleInfo){
    SinfoService.FstartLoading();
    SuserService.FmodifyRole($rootScope.Mtoken).put(
      {
        'role_id': VroleInfo.role_id,
      },
      VroleInfo,
      function successCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.message);
        $scope.MshowMask.role = false;
        $scope.FgetRoleList();
        SdelayService.Fdelay();
        SinfoService.FstopLoading();
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
        SinfoService.FstopLoading();
      }
    );
  };
  $scope.FdeleteRole = function(VroleInfo){
    SinfoService.FstartLoading();
    SuserService.FdeleteRole($rootScope.Mtoken).delete(
      {'role_id': VroleInfo.role_id},
      function successCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.message);
        $scope.FgetRoleList();
        SdelayService.Fdelay();
        SinfoService.FstopLoading();
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
        SinfoService.FstopLoading();
      }
    );
  };

  $scope.FgetPrivilegeList = function(){
    SinfoService.FstartLoading();
    SuserService.FgetPrivilegeList($rootScope.Mtoken).get(
      {},
      function successCallback(callbackdata){
        $scope.MprivilegeInfos = callbackdata.privilege_list;
        SinfoService.FaddInfo('已同步' + $scope.MprivilegeInfos.length + '条权限信息');
        $scope.Finit();
        SdelayService.Fdelay();
        SinfoService.FstopLoading();
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo(callbackdata.data.message);
        SinfoService.FstopLoading();
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
    for (index in $scope.MroleInfos) {
      if ($scope.MroleInfos.hasOwnProperty(index)) {
        $scope.MroleSelected[$scope.MroleInfos[index].role_id] = false;
      }
    }
    for (index in $scope.MprivilegeInfos) {
      if ($scope.MprivilegeInfos.hasOwnProperty(index)) {
        $scope.MprivilegeSelected[$scope.MprivilegeInfos[index].privilege_id] = false;
      }
    }
  };
  $scope.FshowUserCreateMask = function(){
    $scope.MuserInfo = {
      'role_id_list': [],
    };
    $scope.Finit();
    $scope.Fshow($scope.MshowMask, 'user');
    $scope.MshowButtonCreate = true;
  };
  $scope.FshowUserModifyMask = function(VuserInfo){
    $scope.MuserInfo = VuserInfo;
    $scope.MuserInfo.role_id_list = [];
    $scope.Finit();
    for (var index in VuserInfo.role) {
      if (VuserInfo.role.hasOwnProperty(index)) {
        var Vrole_name = VuserInfo.role[index].name;
        for (var indexs in $scope.MroleInfos) {
          if ($scope.MroleInfos.hasOwnProperty(indexs)) {
            if (Vrole_name === $scope.MroleInfos[indexs].role_name) {
              $scope.MroleSelected[$scope.MroleInfos[indexs].role_id] = true;
            }
          }
        }
      }
    }
    $scope.Fshow($scope.MshowMask, 'user');
    $scope.MshowButtonCreate = false;
  };
  $scope.FshowRoleCreateMask = function(){
    $scope.MroleInfo = {
      'privilege_id_list': [],
      'user_id_list': [],
    };
    $scope.Finit();
    $scope.Fshow($scope.MshowMask, 'role');
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
    $scope.MroleInfo.user_id_list = userArray;
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
    $scope.MuserInfo.role_id_list = roleArray;
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
    $scope.MroleInfo.privilege_id_list = privilegeArray;
  };
  // show & watch
  $scope.MshowMask = {
    'user': false,
    'role': false,
  };
  $scope.MshowRightCol = {
    'user': true,
    'role': false,
    'privilege': false,
  };
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
