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
promise.run(function($rootScope, $timeout, $filter, $cookies, SuserService, ShostService){
  // -----------------------Sign--------------------------
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
        $rootScope.MsignErrorInfos = callbackdata.data.message;
        $rootScope.MsignError = false;
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
        $rootScope.MsignError = false;
        $rootScope.FrftokenDelay();
      },
      function errorCallback(callbackdata){
        console.log(callbackdata);
        $rootScope.MsignErrorInfos = callbackdata.data.message;
        $rootScope.MsignError = true;
        $rootScope.MisSign = false;
      }
    );
  };
  // cookies-auth-main
  $rootScope.FcookieAuth = function(){
    var Vrftoken = $cookies.get('rftoken');
    if (!Vrftoken){
      // token expire, turn to web auth
      $rootScope.MsignError = false;
      $rootScope.MisSign = false;
    }
    else {
      // token not expire, token auth and auto delay
      $rootScope.FtokenRefresh(Vrftoken);
    }
  };


  // ----------------------hosts------------------------
  // [
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
  // ];
  $rootScope.MhostsData = [];
  $rootScope.MhostsSelected = [];
  $rootScope.MhostsDataFilter = [];
  $rootScope.MhostsDataTh = [
    // th的值用于展示；filtername的值用于定位筛选，一定要和数据里的key一致
    {'th': '主机ID', 'filterName': 'hostid'},
    {'th': '主机IP', 'filterName': 'ip'},
    {'th': '主机名', 'filterName': 'host'},
    {'th': '组', 'filterName': 'name'}
  ];
  $rootScope.Mfilters = [
    {filterName:'ip', filterBool:'=', filterContent:''},
    {filterName:'host', filterBool:'=', filterContent:''},
    {filterName:'name', filterBool:'=', filterContent:''}
  ];
  $rootScope.MpageOptions = {
    'pp': '0',
    'totalPage': 1,
    'currentPage': 1
  };

  $rootScope.FaddFilter = function(){
    $rootScope.Mfilters.push({filterName:'', filterBool:'', filterContent:''});
  };
  $rootScope.FremoveFilter = function(filter){
    var Vfilters = $rootScope.Mfilters;
    Vfilters.splice(Vfilters.indexOf(filter), 1);
  };
  $rootScope.FgetHost = function(){
    var vars = {};
    if ($rootScope.MpageOptions.pp != "0") {
      vars.pp = $rootScope.MpageOptions.pp;
      vars.page = $rootScope.MpageOptions.currentPage;
    }
    ShostService.Fhost($rootScope.Mtoken).get(
      vars,
      function successCallback(callbackdata){
        // {
        //   "data": [
        //     {"available": "0", "groups": [{"groupid": "4", "name": "Zabbix servers"}], "host": "Zabbix server", "hostid": "10084", "interfaces": [{"interfaceid": "1", "ip": "127.0.0.1"}], "status": "1"},
        //     ...,
        //     {"available": "1", "groups": [{"groupid": "8", "name": "cloudlab"}, {"groupid": "5", "name": "Discovered hosts"}], "host": "192.168.182.2", "hostid": "10106", "interfaces": [{"interfaceid": "11", "ip": "192.168.182.2"}], "status": "0"}
        //   ]
        // }
        $rootScope.MhostsData = callbackdata.data;
        $rootScope.MpageOptions.totalPage = callbackdata.totalpage;
        for (var index in $rootScope.MhostsData) {
          $rootScope.MhostsData[index].select = false;
        };
      },
      function errorCallback(callbackdata){
        console.log(callbackdata.message);
      }
    );
  };

  $rootScope.FprevPage = function(){
    if ($rootScope.MpageOptions.currentPage > 1) {
      $rootScope.MpageOptions.currentPage --;
    };
  };
  $rootScope.FnextPage = function(){
    if ($rootScope.MpageOptions.currentPage < $rootScope.MpageOptions.totalPage) {
      $rootScope.MpageOptions.currentPage ++;
    };
  };
  $rootScope.FgoPage = function(event, page){
    if (event.keyCode == 13){
      $rootScope.MpageOptions.currentPage = parseInt(page);
    };
  };
  $rootScope.FgoPage($rootScope.MpageOptions.currentPage);

  $rootScope.FchangeSelect = function(node){
    if (node.select == true) {
      $rootScope.MhostsSelected.push(node);
    }
    else {
      $rootScope.MhostsSelected.splice($rootScope.MhostsSelected.indexOf(node), 1);
    };
  };

  $rootScope.McheckAll = {
    'status': false
  };

  $rootScope.FcheckAll = function(checkAll){
    // {"select":false, "available": "0", "groups": [{"groupid": "4", "name": "Zabbix servers"}], "host": "Zabbix server", "hostid": "10084", "interfaces": [{"interfaceid": "1", "ip": "127.0.0.1"}], "status": "1"},
    var bool = checkAll.status;
    var oldArray = $rootScope.MhostsSelected;
    var newArray = $rootScope.MhostsDataFilter;
    var hash = {};
    for (var index in oldArray) {
      hash[oldArray[index].interfaces[0].ip] = true;
    };
    for (var index in newArray) {
      $rootScope.MhostsDataFilter[index].select = bool;
      if (hash[newArray[index].interfaces[0].ip]) {
        if (bool == false) {
          hash[newArray[index].interfaces[0].ip] = undefined;
          oldArray.splice(oldArray.indexOf(newArray[index]), 1);
        }
      }
      else {
        if (bool == true) {
          hash[newArray[index].interfaces[0].ip] = true;
          oldArray.push(newArray[index]);
        }
      };
    }
    $rootScope.MhostsSelected = oldArray;
  };


  // ---------------------auto token login---------------------
  $rootScope.FcookieAuth();
  $timeout(
    function(){
      $rootScope.FgetHost();
      // $rootScope.MisSign = true;
    },
    1000
  );

  // ---------------------watch---------------------
  $rootScope.$watchGroup(['MpageOptions.currentPage','MpageOptions.pp'], function(newValue, oldValue){
    if ($rootScope.Mtoken) {
      $rootScope.FgetHost();
    };
  });
  $rootScope.$watch('MisSign', function(newValue, oldValue){
    $rootScope.MshowSign = !$rootScope.MisSign;
  });
  $rootScope.$watch('Mfilters', function(newValue, oldValue){
    $rootScope.MhostsDataFilter = $filter('hostFilter')($rootScope.MhostsData, $rootScope.Mfilters);
  }, true);
  $rootScope.$watchCollection('MhostsData', function(newValue, oldValue){
    $rootScope.MhostsDataFilter = $filter('hostFilter')($rootScope.MhostsData, $rootScope.Mfilters);
  });
  $rootScope.$watchCollection('MhostsDataFilter', function(newValue, oldValue){
    $rootScope.McheckAll.status = false;
  });
});

