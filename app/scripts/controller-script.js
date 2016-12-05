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
promise.controller('Cscript', function($scope, $rootScope, $timeout, SscriptService, SdelayService, SinfoService){
  // 初始化
  $scope.MlangOptions = [
    {'label': '选择语言', 'value': ''},
    {'label': 'Python', 'value': 'python'},
    {'label': 'Shell', 'value': 'shell'}
  ];
  $scope.MtypeOptions = [
    {'label': '脚本类型', 'value': ''},
    {'label': 'Ansible', 'value': 1},
    {'label': 'Forward', 'value': 2}
  ];
  $scope.MisPublicOptions = [
    {'label': '是否公开', 'value': ''},
    {'label': '仅自己', 'value': 0},
    {'label': '所有人', 'value': 1}
  ];
  $scope.MscriptTh = ['名称','语言','类型','公开','创建人','最后更新时间','操作'];
  $scope.MeditorOptions = {
    lineNumbers: true,
    theme:'dracula',
    // readOnly: 'nocursor',
    lineWrapping : false,
    mode: 'python',
  };
  $scope.MpythonTemplate = '#!/usr/bin/env python\r#coding:utf-8\r\r#--------------------------------\r# Name:\r# Purpose:\r# Author:\r# Created:\r#--------------------------------\r\r# Module Import\r\r# Define\r\r# Main\rif __name__ == "__main__":\r    print 1';
  $scope.MforwardTemplate = '#!/usr/bin/env python\r#coding:utf-8\r\r#--------------------------------\r# Name:\r# Purpose:\r# Author:\r# Created:\r#--------------------------------\r\r# forard node input\r#--------------------------------\r# nodeInput = {\r#     \'instance\':{\r#         \'172.17.0.2\' : classInstanceA,\r#         \'192.168.100.100\' : classInstanceB\r#     },\r#     \'parameters\': <Which you define in your privateConf>\r# }\r#--------------------------------\r\r# Module Import\r\r# Define\r\r# Node Main\rdef node(nodeInput):\r    # init njInfo\r    njInfo = {\r        \'status\':True,\r        \'errLog\':\'\',\r        \'content\':{}\r    }\r    # Your code\r    \r    return njInfo';

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
    SinfoService.FstartLoading();
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
        SinfoService.FstopLoading();
      },
      function errorCallback(callbackdata){
        $scope.MscriptInfo.create = callbackdata.data.message;
        SinfoService.FstopLoading();
      }
    );
  };
  $scope.FupdateScript = function(Vscript){
    SinfoService.FstartLoading();
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
        SinfoService.FstopLoading();
      },
      function errorCallback(callbackdata){
        $scope.MscriptInfo.create = callbackdata.data.message;
        SinfoService.FstopLoading();
      }
    );
  };
  $scope.FdeleteScript = function(Vscript){
    var VscriptId = Vscript.script_id;
    SinfoService.FstartLoading();
    SscriptService.Fdelete($rootScope.Mtoken, VscriptId).delete(
      {},
      function successCallback(callbackdata){
        $scope.MscriptInfo.getList = callbackdata.message;
        $timeout(function () {
          $scope.Mshow.list = true;
          $rootScope.FgetScriptList();
        }, 500);
        SdelayService.Fdelay();
        SinfoService.FstopLoading();
      },
      function errorCallback(callbackdata){
        $scope.MscriptInfo.getList = callbackdata.data.message;
        SinfoService.FstopLoading();
      }
    );
  };

  // bind
  $scope.FtemplatePython = function(){
    $scope.Mscript.script_text = $scope.MpythonTemplate;
    $scope.Mscript.script_lang = 'python';
    $scope.Mscript.script_type = 1;
  };
  $scope.FtemplateForward = function(){
    $scope.Mscript.script_text = $scope.MforwardTemplate;
    $scope.Mscript.script_lang = 'python';
    $scope.Mscript.script_type = 2;
  };
  $scope.FnewAction = function(){
    $scope.MeditorOptions.mode = '';
    $scope.Mscript = {'script_lang': $scope.MeditorOptions.mode, 'script_type': '', 'is_public': ''};
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
      'script_type': Vscript.script_type,
      'is_public': Vscript.is_public
    };
  };
  $scope.FcloneAction = function(Vscript){
    $scope.Mshow.list = false;
    $scope.Mshow.editor = true;
    $scope.Mshow.create = true;
    $scope.Mshow.update = false;
    $scope.Mscript = {
      'script_name': '',
      'script_text': Vscript.script_text,
      'script_lang': Vscript.script_lang,
      'script_type': Vscript.script_type,
      'is_public': ''
    };
  };
  $scope.FbackAction = function(){
    $scope.Mshow.list = true;
    $scope.Mshow.editor = false;
  };

  // 监控区
  $scope.Mshow = {
    'list': true,
    'editor': false,
    'create': false,
    'update': false
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
