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
promise.run(function($rootScope, $timeout, $filter, $cookies, SinfoService, SuserService, ShostService, SscriptService){
  // charjs 初始设置
  Chart.defaults.global.defaultFontColor = '#fff';
  Chart.defaults.global.scaleFontColor = '#fff';

  // 消息队列，用于消息区临时提示
  $rootScope.Minfos = [];
  $rootScope.FaddInfo = function(node){
    SinfoService.FaddInfo(node);
  };

  // 主机信息服务，包含所有hosts相关信息
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
        $rootScope.MhostsData = callbackdata.data;
        $rootScope.MpageOptions.totalPage = callbackdata.totalpage;
        $rootScope.MhostsNum = $rootScope.MhostsData.length;
        for (var index in $rootScope.MhostsData) {
          $rootScope.MhostsData[index].select = false;
        };
        SinfoService.FaddInfo('已同步' + $rootScope.MhostsNum + '条主机信息');
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo('获取主机信息失败:' + callbackdata.message);
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

  // 脚本信息服务
  $rootScope.FgetScriptList = function(){
    SscriptService.FgetList($rootScope.Mtoken).get(
      {},
      function successCallback(callbackdata){
        $rootScope.Mscripts = callbackdata.scripts;
        $rootScope.MscriptsNum = $rootScope.Mscripts.length;
        SinfoService.FaddInfo('已同步' + $rootScope.MscriptsNum + '条脚本信息');
      },
      function errorCallback(callbackdata){
        SinfoService.FaddInfo('获取脚本信息失败:' + callbackdata.message);
      }
    );
  };

  // 自动登录，使用cookie保存token
  $rootScope.FtokenSignIn = SuserService.FtokenSignIn;
  // token刷新，包含一次自动登录
  $rootScope.FtokenRefresh = SuserService.FtokenRefresh;
  // 自动登录逻辑
  $rootScope.FcookieAuth = function(){
    var Vrftoken = $cookies.get('rftoken');
    if (!Vrftoken){
      // rftoken已过期或者未保持登录，不刷新，只尝试token自动登录
      $rootScope.MsignError = false;
      $rootScope.MisSign = false;
      $rootScope.FtokenSignIn();
    }
    else {
      // rftoken未过期，尝试刷新并自动登录
      $rootScope.FtokenRefresh();
    }
  };
  // 初始化自动登录
  $rootScope.FcookieAuth();

  // 监控区
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
  // 手动登录
  $scope.FsignIn = SuserService.FsignIn;
  // 回车判定登陆
  $scope.FsignInEnter = function(event, VuserInfo, VisKeep){
    if (event.keyCode == 13){
      $scope.FsignIn(VuserInfo, VisKeep);
    };
  };
  // 手动登出
  $rootScope.FsignOut = SuserService.FsignOut;
});

// index
promise.controller('Cindex', function($scope,$rootScope){
});

