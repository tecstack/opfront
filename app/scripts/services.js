/*jshint jquery: true, unused: false, undef:false*/
'use strict';

var promise = angular.module('promise');
var VbaseUrl = 'http://192.168.182.3';
var Vversion = 'v0.0';
var timeout = 30000;

promise.factory('SdelayService', function($rootScope, $interval, SinfoService){
	var Fdelay = function(){
		var now = new Date();
		$rootScope.Mexpire = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()+1, now.getMinutes()+45, now.getSeconds()+25);
	};
	var FstartInterval = function(){
		$rootScope.MexpirePromise = $interval(
	    function(){
	      var date = new Date();
	      if (date > $rootScope.Mexpire) {
					SinfoService.FaddInfo('长时间未操作，已超时');
					$rootScope.MisSign = false;
					$rootScope.MuserInfo = {
						'username': $rootScope.Mself.username,
						'password': ''
					};
					$rootScope.MsignErrorInfos = "长时间未操作，请重新登录";
					$rootScope.MsignError = true;
					FstopInterval();
	      } else {
					$rootScope.FcookieAuth();
	      }
	    },
			// 1h50m
	    6600000
	  );
	};
	var FstopInterval = function(){
		$interval.cancel($rootScope.MexpirePromise);
	};
	return {
		'Fdelay': Fdelay,
		'FstartInterval': FstartInterval,
		'FstopInterval': FstopInterval,
	};
});

promise.factory('SinfoService', function($rootScope, $timeout){
	var FaddInfo = function(Vinfo){
		$rootScope.Minfos.push(Vinfo);
		$timeout(
	    function(){
	      $rootScope.Minfos.splice($rootScope.Minfos.indexOf(Vinfo), 1);
	    },
	    3000
	  );
	};
	return {
		'FaddInfo': FaddInfo,
	};
});

