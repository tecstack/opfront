'use strict';

var promise = angular.module('promise');
var timeout = 30000;
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
		FaddInfo: FaddInfo,
	};
});

promise.factory('SuserService', function($rootScope, $resource, $cookies, SinfoService){
	var VbaseUrl = 'http://192.168.182.3';
	var Vversion = 'v0.0';
	var VuserUrl = VbaseUrl+'/api/'+Vversion+'/user/';

	// 初始化动作，在登录成功后执行
	var FinitAction = function(){
		SinfoService.FaddInfo('初始化....');
		$rootScope.FgetHost();
		$rootScope.FgetScriptList();
	};

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
	// 手动登录服务
	var FsignIn = function(VuserInfo, VisKeep){
		var VsignInApi = $resource(VuserUrl+'login', {}, {
			'post': {method:'POST', isArray:false, timeout:timeout, headers:{'Content-Type': 'application/json'}}
		});
		VsignInApi.post(
			{},
			VuserInfo,
			function successCallback(callbackdata){
				// 存放rftoken
				if (VisKeep){
					// 用户勾选了保持登录状态,rftoken存入cookie
					$cookies.put('rftoken', callbackdata.rftoken, FdatesExpire(14));
					SinfoService.FaddInfo('已成功登陆,有效期两周');
				}
				else {
					// 用户未勾选保持登录，rftoken存入rootScope
					$rootScope.Mrftoken = callbackdata.rftoken;
					SinfoService.FaddInfo('已成功登陆');
				}
				// 存放token
				$cookies.put('token', callbackdata.token, FhoursExpire(2));
				$rootScope.Mtoken = callbackdata.token;
				// 显示控制
				$rootScope.MisSign = true;
				$rootScope.MsignError = false;
				// 初始化数据
				FinitAction();
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
    $cookies.remove('rftoken');
    $rootScope.MisSign = false;
		SinfoService.FaddInfo('已登出，欢迎再次使用Promise');
	};
	// token自动登录服务
	var FtokenSignIn = function() {
		var Vtoken = $cookies.get('token');
		if (Vtoken) {
			var VtokenSignInApi = $resource(VuserUrl+'tokenauth', {}, {
				'post': {method:'POST', isArray:false, timeout:timeout, headers:{'Content-Type': 'application/json', 'token': Vtoken}}
			});
			VtokenSignInApi.post(
	      {},
	      {},
	      function successCallback(callbackdata){
	        $rootScope.MisSign = true;
	        $rootScope.MsignError = false;
					$rootScope.Mtoken = Vtoken;
					SinfoService.FaddInfo('自动登录成功');
					// 初始化数据
					FinitAction();
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
		};
	};
	// token刷新服务(包含一次自动登录)
	var FtokenRefresh = function() {
		var Vrftoken = $cookies.get('rftoken');
		if (Vrftoken) {
			var VtokenRefreshApi = $resource(VuserUrl+'tokenrefresh', {}, {
				'post': {method:'POST', isArray:false, timeout:timeout, headers:{'Content-Type': 'application/json'}}
			});
			VtokenRefreshApi.post(
	      {},
	      {'granttype': 'refreshtoken', 'refreshtoken': Vrftoken},
	      function successCallback(callbackdata){
					$cookies.put('token', callbackdata.token, FhoursExpire(2));
	        FtokenSignIn();
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
		};
	};

	return {
		FsignIn: FsignIn,
		FsignOut: FsignOut,
		FtokenSignIn: FtokenSignIn,
		FtokenRefresh: FtokenRefresh
	};
});


promise.factory('ShostService', function($resource){
	var VbaseUrl = 'http://192.168.182.3';
	var Vversion = 'v0.0';
	var VuserUrl = VbaseUrl+'/api/'+Vversion+'/host/';

	return {
		Fhost: function(Vtoken) {
			// $resource(url, [paramDefaults], [actions], options);
			var VhostRestApi = $resource(VuserUrl, {}, {
				'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VhostRestApi;
		},
		FhostId: function(Vtoken, VhostId) {
			var VhostIdRestApi = $resource(VuserUrl+VhostId, {}, {
				'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VhostIdRestApi;
		},
	};
});

promise.factory('SscriptService', function($resource){
	var VbaseUrl = 'http://192.168.182.3';
	// var VbaseUrl = 'http://localhost:timeout';
	var Vversion = 'v0.0';
	var VuserUrl = VbaseUrl+'/api/'+Vversion+'/script/';

	return {
		Fcreate: function(Vtoken) {
			// $resource(url, [paramDefaults], [actions], options);
			var VscriptRestApi = $resource(VuserUrl, {}, {
				'post': {method:'POST', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Content-Type': 'application/json'}}
			});
			return VscriptRestApi;
		},
		Fget: function(Vtoken, VscriptId) {
			var VscriptRestApi = $resource(VuserUrl, {'script_id': VscriptId}, {
				'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VscriptRestApi;
		},
		FgetList: function(Vtoken) {
			var VscriptRestApi = $resource(VuserUrl, {}, {
				'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VscriptRestApi;
		},
		Fmodify: function(Vtoken, VscriptId) {
			var VscriptRestApi = $resource(VuserUrl, {'script_id': VscriptId}, {
				'put': {method:'PUT', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Content-Type': 'application/json'}}
			});
			return VscriptRestApi;
		},
		Fdelete: function(Vtoken, VscriptId) {
			var VscriptRestApi = $resource(VuserUrl, {'script_id': VscriptId}, {
				'delete': {method:'DELETE', isArray:false, timeout:timeout, headers:{'token': Vtoken}}
			});
			return VscriptRestApi;
		},
	};
});

promise.factory('SwalkerService', function($resource){
	var VbaseUrl = 'http://192.168.182.3';
	// var VbaseUrl = 'http://localhost:timeout';
	var Vversion = 'v0.0';
	var VuserUrl = VbaseUrl+'/api/'+Vversion;

	return {
		FcreateWalker: function(Vtoken, VmoduleName){
			// $resource(url, [paramDefaults], [actions], options);
			var Vurl = VuserUrl + '/' + VmoduleName + 'walker';
			var VwalkerRestApi = $resource(Vurl, {}, {
				'post': {method:'POST', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Content-Type': 'application/json'}}
			});
			return VwalkerRestApi;
		},
		FqueryWalker: function(Vtoken, VmoduleName){
			var Vurl = VuserUrl + '/' + VmoduleName + 'walker';
			var VwalkerRestApi = $resource(Vurl, {}, {
				'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VwalkerRestApi;
		},
		FinfoWalker: function(Vtoken, VmoduleName, VwalkerId){
			var Vurl = VuserUrl + '/' + VmoduleName + 'walker';
			var VwalkerRestApi = $resource(Vurl, {'walkerid': VwalkerId}, {
				'get': {method:'GET', isArray:false, timeout:timeout, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VwalkerRestApi;
		},
	};
});
