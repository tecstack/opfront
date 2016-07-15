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
      // $rootScope.MisSign = true;
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
      $rootScope.Mrftoken = null;
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

  // web-auth-via-key-press
  $scope.FsignInEnter = function(event,VuserInfo){
    if (event.keyCode == 13){
      $scope.FsignIn(VuserInfo);
    };
  }

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

// host
promise.controller('Chost', function($scope, $rootScope, ShostService){
  $scope.tableDataTh = [
    // th的值用于展示；filtername的值用于定位筛选，一定要和数据里的key一致
    {'th': '主机ID', 'filterName': 'hostid'},
    {'th': '主机IP', 'filterName': 'ip'},
    {'th': '主机名', 'filterName': 'host'},
    {'th': '组', 'filterName': 'name'}
  ];
  $scope.tableDatas = [
    // {
    //   "available": "0",
    //   "groups": [{"groupid": "4", "name": "Zabbix servers"}],
    //   "host": "Zabbix server",
    //   "hostid": "0",
    //   "interfaces": [{"interfaceid": "1", "ip": "127.0.0.1"}],
    //   "status": "1"
    // },
    // {
    //   "available": "1",
    //   "groups": [{"groupid": "8", "name": "cloudlab"}, {"groupid": "5", "name": "Discovered hosts"}],
    //   "host": "192.168.182.2",
    //   "hostid": "1",
    //   "interfaces": [{"interfaceid": "11", "ip": "192.168.182.2"}],
    //   "status": "0"
    // }
  ];

  $scope.Mfilters = [
    // {filterName:'ip', filterBool:'=', filterContent:'192'},
    // {filterName:'host', filterBool:'!=', filterContent:'LAB-100'},
    // {filterName:'hostid', filterBool:'=', filterContent:'MGMT'}
  ];

  $scope.FaddFilter = function(){
    $scope.Mfilters.push({filterName:'', filterBool:'', filterContent:''});
  };
  $scope.FremoveFilter = function(filter){
    var Vfilters = $scope.Mfilters;
    Vfilters.splice(Vfilters.indexOf(filter), 1);
  };
  $scope.FshowPmHelper = function(pm){
    // ['0','10.1.1.1','Fortress','MGMT']
    $rootScope.MpmNode = pm;
    $rootScope.MshowHelper = true;
  };

  $scope.Mpp = "100";
  $scope.Mpages = 1;
  $scope.McurrentPage = 1;

  $scope.FgetHost = function(){
    var vars = {};
    if ($scope.Mpp != "0") {
      vars.pp = $scope.Mpp;
      vars.page = $scope.McurrentPage;
    }
    ShostService.Fhost($rootScope.Mtoken).get(
      vars,
      function successCallback(callbackdata){
        // logic
        // {
        //   "data": [
        //     {"available": "0", "groups": [{"groupid": "4", "name": "Zabbix servers"}], "host": "Zabbix server", "hostid": "10084", "interfaces": [{"interfaceid": "1", "ip": "127.0.0.1"}], "status": "1"},
        //     ...,
        //     {"available": "1", "groups": [{"groupid": "8", "name": "cloudlab"}, {"groupid": "5", "name": "Discovered hosts"}], "host": "192.168.182.2", "hostid": "10106", "interfaces": [{"interfaceid": "11", "ip": "192.168.182.2"}], "status": "0"}
        //   ]
        // }
        $scope.tableData = callbackdata.data;
        $scope.Mpages = callbackdata.totalpage;
      },
      function errorCallback(callbackdata){
        console.log(callbackdata.message);
      }
    );
  };

  // watch if current page changes
  $scope.$watchGroup(['McurrentPage', 'Mpp'], function(newValue, oldValue){
    $scope.FgetHost();
  });

  $scope.FprevPage = function(){
    if ($scope.McurrentPage > 1) {
      $scope.McurrentPage --;
    };
  };
  $scope.FnextPage = function(){
    if ($scope.McurrentPage < $scope.Mpages) {
      $scope.McurrentPage ++;
    };
  };
  $scope.FgoPage = function(event, page){
    if (event.keyCode == 13){
      $scope.McurrentPage = parseInt(page);
    };
  };
  $scope.FgoPage($scope.McurrentPage);

});

// Pm helper
promise.controller('ChostHelper', function($scope, $rootScope){

});