// charjs default config
Chart.defaults.global.defaultFontColor = '#fff';
Chart.defaults.global.scaleFontColor = '#fff';

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
        $rootScope.MsignError = false;
        // cookies storage for 2 hours
        var now = new Date();
        var expire = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()+2, now.getMinutes(), now.getSeconds());
        $cookies.put('token', $rootScope.Mtoken, {expires: expire});
        $cookies.put('rftoken', $rootScope.Mrftoken, {expires: expire});
      },
      function errorCallback(callbackdata){
        $rootScope.MsignErrorInfos = callbackdata.data.message;
        $rootScope.MsignError = true;
        $rootScope.MisSign = false;
      }
    );
  };

  // web-auth-via-key-press
  $scope.FsignInEnter = function(event,VuserInfo){
    if (event.keyCode == 13){
      $scope.FsignIn(VuserInfo);
    };
  };

  // web-auth-signout
  $rootScope.FsignOut = function(){
    $cookies.remove('token');
    $cookies.remove('rftoken');
    $rootScope.MisSign = false;
  };
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
  $scope.FshowPmHelper = function(pm){
    // ['0','10.1.1.1','Fortress','MGMT']
    $rootScope.MpmNode = pm;
    $rootScope.MshowHelper = true;
  };
});

// host helper
promise.controller('ChostHelper', function($scope, $rootScope){

});

