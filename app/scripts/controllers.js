'use strict';

/**
 * @ngdoc function
 * @name promise.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the promise
 */

var promise = angular.module('promise');

// angular init
promise.run(function($rootScope, $timeout){
  $timeout(
    function(){
      $rootScope.FcookieAuth();
    },
    100
  );
});

// charjs default config
Chart.defaults.global.defaultFontColor = '#000';
Chart.defaults.global.scaleFontColor = '#000';

// navbar
promise.controller('Cnavbar', function($scope, $rootScope){
  $scope.FtoggleMenu = function(){
    $rootScope.MshowMenu = !$rootScope.MshowMenu
  };
});

// helper trigger
promise.controller('ChelperTrigger', function($scope,$rootScope){
  $scope.FtoggleHelper = function(){
    $rootScope.MshowHelper = !$rootScope.MshowHelper;
  };
});

// sign
promise.controller('Csign', function($scope,$rootScope,$cookies,SuserService){
  // watch if signed
  $rootScope.$watch('MisSign', function(newValue, oldValue){
    $rootScope.MshowSign = !$rootScope.MisSign;
  });

  // cookies-token-delay
  $rootScope.FtokenDelay = function(){
    if ($rootScope.Mtoken){
      var now = new Date();
      var expire = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()+2, now.getMinutes(), now.getSeconds());
      $cookies.put('token', $rootScope.Mtoken, {expires: expire});
    };
  };

  // cookies-rftoken-autodelay
  $rootScope.FrftokenDelay = function(){
    var Vrftoken = $cookies.get('rftoken');
    if (Vrftoken){
      var now = new Date();
      var expire = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()+2, now.getMinutes(), now.getSeconds());
      $cookies.put('rftoken', Vrftoken, {expires: expire});
    }
    else {
      $rootScope.Mrftoken = Null;
    };
  };

  // cookies-rftoken-refresh
  $rootScope.FtokenRefresh = function(Vrftoken){
    SuserService.FtokenRefresh().post(
      {},
      {'granttype': 'refreshtoken', 'refreshtoken': Vrftoken},
      function successCallback(callbackdata){
        $rootScope.Mtoken = callbackdata.token;
        $rootScope.FtokenDelay();
        $rootScope.FrftokenDelay();
        $rootScope.FtokenSignIn($rootScope.Mtoken);
      },
      function errorCallback(callbackdata){
        console.log(callbackdata);
        $scope.MsignErrorInfos = callbackdata.data.message;
        $scope.MsignError = false;
        $rootScope.MisSign = false;
      }
    );
  };

  // cookies-token-signin
  $rootScope.FtokenSignIn = function(Vtoken){
    SuserService.FtokenSignIn(Vtoken).post(
      {},
      {},
      function successCallback(callbackdata){
        $rootScope.MisSign = true;
        $scope.MsignError = false;
        $rootScope.FrftokenDelay();
      },
      function errorCallback(callbackdata){
        console.log(callbackdata);
        $scope.MsignErrorInfos = callbackdata.data.message;
        $scope.MsignError = true;
        $rootScope.MisSign = false;
      }
    );
  };

  // cookies-auth-main
  $rootScope.FcookieAuth = function(){
    var Vrftoken = $cookies.get('rftoken');
    if (!Vrftoken){
      // token expire, turn to web auth
      $scope.MsignError = false;
      $rootScope.MisSign = false;
    }
    else {
      // token not expire, token auth and auto delay
      $rootScope.FtokenRefresh(Vrftoken);
    }
  };

  // web-auth-main
  $scope.FsignIn = function(VuserInfo){
    SuserService.FsignIn().post(
      {},
      VuserInfo,
      function successCallback(callbackdata){
        // logic
        $rootScope.Mtoken = callbackdata.token;
        $rootScope.Mrftoken = callbackdata.rftoken;
        $rootScope.MisSign = true;
        $scope.MsignError = false;
        // cookies storage for 2 hours
        var now = new Date();
        var expire = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()+2, now.getMinutes(), now.getSeconds());
        $cookies.put('token', $rootScope.Mtoken, {expires: expire});
        $cookies.put('rftoken', $rootScope.Mrftoken, {expires: expire});
      },
      function errorCallback(callbackdata){
        $scope.MsignErrorInfos = callbackdata.data.message;
        $scope.MsignError = true;
        $rootScope.MisSign = false;
      }
    );
  };

  // web-auth-signout
  $rootScope.FsignOut = function(){
    $cookies.remove('token');
    $cookies.remove('rftoken');
    $rootScope.MisSign = false;
  }

});

