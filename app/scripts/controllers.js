'use strict';

/**
 * @ngdoc function
 * @name helloworldApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the helloworldApp
 */

var helloworldApp = angular.module('helloworldApp')

//Login 登录控制器
helloworldApp.controller('Csign', function ($scope,$rootScope,$window,$base64,SuserService){

    $rootScope.MshowSign = !true;

    $scope.FsignIn = function(Vusername, Vpassword){
      if (Vusername !== undefined && Vpassword !== undefined) {

          $rootScope.Mtoken = "Basic " + $base64.encode(Vusername+':'+Vpassword);

          SuserService.FsignIn($rootScope.Mtoken).get(
            // {},
            {username:Vusername},
            function successCallback(callbackdata) {
              // AuthenticationService.isLogged = true;
              // $window.sessionStorage.token = callbackdata.token;
              $rootScope.MshowSign = false;
            },
            function errorCallback(callbackdata) {
              console.log(callbackdata.status);
            }
          );
      };
    };

    $scope.FtoggleSignUp = function(){
      $scope.MshowSignUp = !$scope.MshowSignUp;
    }
});

//Main 首页控制器
helloworldApp.controller('Cmain', function ($scope) {
    // $scope.awesomeThings = [
    //   'HTML5 Boilerplate',
    //   'AngularJS',
    //   'Karma'
    // ];
});

//ui 展示页控制器
helloworldApp.controller('Cui', function ($scope) {
    var lineChart = $("#lineChart").get(0).getContext("2d");
    var lineData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };
    var myLineChart = new Chart(lineChart).Line(lineData);

    var radarChart = $("#radarChart").get(0).getContext("2d");
    var radarData = {
        labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 90, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 96, 27, 100]
            }
        ]
    };
    var myRadarChart = new Chart(radarChart).Radar(radarData);

    var barChart = $("#barChart").get(0).getContext("2d");
    var barData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };
    var myBarChart = new Chart(barChart).Bar(barData);

});

//ui-right 展示帮助页控制器
helloworldApp.controller('CuiRight', function ($scope,$rootScope) {
    $rootScope.MshowHelper = true;
});

//About 介绍页控制器
helloworldApp.controller('Cabout', function ($scope) {
    // $scope.awesomeThings = [
    //   'HTML5 Boilerplate',
    //   'AngularJS',
    //   'Karma'
    // ];
});

