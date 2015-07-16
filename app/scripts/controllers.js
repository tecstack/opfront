'use strict';

/**
 * @ngdoc function
 * @name helloworldApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the helloworldApp
 */
var helloworldApp = angular.module('helloworldApp')

//Main 首页控制器
helloworldApp.controller('mainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

//ui 展示页控制器
helloworldApp.controller('uiCtrl', function ($scope) {

  });

//ui-right 展示帮助页控制器
helloworldApp.controller('uirightCtrl', function ($scope,$rootScope) {
    $rootScope.showHelper = true;
  });

//About 介绍页控制器
helloworldApp.controller('aboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

//Lab angularjs实验区控制器
helloworldApp.controller('nglabCtrl', function ($scope,$rootScope,vmInfos) {

    $scope.vm_infos =[
      {
        vm_name:'CIDC-VM-TEST-001',
        vm_id:'CIDC-VM-ID-001', 
        ip:'10.11.191.10', 
        vm_status:'2',
        vn_id:'CIDC-VN-ID-001',
        pm_id:'CIDC-PM-ID-001',
        creater_time:'2011-02-14 19:22:32'
      },
      {
        vm_name:'CIDC-VM-TEST-002',
        vm_id:'CIDC-VM-ID-002', 
        ip:'10.11.191.12', 
        vm_status:'2',
        vn_id:'CIDC-VN-ID-002',
        pm_id:'CIDC-PM-ID-002',
        creater_time:'2011-02-14 19:22:32'
      },
      {
        vm_name:'CIDC-VM-TEST-003',
        vm_id:'CIDC-VM-ID-003', 
        ip:'10.11.191.13', 
        vm_status:'2',
        vn_id:'CIDC-VN-ID-003',
        pm_id:'CIDC-PM-ID-003',
        creater_time:'2011-02-14 19:22:32'
      },
      {
        vm_name:'CIDC-VM-TEST-004',
        vm_id:'CIDC-VM-ID-004', 
        ip:'10.11.191.14', 
        vm_status:'2',
        vn_id:'CIDC-VN-ID-004',
        pm_id:'CIDC-PM-ID-004',
        creater_time:'2011-02-14 19:22:32'
      }
    ];
    $scope.showEdit = true;
    $scope.vm_infos_bak = {};
    $scope.showHelp = function(){
        $rootScope.showHelper = true;
    };


    // $scope.queryVmInfos = function(){
    //   $scope.vm_infos = vmInfos.query().vm_infos;
    // };

    // $scope.queryVmInfos();
  	$scope.person = {
        firstName: "John",
        lastName: "Doe"
  	};

    $scope.names = [
        {name:'Jani',country:'Norway'},
        {name:'Hege',country:'Sweden'},
        {name:'Kai',country:'Denmark'}
    ];

    $scope.myVar = false;
    $scope.toggle = function() {
        $scope.myVar = !$scope.myVar;
    };

    $scope.master = {firstName: "John", lastName: "Doe"};
    $scope.reset = function() {
        $scope.user = angular.copy($scope.master);
    };
    $scope.reset();

  });

//Blog 博客区控制器
helloworldApp.controller('blogCtrl', function ($scope) {

    $scope.blogs = [
        {author:'小明',date:'2015-5-1 21:22:15',content:'今天是个好日子呀，我只是看到了老师的妹妹经过，为什么老师还是要我出去？讲实话有错吗？'},
        {author:'小红',date:'2015-6-23 22:05:15',content:'今天天气不错，路过了姐姐的办公室，看到了那个传说中的小明，对我笑了笑，然后不出意外地被姐姐吼出教室罚站了。'},
        {author:'小米老师',date:'2014-5-23 02:10:15',content:'今天本来心情很好，结果看到小明东张西望，问他看什么，竟然说“你妹”，这小子就是欠抽'}
    ]


  });

//云主机检视区控制器
helloworldApp.controller('dockerCtrl', function ($scope,$rootScope,vmInfos,vmHelpInfo) {
    $rootScope.vm_infos_help = {};

    $scope.showEdit = true;
    $scope.showAdd = false;

    $scope.vm_infos =[];
    $scope.vm_infos_bak = {};
    $scope.pp = 20;
    $scope.total_page = 1;
    $scope.vm_infos_add = {
        vm_name:'',
        vm_id:'', 
        ip:'', 
        vm_status:'',
        vn_id:'',
        pm_id:'',
        creater_time:''
    };

    $scope.queryVmInfos = function(){
      vmInfos.get(function(callbackdata){
        $scope.vm_infos = callbackdata.vm_infos;
      });
    };

    $scope.searchId = function(event){
      if (event.keyCode !== 13) return;
      var vmid = $scope.vm_id;
      vmInfos.get({vmid:vmid},function(callbackdata){
        $scope.vm_infos = callbackdata.vm_infos;
      });
    }

    $scope.loadPage = function(current_page){
      $scope.vm_infos =[];
      $scope.pages = [];
      vmInfos.get({page:current_page,pp:$scope.pp},function(callbackdata){
        $scope.vm_infos = callbackdata.vm_infos;
        $scope.total_page = callbackdata.total_page;
        var startpage = 1;
        var endpage = $scope.total_page;
        if ($scope.total_page > 1 && $scope.total_page <=7) {
            startpage = 1;
            endpage = $scope.total_page;
        } else if ($scope.total_page > 7) {
            if (current_page > 3 && (current_page + 3) <= $scope.total_page) {
              startpage = current_page - 3;
              endpage = current_page + 3;
            } else if (current_page <= 3) {
              startpage = 1;
              endpage = 7;
            } else if ((current_page + 3) > $scope.total_page) {
              startpage = $scope.total_page - 6;
              endpage = $scope.total_page;
            };
        };
        for (var i = startpage; i <= endpage; i++) {
          $scope.pages.push(i);
        }; 
      });

    }

    $scope.refreshPP = function(){
      $scope.loadPage(1);
    }

    $scope.switchPage = function(page){
      $scope.loadPage(page);
    }

    $scope.firstPage = function(){
      $scope.loadPage(1);
    }

    $scope.lastPage = function(){
      $scope.loadPage($scope.total_page);
    }

    $scope.addVm = function(vminfo){
      vmInfos.save({},vminfo,function(callbackdata){
        console.log(callbackdata.vm_infos);
      });      
    };

    $scope.updateVm = function(vminfo){
      vmInfos.update({vmid:vminfo.vm_id},vminfo,function(callbackdata){
        console.log(callbackdata.vm_infos);
      });
    };

    $scope.deleteById = function(id){
      vmInfos.delete({vmid:id},function(callbackdata){
        console.log(callbackdata.vm_infos);
      });
    };

    $scope.showHelp = function(vminfo){
        vmHelpInfo.get({vmid:vminfo.vm_id},function(callbackdata){
          $rootScope.vm_infos_help = callbackdata.help_info;
        });
        $rootScope.showHelper = true;
    };

    $scope.firstPage();

  });

//docker-right 检视关联区控制器
helloworldApp.controller('dockerrightCtrl', function ($scope,$rootScope) {
    $rootScope.showHelper = false;
    $scope.close = function(){
      $rootScope.showHelper = false;
    };
  });