// index
promise.controller('Cindex', function($scope,$rootScope){
});

// ui
promise.controller('Cui', function($scope,$rootScope){
  $scope.indexDataLine = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            fillColor: 'rgba(220,220,220,0.2)',
            strokeColor: 'rgba(220,220,220,1)',
            pointColor: 'rgba(220,220,220,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(220,220,220,1)',
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            fillColor: 'rgba(151,187,205,0.2)',
            strokeColor: 'rgba(151,187,205,1)',
            pointColor: 'rgba(151,187,205,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(151,187,205,1)',
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
  };
  $scope.indexDataPie = [
    {
        value: 300,
        color:"RGBA(255, 102, 0, 0.8)",
        highlight: "RGBA(255, 102, 0, 1)",
        label: "Red"
    },
    {
        value: 50,
        color: "rgba(255, 255, 255, 0.8)",
        highlight: "rgba(255,255,255,1)",
        label: "White"
    },
    {
        value: 100,
        color: "RGBA(69, 129, 218, 0.8)",
        highlight: "RGBA(69, 129, 218, 1)",
        label: "Blue"
    }
  ];
  $scope.tableDataTh = ['ID','名称','来源','年龄','爱好','特长','座右铭','书籍','植物','上周二的早餐','对第二次世界大战的看法','有钱以后想干什么'];
  $scope.tableData = [
    ['0','azrael','中国南方基地','28','没啥爱好','胳膊和腿比较长','整什么幺蛾子','克苏鲁神话','捕虫瑾','好像忘了吃了','正义终将会取得胜利','先懵逼一会儿'],
    ['89757','Null','Null','Null','Null','Null','414FAS#%IO','Null','Null','壳牌机油','Null','升级一下芯片'],
    ['1','Null','Null','Null','Null','Null','Null','Null','Null','Null','Null','Null'],
    ['2','Null','Null','Null','Null','Null','Null','Null','Null','Null','Null','Null'],
    ['3','Null','Null','Null','Null','Null','Null','Null','Null','Null','Null','Null'],
    ['4','Null','Null','Null','Null','Null','Null','Null','Null','Null','Null','Null'],
    ['5','Null','Null','Null','Null','Null','Null','Null','Null','Null','Null','Null']
  ];

});

// pm
promise.controller('Cpm', function($scope){
  $scope.tableDataTh = ['ID','IP','Hostname','Group'];
  $scope.tableData = [
    ['0','10.1.1.1','Fortress','MGMT'],
    ['1','192.168.182.100','Lab-Ansible','Lab'],
    ['2','192.168.182.101','Lab-1','Lab'],
    ['3','192.168.182.102','Lab-2','Lab'],
    ['4','192.168.182.103','Lab-3','Lab'],
    ['5','192.168.182.104','Lab-4','Lab'],
    ['6','192.168.182.105','Lab-5','Lab']
  ];
});