// script
promise.controller('Cscript', function($scope, $rootScope, ShostService){
  // script selector
  $scope.MscriptSelected = [];
  $scope.MeditorOptions = {
    lineNumbers: true,
    theme:'monokai',
    // readOnly: 'nocursor',
    lineWrapping : true,
    mode: 'python'
  };
  $scope.MscriptContent = 'def tset(){\r  \r}';
  $scope.FsaveScript = function(){
    if ($scope.MscriptName) {
      var VscriptNode = {
        'name': $scope.MscriptName,
        'content': $scope.MscriptContent
      };
      $scope.MscriptSelected.push(VscriptNode);
    }
    else {
      // 判断脚本内容是否为空的部分还要添加
      console.log('You need to name the script first');
    };
  };

  // vars selector
  $scope.MvarsSelected = [];
  $scope.FaddVars = function(){
    $scope.MvarsSelected.push('');
  };
  $scope.FremoveVars = function(node){
    var Vvars = $scope.MvarsSelected
    Vvars.splice(Vvars.indexOf(node), 1);
  };

  // executor
  $scope.Fexecute = function(){
    $scope.MshowRight.detail = false;
    $scope.MshowRight.executor = true;
  };
  $scope.Fback = function(){
    $scope.MshowRight.detail = true;
    $scope.MshowRight.executor = false;
  };

  // show watch
  $scope.MshowGo = false;
  $scope.MshowRight = {
    'detail': true,
    'executor': false
  };
  $scope.MshowDetail = {
    'hosts': false,
    'script': false,
    'vars': false
  };
  $scope.MshowJudge = {
    'hosts': false,
    'script': false
  }
  $scope.FshowDetailDiv = function(name){
    for (var key in $scope.MshowDetail) {
      $scope.MshowDetail[key] = (key === name)?true:false;
    };
  };
  $scope.$watchCollection('MhostsSelected',function(newValue, oldValue){
    $scope.MshowJudge.hosts = ($rootScope.MhostsSelected.length > 0)?true:false;
  });
  $scope.$watchCollection('MscriptSelected',function(newValue, oldValue){
    $scope.MshowJudge.script = ($scope.MscriptSelected.length > 0)?true:false;
  });
  $scope.$watchCollection('MshowJudge', function(newValue, oldValue){
    $scope.MshowGo = ($scope.MshowJudge.hosts == true && $scope.MshowJudge.script == true)?true:false;
  });

});




// --------------------------module---------------------------