// ui
promise.controller('Cui', function($scope,$rootScope){
  // 初始化
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

// ------------------------------Host----------------------------
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


// ------------------------------Script----------------------------
promise.controller('Cscript', function($scope, $rootScope, $timeout, SscriptService){
  // 初始化
  $scope.MisPublicOptions = [
    {'label':'仅自己', 'value':0},
    {'label':'所有人', 'value':1}
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
    $scope.Mscript = {'script_lang': $scope.MeditorOptions.mode};
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

// --------------------------Module---------------------------
promise.controller('Cmodule', function($scope, $rootScope, $timeout, $interval, SscriptService, SwalkerService){
  // walker接口服务
  $scope.FcreateWalker = function(VmoduleName, VmoduleVars){
    SwalkerService.FcreateWalker($rootScope.Mtoken, VmoduleName).post(
      {},
      VmoduleVars,
      function successCallback(callbackdata){
        $scope.MwalkerId = callbackdata.walker_id;
        $scope.MerrInfo = callbackdata.message;
        $scope.MinfoWalkerPromise = $interval(
          function (){
            $scope.FinfoWalker($scope.MmoduleSelected.name, $scope.MwalkerId);
          },
          2000
        );
      },
      function errorCallback(callbackdata){
        // console.log(callbackdata);
        $scope.MerrInfo = callbackdata.data.message;
      }
    );
  };
  $scope.FqueryWalker = function(VmoduleName){
    SwalkerService.FqueryWalker($rootScope.Mtoken, VmoduleName).get(
      {},
      function successCallback(callbackdata){
      },
      function errorCallback(callbackdata){
        // console.log(callbackdata);
      }
    );
  };
  $scope.FinfoWalker = function(VmoduleName, VwalkerId){
    SwalkerService.FinfoWalker($rootScope.Mtoken, VmoduleName, VwalkerId).get(
      {},
      function successCallback(callbackdata){
        var VtotalHosts = callbackdata.trails.length;
        var Vsuccess = 0;
        var Vfailed = 0;
        var Vunreachable = 0;
        var Vskipped = 0;
        for (var index in callbackdata.trails) {
          var node = callbackdata.trails[index];
          var ip = node.ip;
          $scope.Mresult[ip] = node;
          if (node.sum_changed || node.sum_ok) {
            Vsuccess += 1;
          } else if (node.sum_failures) {
            Vfailed += 1;
          } else if (node.sum_unreachable) {
            Vunreachable += 1;
          } else if (node.sum_skipped) {
            Vskipped += 1;
          }
        };
        $scope.Mprogress.success = Vsuccess;
        $scope.Mprogress.failed = Vfailed;
        $scope.Mprogress.unreachable = Vunreachable;
        $scope.Mprogress.skipped = Vskipped;
        $scope.Mprogress.total = VtotalHosts;
        $scope.MerrInfo = callbackdata.message;
      },
      function errorCallback(callbackdata){
        $scope.MerrInfo = callbackdata.data.message;
      }
    );
  };
  $scope.FstopInfoWalker = function(){
    if (angular.isDefined($scope.MinfoWalkerPromise)) {
      $interval.cancel($scope.MinfoWalkerPromise);
      $scope.MinfoWalkerPromise = undefined;
    };
  };
  $scope.$on('$destroy', function() {
    // Make sure that the interval is destroyed too
    $scope.FstopInfoWalker();
  });

  // ---------------------Module Editor---------------------
  // init
  $scope.Mprogress = {
    'success': 0,
    'failed': 0,
    'unreachable': 0,
    'skipped': 0,
    'total': 0,
  };

  $scope.MosuserOptions = [
    {'label':'ROOT', 'value':'root'},
  ];
  $scope.MeditorOptions = {
    'shell': {
      lineNumbers: true,
      theme:'monokai',
      // readOnly: 'nocursor',
      lineWrapping : false,
      mode: 'shell',
    },
    'script': {
      lineNumbers: true,
      theme:'monokai',
      readOnly: 'nocursor',
      lineWrapping : false,
      mode: 'python',
    },
    'executor': {
      lineNumbers: true,
      theme:'monokai',
      readOnly: 'nocursor',
      lineWrapping : false,
      mode: 'shell',
    },
  };
  $scope.MselectContent = function(Vcontent){
    $scope.MmoduleSelected.content = Vcontent;
    $rootScope.MshowHelper = false;
  };

  // shell editor
  $scope.MshellContent = {
    'shell': '',
    'osuser': 'root'
  };

  // script editor
  $scope.MscriptContent = {
    'scriptid': '',
    'osuser': 'root'
  };
  $scope.FshowScripts = function(){
    $rootScope.MshowHelper = true;
    for (var key in $rootScope.MshowHelperNode) {
      $rootScope.MshowHelperNode[key] = false;
    }
    $rootScope.MshowHelperNode.script = true;
    $rootScope.FgetScriptList();
  };

  // ---------------------Executor---------------------
  $scope.MpostWalkerInfo = {};
  $scope.Mresult = {};
  $scope.Fexecute = function(){
    $scope.MshowRight.detail = false;
    $scope.MshowRight.executor = true;
    $scope.MshowLoading = true;
    $scope.Mresult = {};
    $scope.MpostWalkerInfo = {};
    jQuery.extend($scope.MpostWalkerInfo,$scope.MmoduleSelected.content);
    $scope.MpostWalkerInfo.iplist = [];
    $scope.Mstdout = '';
    for (var kind in $scope.Mprogress) {
      $scope.Mprogress[kind] = 0;
    }
    for (var node in $rootScope.MhostsSelected) {
      var ip = $rootScope.MhostsSelected[node].interfaces[0].ip;
      $scope.MpostWalkerInfo.iplist.push(ip);
      $scope.Mresult[ip] = {};
    }
    $scope.FcreateWalker($scope.MmoduleSelected.name, $scope.MpostWalkerInfo);
  };
  $scope.Fback = function(){
    $scope.MshowRight.detail = true;
    $scope.MshowRight.executor = false;
  };
  $scope.FshowStdout = function(node){
    if (node.stdout) {
      $scope.Mstdout = node.stdout;
    }
    else if (node.stderr) {
      $scope.Mstdout = node.stderr;
    };
  };


  // ---------------------watch & show---------------------
  // 用来决定detail->module->?页面里对应模块编辑器的显示
  $scope.Mmodules = {
    'shell': false,
    'script': false
  };
  // 当前选择进行编辑的模块，name是名称，content是左侧显示栏的内容，也是后续发往createWalker的内容之一
  $scope.MmoduleSelected = {
    'name': '',
    'content': {}
  };
  // 选择模块，显示对应的编辑器，屏蔽其他模块编辑器，更改MmoduleSelected内容
  $scope.FselectModule = function(VmoduleName){
    $scope.MmoduleSelected.name = VmoduleName;
    $scope.MmoduleSelected.content = {};
    for (var key in $scope.Mmodules) {
      $scope.Mmodules[key] = (VmoduleName == key)?true:false;
    };
  };
  // 决定是否显示执行标志，只有选择了主机和编辑了模块内容后才会显示
  $scope.MshowGo = false;
  // 决定右侧的界面显示，detail代表选定编辑页面，executor代表执行过程页面，执行execute()之后便会跳转到executor
  $scope.MshowRight = {
    'detail': true,
    'executor': false,
  };
  // 决定detail编辑页面里的内容显示，hosts代表主机列表选取页面，module代表模块编辑器
  $scope.MshowRightNode = {
    'hosts': false,
    'module': false,
  };
  // 用来决定显示哪一种条件判定结果，是否选择了主机，是否选定了模块
  $scope.MshowBottomSuccess = {
    'hosts': false,
    'module': false
  };
  // 切换右侧node显示，在主机列表页面和模块编辑器之间切换
  $scope.FshowRightNode = function(name){
    for (var key in $scope.MshowRightNode) {
      $scope.MshowRightNode[key] = (key === name)?true:false;
    };
  };
  // 监控rootScope中的script变量（一般是从helper或者其他页面触发），根据语言变更编辑器的样式，更新scriptid。
  $scope.$watch('Mscript', function(newValue, oldValue){
    if ($rootScope.Mscript) {
      $scope.MeditorOptions.script.mode = $rootScope.Mscript.script_lang;
      $scope.MscriptContent.scriptid = $rootScope.Mscript.script_id;
    };
  });
  // 监控是否选定了模块内容，变更判定状态和字段
  $scope.$watch('MmoduleSelected.content', function(newValue, oldValue){
    $scope.MshowBottomSuccess.module = (jQuery.isEmptyObject(newValue))?false:true;
  });
  // 监控是否选定了hosts内容，变更判定状态和字段
  $scope.$watchCollection('MhostsSelected',function(newValue, oldValue){
    $scope.MshowBottomSuccess.hosts = ($rootScope.MhostsSelected.length > 0)?true:false;
  });
  // 监控两个判定状态，主机和模块，都选定之后出现执行按钮
  $scope.$watchCollection('MshowBottomSuccess', function(newValue, oldValue){
    $scope.MshowGo = ($scope.MshowBottomSuccess.hosts == true && $scope.MshowBottomSuccess.module == true)?true:false;
  });
  // 监控walker结果信息，如果成功更新了状态(ok/change/failed/unreachable/skipped)，则停止轮询
  $scope.$watchCollection('Mresult', function(newValue, oldValue){
    if (!jQuery.isEmptyObject(newValue)) {
      for (var node in newValue) {
        if (newValue[node].sum_ok || newValue[node].sum_changed || newValue[node].sum_failures || newValue[node].sum_unreachable || newValue[node].sum_skipped) {
          $scope.FstopInfoWalker();
          $scope.MshowLoading = false;
          break;
        }
      }
    };
  });

});

// --------------------------Module Helper---------------------------
promise.controller('CmoduleHelper', function($scope, $rootScope){
  // pre-init
  $rootScope.MshowHelperNode = {
    'shell': false,
    'script': false
  };

  // action
  $scope.FselectScript = function(Vscript){
    $rootScope.Mscript = Vscript;
  };
});
