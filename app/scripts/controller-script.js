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
promise.controller('Cscript', function($scope, $rootScope, $timeout, SscriptService, SdelayService){
  // 初始化
  $scope.MlangOptions = [
    {'label': '选择语言', 'value': ''},
    {'label': 'Python', 'value': 'python'},
    {'label': 'Shell', 'value': 'shell'}
  ];
  $scope.MisPublicOptions = [
    {'label': '是否公开', 'value': ''},
    {'label': '仅自己', 'value': 0},
    {'label': '所有人', 'value': 1}
  ];
  $scope.MscriptTh = ['名称','语言','公开','创建人','最后更新时间','操作'];
  $scope.MeditorOptions = {
    lineNumbers: true,
    theme:'dracula',
    // readOnly: 'nocursor',
    lineWrapping : false,
    mode: 'python',
  };

  // 接口服务
  $scope.Mscript = {
    'script_name': '',
    'script_text': '',
    'script_lang': '',
    'is_public': 0
  };
  $scope.MscriptInfo = {
    'create': '',
    'update': '',
    'delete': '',
    'getList': ''
  };
  $scope.MscriptId = '';

  $scope.FcreateScript = function(Vscript){
    SscriptService.Fcreate($rootScope.Mtoken).post(
      {},
      Vscript,
      function successCallback(callbackdata){
        $scope.MscriptInfo.create = callbackdata.message;
        $timeout(function () {
          $scope.Mshow.list = true;
          $scope.Mshow.editor = false;
          $rootScope.FgetScriptList();
        }, 500);
        SdelayService.Fdelay();
      },
      function errorCallback(callbackdata){
        $scope.MscriptInfo.create = callbackdata.data.message;
      }
    );
  };
  $scope.FupdateScript = function(Vscript){
    SscriptService.Fmodify($rootScope.Mtoken, $scope.MscriptId).put(
      {},
      Vscript,
      function successCallback(callbackdata){
        $scope.MscriptInfo.create = callbackdata.message;
        $timeout(function () {
          $scope.Mshow.list = true;
          $scope.Mshow.editor = false;
          $rootScope.FgetScriptList();
        }, 500);
        SdelayService.Fdelay();
      },
      function errorCallback(callbackdata){
        $scope.MscriptInfo.create = callbackdata.data.message;
      }
    );
  };
  $scope.FdeleteScript = function(Vscript){
    var VscriptId = Vscript.script_id;
    SscriptService.Fdelete($rootScope.Mtoken, VscriptId).delete(
      {},
      function successCallback(callbackdata){
        $scope.MscriptInfo.getList = callbackdata.message;
        $timeout(function () {
          $scope.Mshow.list = true;
          $rootScope.FgetScriptList();
        }, 500);
        SdelayService.Fdelay();
      },
      function errorCallback(callbackdata){
        $scope.MscriptInfo.getList = callbackdata.data.message;
      }
    );
  };


  // 监控区
  $scope.Mshow = {
    'list': true,
    'editor': false,
    'create': false,
    'update': false
  };
  $scope.FnewAction = function(){
    $scope.MeditorOptions.mode = '';
    $scope.Mscript = {'script_lang': $scope.MeditorOptions.mode, 'is_public': ''};
    $scope.Mshow.list = false;
    $scope.Mshow.editor = true;
    $scope.Mshow.create = true;
    $scope.Mshow.update = false;
  };
  $scope.FupdateAction = function(Vscript){
    $scope.MscriptId = Vscript.script_id;
    $scope.Mshow.list = false;
    $scope.Mshow.editor = true;
    $scope.Mshow.create = false;
    $scope.Mshow.update = true;
    $scope.Mscript = {
      'script_name': Vscript.script_name,
      'script_text': Vscript.script_text,
      'script_lang': Vscript.script_lang,
      'is_public': Vscript.is_public
    };
  };
  $scope.FbackAction = function(){
    $scope.Mshow.list = true;
    $scope.Mshow.editor = false;
  };
  $scope.$watch('MeditorOptions.mode', function(newValue, oldValue){
    $scope.Mscript.script_lang = $scope.MeditorOptions.mode;
  });
  $scope.$watch('Mscript.script_lang', function(newValue, oldValue){
    $scope.MeditorOptions.mode = $scope.Mscript.script_lang;
  });

});

promise.controller('CscriptHelper', function($rootScope){

});