// promise.controller('Csign', function ($scope,$rootScope,$window,$base64,SuserService){
// // angularjs controller Csign: FsignIn/FsignUp/FsignOut/FtoggleSignUp/FcloseSign
//     $rootScope.MshowSign = false;
//
//     $scope.FsignIn = function(VuserInfo){
//       // angularjs function FsignIn().  Using for login.
//       // ResourceApi HTTP GET "class" actions: Resource.action([parameters], [success], [error])
//       // ResourceApi non-GET "class" actions: Resource.action([parameters], postData, [success], [error])
//       // default actions: {
//       // 'get':    {method:'GET'},
//       // 'save':   {method:'POST'},
//       // 'query':  {method:'GET', isArray:true},
//       // 'remove': {method:'DELETE'},
//       // 'delete': {method:'DELETE'} };
//       SuserService.FsignIn().post(
//         {},
//         VuserInfo,
//         function successCallback(callbackdata){
//           console.log('login success');
//           console.log(callbackdata);
//           console.log(callbackdata.status);
//           $scope.Mtoken = callbackdata.token;
//         },
//         function errorCallback(callbackdata){
//           console.log('login failed');
//           console.log(callbackdata);
//           console.log(callbackdata.status);
//         }
//       );
//     };
//
//     $scope.FtoggleSignUp = function(){
//       // angularjs function FtoggleSignUp().  Using for toggle signup page.
//       $scope.MshowSignUp = !$scope.MshowSignUp;
//     };
//
//     $scope.FcloseSign = function(){
//       // angularjs function FcloseSign().  Using for close sign(including signin and signup) page.
//       $rootScope.MshowSign = !true;
//     };
// });
//
// //Main 首页控制器
// promise.controller('Cmain', function () {
//     // $scope.awesomeThings = [
//     //   'HTML5 Boilerplate',
//     //   'AngularJS',
//     //   'Karma'
//     // ];
// });
//
// //ui-right 展示帮助页控制器
// promise.controller('CuiRight', function ($scope,$rootScope) {
//     $rootScope.MshowHelper = true;
//     $scope.FcloseHelper = function(){
//       $rootScope.MshowHelper = false;
//     };
// });
//
// //About 介绍页控制器
// promise.controller('Cabout', function ($scope) {
//     // $scope.awesomeThings = [
//     //   'HTML5 Boilerplate',
//     //   'AngularJS',
//     //   'Karma'
//     // ];
// });
//
// //Lab angularjs实验区控制器
// promise.controller('CngLab', function ($scope,$rootScope,SvmInfos) {
//
//     $scope.MvmInfos =[
//       {
//         vm_name:'CIDC-VM-TEST-001',
//         vm_id:'CIDC-VM-ID-001',
//         ip:'10.11.191.10',
//         vm_status:'2',
//         vn_id:'CIDC-VN-ID-001',
//         pm_id:'CIDC-PM-ID-001',
//         creater_time:'2011-02-14 19:22:32'
//       },
//       {
//         vm_name:'CIDC-VM-TEST-002',
//         vm_id:'CIDC-VM-ID-002',
//         ip:'10.11.191.12',
//         vm_status:'2',
//         vn_id:'CIDC-VN-ID-002',
//         pm_id:'CIDC-PM-ID-002',
//         creater_time:'2011-02-14 19:22:32'
//       },
//       {
//         vm_name:'CIDC-VM-TEST-003',
//         vm_id:'CIDC-VM-ID-003',
//         ip:'10.11.191.13',
//         vm_status:'2',
//         vn_id:'CIDC-VN-ID-003',
//         pm_id:'CIDC-PM-ID-003',
//         creater_time:'2011-02-14 19:22:32'
//       },
//       {
//         vm_name:'CIDC-VM-TEST-004',
//         vm_id:'CIDC-VM-ID-004',
//         ip:'10.11.191.14',
//         vm_status:'2',
//         vn_id:'CIDC-VN-ID-004',
//         pm_id:'CIDC-PM-ID-004',
//         creater_time:'2011-02-14 19:22:32'
//       }
//     ];
//     $scope.MshowEdit = true;
//     $scope.FshowHelp = function(){
//         $rootScope.MshowHelper = true;
//     };
//
//   	$scope.Mperson = {
//         firstName: 'John',
//         lastName: 'Doe'
//   	};
//
//     $scope.Mnames = [
//         {name:'Jani',country:'Norway'},
//         {name:'Hege',country:'Sweden'},
//         {name:'Kai',country:'Denmark'}
//     ];
//
//     $scope.MmyVar = false;
//     $scope.Ftoggle = function() {
//         $scope.MmyVar = !$scope.MmyVar;
//     };
//
//     $scope.Mmaster = {firstName: 'John', lastName: 'Doe'};
//     $scope.Freset = function() {
//         $scope.Muser = angular.copy($scope.Mmaster);
//     };
//     $scope.Freset();
//
// });
//
// //Blog 博客区控制器
// promise.controller('Cblog', function ($scope) {
//
//     $scope.Mblogs = [
//         {author:'小明',date:'2015-5-1 21:22:15',content:'今天是个好日子呀，我只是看到了老师的妹妹经过，为什么老师还是要我出去？讲实话有错吗？'},
//         {author:'小红',date:'2015-6-23 22:05:15',content:'今天天气不错，路过了姐姐的办公室，看到了那个传说中的小明，对我笑了笑，然后不出意外地被姐姐吼出教室罚站了。'},
//         {author:'小米老师',date:'2014-5-23 02:10:15',content:'今天本来心情很好，结果看到小明东张西望，问他看什么，竟然说“你妹”，这小子就是欠抽'}
//     ];
//
// });
//
// //云主机检视区控制器
// promise.controller('Cdocker', function ($scope,$rootScope,SvmInfos,SvmHelpInfo) {
//     $rootScope.MvmHelpInfos = {};
//
//     $scope.MshowEdit = true;
//     $scope.MshowAdd = false;
//
//     $scope.MvmInfos =[];
//     $scope.Mpp = 20;
//     $scope.MtotalPage = 1;
//     $scope.MvmAddInfos = {
//         vm_name:'',
//         vm_id:'',
//         ip:'',
//         vm_status:'',
//         vn_id:'',
//         pm_id:'',
//         creater_time:''
//     };
//
//     $scope.FqueryVmInfos = function(){
//       SvmInfos.get(function(callbackdata){
//         $scope.MvmInfos = callbackdata.vm_infos;
//       });
//     };
//
//     $scope.FsearchId = function(event){
//       if (event.keyCode !== 13) {
//         return;
//       }
//       var VvmId = $scope.MvmId;
//       SvmInfos.get({vmid:VvmId},function(callbackdata){
//         var Vtemparray = [];
//         Vtemparray.push(callbackdata.vm_info);
//         $scope.MvmInfos = Vtemparray;
//       });
//     };
//
//     $scope.FloadPage = function(VcurrentPage){
//       $scope.MvmInfos = [];
//       $scope.Mpages = [];
//       SvmInfos.get({page:VcurrentPage,pp:$scope.Mpp},function(callbackdata){
//         $scope.MvmInfos = callbackdata.vm_infos;
//         $scope.MtotalPage = callbackdata.total_page;
//         var VstartPage = 1;
//         var VendPage = $scope.MtotalPage;
//         if ($scope.MtotalPage > 1 && $scope.MtotalPage <=7) {
//             VstartPage = 1;
//             VendPage = $scope.MtotalPage;
//         } else if ($scope.MtotalPage > 7) {
//             if (VcurrentPage > 3 && (VcurrentPage + 3) <= $scope.MtotalPage) {
//               VstartPage = VcurrentPage - 3;
//               VendPage = VcurrentPage + 3;
//             } else if (VcurrentPage <= 3) {
//               VstartPage = 1;
//               VendPage = 7;
//             } else if ((VcurrentPage + 3) > $scope.MtotalPage) {
//               VstartPage = $scope.MtotalPage - 6;
//               VendPage = $scope.MtotalPage;
//             }
//         }
//         for (var i = VstartPage; i <= VendPage; i++) {
//           $scope.Mpages.push(i);
//         }
//       });
//     };
//
//     $scope.FrefreshPP = function(){
//       $scope.FloadPage(1);
//     };
//
//     $scope.FswitchPage = function(Vpage){
//       $scope.FloadPage(Vpage);
//     };
//
//     $scope.FfirstPage = function(){
//       $scope.FloadPage(1);
//     };
//
//     $scope.FlastPage = function(){
//       $scope.FloadPage($scope.MtotalPage);
//     };
//
//     $scope.FaddVm = function(VvmInfo){
//       SvmInfos.save({},VvmInfo,function(callbackdata){
//         console.log(callbackdata.vm_infos);
//       });
//     };
//
//     $scope.FupdateVm = function(VvmInfo){
//       SvmInfos.update({vmid:VvmInfo.vm_id},VvmInfo,function(callbackdata){
//         console.log(callbackdata.vm_infos);
//       });
//     };
//
//     $scope.FdeleteById = function(Vid){
//       SvmInfos.delete({vmid:Vid},function(callbackdata){
//         console.log(callbackdata.vm_infos);
//       });
//     };
//
//     $scope.FshowHelp = function(VvmInfo){
//         SvmHelpInfo.get({vmid:VvmInfo.vm_id},function(callbackdata){
//           $rootScope.MvmHelpInfos = callbackdata.help_info;
//         });
//         $rootScope.MshowHelper = true;
//     };
//
//     $scope.FfirstPage();
//
// });
//
// //docker-right 检视关联区控制器
// promise.controller('CdockerHelper', function ($scope,$rootScope) {
//     $rootScope.MshowHelper = !false;
//     $scope.FcloseHelper = function(){
//       $rootScope.MshowHelper = false;
//     };
// });
