'use strict';

var promise = angular.module('promise');

promise.factory('SuserService', function($resource){
	// angularjs service-factory SuserService: signin/tokensignin/tokenrefresh/

	var VbaseUrl = 'http://192.168.182.3';
	// var VbaseUrl = 'http://localhost:5000';
	var Vversion = 'v0.0';
	var VuserUrl = VbaseUrl+'/api/'+Vversion+'/user/';

	return {
		FsignIn: function() {
			// $resource(url, [paramDefaults], [actions], options);
			var VsignInRestApi = $resource(VuserUrl+'login', {}, {
				'post': {method:'POST', isArray:false, timeout:5000, headers:{'Content-Type': 'application/json'}}
			});
			return VsignInRestApi;
		},
		FtokenSignIn: function(Vtoken) {
			var VtokenSignInRestApi = $resource(VuserUrl+'tokenauth', {}, {
				'post': {method:'POST', isArray:false, timeout:5000, headers:{'Content-Type': 'application/json', 'token': Vtoken}}
			});
			return VtokenSignInRestApi;
		},
		FtokenRefresh: function() {
			var VtokenRefreshRestApi = $resource(VuserUrl+'tokenrefresh', {}, {
				'post': {method:'POST', isArray:false, timeout:5000, headers:{'Content-Type': 'application/json'}}
			});
			return VtokenRefreshRestApi;
		},
		FsignUp: function() {
			var VsignUpRestApi = $resource(VuserUrl+'signup', {}, {
				'post': {method:'POST', isArray:false, timeout:5000}
			});
			return VsignUpRestApi;
		}
	};

});

promise.factory('ShostService', function($resource){
	var VbaseUrl = 'http://192.168.182.3';
	// var VbaseUrl = 'http://localhost:5000';
	var Vversion = 'v0.0';
	var VuserUrl = VbaseUrl+'/api/'+Vversion+'/host/';

	return {
		Fhost: function(Vtoken) {
			// $resource(url, [paramDefaults], [actions], options);
			var VhostRestApi = $resource(VuserUrl, {}, {
				'get': {method:'GET', isArray:false, timeout:5000, headers:{'token': Vtoken}}
			});
			return VhostRestApi;
		},
		FhostId: function(Vtoken, VhostId) {
			var VhostIdRestApi = $resource(VuserUrl+VhostId, {}, {
				'get': {method:'GET', isArray:false, timeout:5000, headers:{'token': Vtoken}}
			});
			return VhostIdRestApi;
		},
	};
});

promise.factory('SscriptService', function($resource){
	var VbaseUrl = 'http://192.168.182.3';
	// var VbaseUrl = 'http://localhost:5000';
	var Vversion = 'v0.0';
	var VuserUrl = VbaseUrl+'/api/'+Vversion+'/script/';

	return {
		Fcreate: function(Vtoken) {
			// $resource(url, [paramDefaults], [actions], options);
			var VscriptRestApi = $resource(VuserUrl, {}, {
				'post': {method:'POST', isArray:false, timeout:5000, headers:{'token': Vtoken, 'Content-Type': 'application/json'}}
			});
			return VscriptRestApi;
		},
		Fget: function(Vtoken, VscriptId) {
			var VscriptRestApi = $resource(VuserUrl, {'script_id': VscriptId}, {
				'get': {method:'GET', isArray:false, timeout:5000, headers:{'token': Vtoken}}
			});
			return VscriptRestApi;
		},
		FgetList: function(Vtoken) {
			var VscriptRestApi = $resource(VuserUrl, {}, {
				'get': {method:'GET', isArray:false, timeout:5000, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VscriptRestApi;
		},
		Fmodify: function(Vtoken, VscriptId) {
			var VscriptRestApi = $resource(VuserUrl, {'script_id': VscriptId}, {
				'put': {method:'PUT', isArray:false, timeout:5000, headers:{'token': Vtoken, 'Content-Type': 'application/json'}}
			});
			return VscriptRestApi;
		},
	};
});

promise.factory('SwalkerService', function($resource){
	var VbaseUrl = 'http://192.168.182.3';
	// var VbaseUrl = 'http://localhost:5000';
	var Vversion = 'v0.0';
	var VuserUrl = VbaseUrl+'/api/'+Vversion;

	return {
		FcreateWalker: function(Vtoken, VmoduleName){
			// $resource(url, [paramDefaults], [actions], options);
			var Vurl = VuserUrl + '/' + VmoduleName + 'walker';
			var VwalkerRestApi = $resource(Vurl, {}, {
				'post': {method:'POST', isArray:false, timeout:5000, headers:{'token': Vtoken, 'Content-Type': 'application/json'}}
			});
			return VwalkerRestApi;
		},
		FqueryWalker: function(Vtoken, VmoduleName){
			var Vurl = VuserUrl + '/' + VmoduleName + 'walker';
			var VwalkerRestApi = $resource(Vurl, {}, {
				'get': {method:'GET', isArray:false, timeout:5000, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VwalkerRestApi;
		},
		FinfoWalker: function(Vtoken, VmoduleName, VwalkerId){
			var Vurl = VuserUrl + '/' + VmoduleName + 'walker';
			var VwalkerRestApi = $resource(Vurl, {'walkerid': VwalkerId}, {
				'get': {method:'GET', isArray:false, timeout:5000, headers:{'token': Vtoken, 'Cache-Control': 'max-age=0'}}
			});
			return VwalkerRestApi;
		},
	};
});