//Lab angularjs实验区控制器
helloworldApp.controller('CngLab', function ($scope,$rootScope,SvmInfos) {

    $scope.MvmInfos =[
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
    $scope.MshowEdit = true;
    $scope.FshowHelp = function(){
        $rootScope.MshowHelper = true;
    };

  	$scope.Mperson = {
        firstName: "John",
        lastName: "Doe"
  	};

    $scope.Mnames = [
        {name:'Jani',country:'Norway'},
        {name:'Hege',country:'Sweden'},
        {name:'Kai',country:'Denmark'}
    ];

    $scope.MmyVar = false;
    $scope.Ftoggle = function() {
        $scope.MmyVar = !$scope.MmyVar;
    };

    $scope.Mmaster = {firstName: "John", lastName: "Doe"};
    $scope.Freset = function() {
        $scope.Muser = angular.copy($scope.Mmaster);
    };
    $scope.Freset();

});

//Blog 博客区控制器
helloworldApp.controller('Cblog', function ($scope) {

    $scope.Mblogs = [
        {author:'小明',date:'2015-5-1 21:22:15',content:'今天是个好日子呀，我只是看到了老师的妹妹经过，为什么老师还是要我出去？讲实话有错吗？'},
        {author:'小红',date:'2015-6-23 22:05:15',content:'今天天气不错，路过了姐姐的办公室，看到了那个传说中的小明，对我笑了笑，然后不出意外地被姐姐吼出教室罚站了。'},
        {author:'小米老师',date:'2014-5-23 02:10:15',content:'今天本来心情很好，结果看到小明东张西望，问他看什么，竟然说“你妹”，这小子就是欠抽'}
    ]

});

//云主机检视区控制器
helloworldApp.controller('Cdocker', function ($scope,$rootScope,SvmInfos,SvmHelpInfo) {
    $rootScope.MvmHelpInfos = {};

    $scope.MshowEdit = true;
    $scope.MshowAdd = false;

    $scope.MvmInfos =[];
    $scope.Mpp = 20;
    $scope.MtotalPage = 1;
    $scope.MvmAddInfos = {
        vm_name:'',
        vm_id:'',
        ip:'',
        vm_status:'',
        vn_id:'',
        pm_id:'',
        creater_time:''
    };

    $scope.FqueryVmInfos = function(){
      SvmInfos.get(function(callbackdata){
        $scope.MvmInfos = callbackdata.vm_infos;
      });
    };

    $scope.FsearchId = function(event){
      if (event.keyCode !== 13) return;
      var VvmId = $scope.MvmId;
      SvmInfos.get({vmid:VvmId},function(callbackdata){
        var Vtemparray = new Array();
        Vtemparray.push(callbackdata.vm_info);
        $scope.MvmInfos = Vtemparray;
      });
    }

    $scope.FloadPage = function(VcurrentPage){
      $scope.MvmInfos = [];
      $scope.Mpages = [];
      SvmInfos.get({page:VcurrentPage,pp:$scope.Mpp},function(callbackdata){
        $scope.MvmInfos = callbackdata.vm_infos;
        $scope.MtotalPage = callbackdata.total_page;
        var VstartPage = 1;
        var VendPage = $scope.MtotalPage;
        if ($scope.MtotalPage > 1 && $scope.MtotalPage <=7) {
            VstartPage = 1;
            VendPage = $scope.MtotalPage;
        } else if ($scope.MtotalPage > 7) {
            if (VcurrentPage > 3 && (VcurrentPage + 3) <= $scope.MtotalPage) {
              VstartPage = VcurrentPage - 3;
              VendPage = VcurrentPage + 3;
            } else if (VcurrentPage <= 3) {
              VstartPage = 1;
              VendPage = 7;
            } else if ((VcurrentPage + 3) > $scope.MtotalPage) {
              VstartPage = $scope.MtotalPage - 6;
              VendPage = $scope.MtotalPage;
            };
        };
        for (var i = VstartPage; i <= VendPage; i++) {
          $scope.Mpages.push(i);
        };
      });

    }

    $scope.FrefreshPP = function(){
      $scope.FloadPage(1);
    }

    $scope.FswitchPage = function(Vpage){
      $scope.FloadPage(Vpage);
    }

    $scope.FfirstPage = function(){
      $scope.FloadPage(1);
    }

    $scope.FlastPage = function(){
      $scope.FloadPage($scope.MtotalPage);
    }

    $scope.FaddVm = function(VvmInfo){
      SvmInfos.save({},VvmInfo,function(callbackdata){
        console.log(callbackdata.vm_infos);
      });
    };

    $scope.FupdateVm = function(VvmInfo){
      SvmInfos.update({vmid:VvmInfo.vm_id},VvmInfo,function(callbackdata){
        console.log(callbackdata.vm_infos);
      });
    };

    $scope.FdeleteById = function(Vid){
      SvmInfos.delete({vmid:Vid},function(callbackdata){
        console.log(callbackdata.vm_infos);
      });
    };

    $scope.FshowHelp = function(VvmInfo){
        SvmHelpInfo.get({vmid:VvmInfo.vm_id},function(callbackdata){
          $rootScope.MvmHelpInfos = callbackdata.help_info;
        });
        $rootScope.MshowHelper = true;
    };

    $scope.FfirstPage();

});

//docker-right 检视关联区控制器
helloworldApp.controller('CdockerHelper', function ($scope,$rootScope) {
    $rootScope.MshowHelper = false;
    $scope.Fclose = function(){
      $rootScope.MshowHelper = false;
    };
});