promise.factory('SuserService', function($rootScope, $resource, $cookies, SinfoService){
	var Vurl = VbaseUrl+'/api/'+Vversion+'/user/';
	var VtokenUrl = Vurl + 'token/';
	var VuserUrl = Vurl + 'user/';
	var VroleUrl = Vurl + 'role/';
	var VprivilegeUrl = Vurl + 'privilege/';

	// 根据参数返回当前时间滞后n小时的date object
	var FhoursExpire = function(Vnum){
		var now = new Date();
		var expire = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()+Vnum, now.getMinutes(), now.getSeconds());
		return {expires: expire};
	};
	// 更具参数返回当前时间滞后n天的date object
	var FdatesExpire = function(Vnum){
		var now = new Date();
		var expire = new Date(now.getFullYear(), now.getMonth(), now.getDate()+Vnum, now.getHours(), now.getMinutes(), now.getSeconds());
		return {expires: expire};
	};
	// ------------------------------------token--------------------------------------
	// 手动登录服务
	var FsignIn = function(VuserInfo, VisKeep){
		var VsignInApi = $resource(VtokenUrl, {}, {
			'post': {method:'POST', isArray:false, timeout:timeout, headers:{'Content-Type': 'application/json'}}
		});
		VuserInfo.granttype = 'login';
		VsignInApi.post(
			{},
			VuserInfo,
			function successCallback(callbackdata){
				// 存放refreshtoken
				if (VisKeep){
					// 用户勾选了保持登录状态,refreshtoken存入cookie,有效期2周
					$cookies.put('refreshtoken', callbackdata.refreshtoken, new FdatesExpire(7));
				}
				else {
					// 用户未勾选保持登录，refreshtoken存入rootScope
					// $rootScope.Mrefreshtoken = callbackdata.refreshtoken;
					// 用户未勾选保持登录，refreshtoken存入cookie,有效期2小时
					$cookies.put('refreshtoken', callbackdata.refreshtoken, new FhoursExpire(2));
				}
				// 存放token
				$cookies.put('token', callbackdata.token, new FhoursExpire(2));
				$rootScope.Mtoken = callbackdata.token;
				// 个人信息
				$rootScope.Mself = callbackdata.user_info;
				SinfoService.FaddInfo('Hi,' + $rootScope.Mself.username + ',欢迎使用Promise!');
				// 显示控制
				$rootScope.MisSign = true;
				$rootScope.MsignError = false;
				// 初始化数据
				$rootScope.FinitAction();
			},
			function errorCallback(callbackdata){
				if (!jQuery.isEmptyObject(callbackdata.data)) {
					$rootScope.MsignErrorInfos = callbackdata.data.message;
					$rootScope.MsignError = true;
				}
				$rootScope.MisSign = false;
				SinfoService.FaddInfo('登录失败');
			}
		);
	};

	// 手动登出服务
	var FsignOut = function() {
		$rootScope.MuserInfo = {};
    $cookies.remove('token');
    $cookies.remove('refreshtoken');
    $rootScope.MisSign = false;
		SinfoService.FaddInfo('已登出，欢迎再次使用Promise');
	};
	// token自动登录服务
	var FtokenSignIn = function() {
		var Vtoken = $cookies.get('token');
		if (Vtoken) {
			var VtokenSignInApi = $resource(VtokenUrl, {}, {
				'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken}}
			});
			VtokenSignInApi.get(
	      {},
	      function successCallback(callbackdata){
	        $rootScope.MisSign = true;
	        $rootScope.MsignError = false;
					$rootScope.Mtoken = Vtoken;
					// 个人信息
					$rootScope.Mself = callbackdata.user_info;
					SinfoService.FaddInfo('Hi,' + $rootScope.Mself.username + ',欢迎使用Promise!');
					// 初始化数据
					$rootScope.FinitAction();
	      },
	      function errorCallback(callbackdata){
					if (!jQuery.isEmptyObject(callbackdata.data)) {
						$rootScope.MsignErrorInfos = callbackdata.data.message;
						$rootScope.MsignError = true;
					}
	        $rootScope.MisSign = false;
					SinfoService.FaddInfo('自动登录失败，请手动登录');
	      }
	    );
		} else {
			$rootScope.MisSign = false;
			SinfoService.FaddInfo('欢迎来到Promise,请登录');
		}
	};

	// token刷新服务(包含一次自动登录)
	var FtokenRefresh = function() {
		var Vrefreshtoken = $cookies.get('refreshtoken');
		if (Vrefreshtoken) {
			var VtokenRefreshApi = $resource(VtokenUrl, {}, {
				'post': {method:'POST', isArray:false, timeout:timeout, headers:{'Content-Type': 'application/json'}}
			});
			VtokenRefreshApi.post(
	      {},
	      {'granttype': 'refreshtoken', 'refreshtoken': Vrefreshtoken},
	      function successCallback(callbackdata){
					$cookies.put('token', callbackdata.token, new FhoursExpire(2));
	        new FtokenSignIn();
	      },
	      function errorCallback(callbackdata){
					if (!jQuery.isEmptyObject(callbackdata.data)) {
						$rootScope.MsignErrorInfos = callbackdata.data.message;
						$rootScope.MsignError = true;
					}
	        $rootScope.MisSign = false;
					SinfoService.FaddInfo('自动延期失败，请联系管理员');
	      }
	    );
		} else {
			$rootScope.MisSign = false;
			SinfoService.FaddInfo('欢迎来到Promise,请登录');
		}
	};

	// ------------------------------------user--------------------------------------
	var FgetUserList = function(Vtoken) {
		var VrestApi = $resource(VuserUrl, {}, {
			'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
		});
		return VrestApi;
	};
	var FcreateUser = function(Vtoken) {
		var VrestApi = $resource(VuserUrl, {}, {
			'post': {method:'POST', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Content-Type': 'application/json'}}
		});
		return VrestApi;
	};
	var FdeleteUser = function(Vtoken) {
		var VrestApi = $resource(VuserUrl, {}, {
			'delete': {method:'DELETE', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Content-Type': 'application/json'}}
		});
		return VrestApi;
	};
	// ------------------------------------role--------------------------------------
	var FgetRoleList = function(Vtoken) {
		var VrestApi = $resource(VroleUrl, {}, {
			'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
		});
		return VrestApi;
	};
	var FcreateRole = function(Vtoken) {
		var VrestApi = $resource(VroleUrl, {}, {
			'post': {method:'POST', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Content-Type': 'application/json'}}
		});
		return VrestApi;
	};
	var FdeleteRole = function(Vtoken) {
		var VrestApi = $resource(VroleUrl, {}, {
			'delete': {method:'DELETE', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Content-Type': 'application/json'}}
		});
		return VrestApi;
	};
	// ------------------------------------privilege--------------------------------------
	var FgetPrivilegeList = function(Vtoken) {
		var VrestApi = $resource(VprivilegeUrl, {}, {
			'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
		});
		return VrestApi;
	};

	return {
		'FsignIn': FsignIn,
		'FsignOut': FsignOut,
		'FtokenSignIn': FtokenSignIn,
		'FtokenRefresh': FtokenRefresh,

		'FgetUserList': FgetUserList,
		'FcreateUser': FcreateUser,
		'FdeleteUser': FdeleteUser,

		'FgetRoleList': FgetRoleList,
		'FcreateRole': FcreateRole,
		'FdeleteRole': FdeleteRole,

		'FgetPrivilegeList': FgetPrivilegeList,
	};
});


promise.factory('ShostService', function($resource){
	var Vurl = VbaseUrl+'/api/'+Vversion+'/host/';

	return {
		'Fhost': function(Vtoken) {
			// $resource(url, [paramDefaults], [actions], options);
			var VhostRestApi = $resource(Vurl, {}, {
				'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VhostRestApi;
		},
		'FhostId': function(Vtoken, VhostId) {
			var VhostIdRestApi = $resource(Vurl+VhostId, {}, {
				'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VhostIdRestApi;
		},
	};
});

promise.factory('SscriptService', function($resource){
	var Vurl = VbaseUrl+'/api/'+Vversion+'/script/';

	return {
		'Fcreate': function(Vtoken) {
			// $resource(url, [paramDefaults], [actions], options);
			var VscriptRestApi = $resource(Vurl, {}, {
				'post': {method:'POST', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Content-Type': 'application/json'}}
			});
			return VscriptRestApi;
		},
		'Fget': function(Vtoken, VscriptId) {
			var VscriptRestApi = $resource(Vurl, {'script_id': VscriptId}, {
				'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VscriptRestApi;
		},
		'FgetList': function(Vtoken) {
			var VscriptRestApi = $resource(Vurl, {}, {
				'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VscriptRestApi;
		},
		'Fmodify': function(Vtoken, VscriptId) {
			var VscriptRestApi = $resource(Vurl, {'script_id': VscriptId}, {
				'put': {method:'PUT', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Content-Type': 'application/json'}}
			});
			return VscriptRestApi;
		},
		'Fdelete': function(Vtoken, VscriptId) {
			var VscriptRestApi = $resource(Vurl, {'script_id': VscriptId}, {
				'delete': {method:'DELETE', isArray:false, timeout:timeout, headers:{'token': Vtoken}}
			});
			return VscriptRestApi;
		},
	};
});

promise.factory('SwalkerService', function($resource){
	var Vurl = VbaseUrl+'/api/'+Vversion;

	return {
		'FcreateWalker': function(Vtoken, VmoduleName){
			// $resource(url, [paramDefaults], [actions], options);
			var VWalkerUrl = Vurl + '/' + VmoduleName + 'walker';
			var VwalkerRestApi = $resource(VWalkerUrl, {}, {
				'post': {method:'POST', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Content-Type': 'application/json'}}
			});
			return VwalkerRestApi;
		},
		'FqueryWalker': function(Vtoken, VmoduleName){
			var VWalkerUrl = Vurl + '/' + VmoduleName + 'walker';
			var VwalkerRestApi = $resource(VWalkerUrl, {}, {
				'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VwalkerRestApi;
		},
		'FinfoWalker': function(Vtoken, VmoduleName, VwalkerId){
			var VWalkerUrl = Vurl + '/' + VmoduleName + 'walker';
			var VwalkerRestApi = $resource(VWalkerUrl, {'walkerid': VwalkerId}, {
				'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VwalkerRestApi;
		},
	};
});