promise.controller('Cmodule', function($scope, $rootScope, $timeout, SshellService){
  // shell service
  $scope.FcreateWalker = function(VshellInfo) {
    SshellService.FcreateWalker($rootScope.Mtoken).post(
      {},
      VshellInfo,
      function successCallback(callbackdata){
        // console.log(callbackdata);
        // message:"mission start"
        // trails:Array[2]
        // walker_id:"b83c997c4f4511e6a80b005056b862a481c7de450e5d34a08cd7539caa015c0c"
        $scope.MwalkerId = callbackdata.walker_id;
        $scope.MerrInfo = callbackdata.message;
      },
      function errorCallback(callbackdata){
        // console.log(callbackdata);
        $scope.MerrInfo = callbackdata.message;
      }
    );
  };
  $scope.FqueryWalker = function(VwalkerId) {
    SshellService.FqueryWalker($rootScope.Mtoken).get(
      {'walkerid': VwalkerId},
      function successCallback(callbackdata){
        // console.log(callbackdata);
        // message:"walker info",
        // walker_name:"20160721212518-kiutg98",
        // trails:[
        //   {
        //     ip:"192.168.182.3"
        //     msg:null
        //     stdout:""
        //     stderr:""
        //     sum_changed:0
        //     sum_failures:1
        //     sum_ok:0
        //     sum_skipped:0
        //     sum_unreachable:0
        //     time_end:"2016-07-21T21:25:19.732532+00:00"
        //     time_start:"2016-07-21T21:25:19.717201+00:00"
        //     time_delta_string:"xxx"
        //     trail_id:"915a119e4f4611e6a80b005056b862a4def6187d74ed38aca7e6978f2eecd7c7"
        //   },
        // ]
        for (var index in callbackdata.trails) {
          var node = callbackdata.trails[index];
          var ip = node.ip;
          $scope.Mresult[ip] = node;
        };
        $scope.MerrInfo = callbackdata.message;
      },
      function errorCallback(callbackdata){
        // console.log(callbackdata);
        $scope.MerrInfo = callbackdata.message;
      }
    );
  }

  // shell editor
  $scope.MeditorOptions = {
    lineNumbers: false,
    theme:'monokai',
    // readOnly: 'nocursor',
    lineWrapping : true,
    mode: 'shell'
  };
  $scope.MshellSelected = {'shell':''};
  $scope.Mshell = '';
  $scope.Mosuser = 'root';
  $scope.FsaveShell = function(){
    if ($scope.Mshell) {
      $scope.MshellSelected.shell = $scope.Mshell;
    }
    else {
      // 判断脚本内容是否为空的部分还要添加
      console.log('shell blank');
    };
  };

  // executor
  $scope.MshellInfo = {
    'shell': '',
    'iplist': [],
    'osuser': ''
  };
  $scope.Mresult = {
    // '1.1.1.1': {
    //   'ip': '1.1.1.1',
    //   'stdout': '',
    //   'stderr': '',
    //   'sum_failures': '',
    //   'sum_changed': '',
    //   'sum_ok': '',
    //   'sum_unreachable': '',
    //   'time_delta_string': ''
    //   ....
    // }
  }
  $scope.Fexecute = function(){
    $scope.MshowRight.detail = false;
    $scope.MshowRight.executor = true;
    $scope.MshellInfo.shell = $scope.MshellSelected.shell;
    $scope.MshellInfo.osuser = $scope.Mosuser;
    for (var node in $rootScope.MhostsSelected) {
      var ip = $rootScope.MhostsSelected[node].interfaces[0].ip;
      $scope.MshellInfo.iplist.push(ip);
      $scope.Mresult[ip] = {};
    }
    $scope.FcreateWalker($scope.MshellInfo);
    $timeout(
      function(){
        $scope.FqueryWalker($scope.MwalkerId);
      },
      2000
    );
  };
  $scope.Fback = function(){
    $scope.MshowRight.detail = true;
    $scope.MshowRight.executor = false;
  };
  $scope.FshowStdout = function(node){
    $scope.Mstdout = node.stdout;
  };


  // watch show
  $scope.MshowGo = false;
  $scope.MshowRight = {
    'detail': true,
    'executor': false
  };
  $scope.MshowDetail = {
    'hosts': false,
    'shell': false,
  };
  $scope.MshowJudge = {
    'hosts': false,
    'shell': false
  }
  $scope.FshowDetailDiv = function(name){
    for (var key in $scope.MshowDetail) {
      $scope.MshowDetail[key] = (key === name)?true:false;
    };
  };
  $scope.$watchCollection('MhostsSelected',function(newValue, oldValue){
    $scope.MshowJudge.hosts = ($rootScope.MhostsSelected.length > 0)?true:false;
  });
  $scope.$watchCollection('MshellSelected',function(newValue, oldValue){
    $scope.MshowJudge.shell = ($scope.MshellSelected.shell)?true:false;
  });
  $scope.$watchCollection('MshowJudge', function(newValue, oldValue){
    $scope.MshowGo = ($scope.MshowJudge.hosts == true && $scope.MshowJudge.shell == true)?true:false;
  });

});
