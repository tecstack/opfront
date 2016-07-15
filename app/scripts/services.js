'use strict';

var promise = angular.module('promise');

promise.factory('SuserService', function($resource){
	// angularjs service-factory SuserService: signin/tokensignin/tokenrefresh/

	var VbaseUrl = 'http://192.168.182.3';
	// var VbaseUrl = 'http://localhost:5000';
	var Vversion = 'v0.0';
	var VuserUrl = VbaseUrl+'/api/'+Vversion+'/user/';

	return {
		// FsignIn: function(token) {
		// 	var signInRestApi = $resource(url+'/api/'+ver+'/tokens/:username', {}, {
		// 		'get': {method:'GET', headers: {'Authorization': token}},
		// 		// 'save': {method:'POST', headers: {'Authorization': 'Token token='xxxxxxxxx ''}}
		// 	});
		// 	return signInRestApi;
		// },
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

promise.factory('SvmHelpInfo', function($resource){
	var url = 'http://localhost:5000';
	var ver = 'v0.0';
	var vmInfosRestApi = $resource(url+'/api/'+ver+'/vminfos/help/:vmid', {}, {

	});
	return vmInfosRestApi;
});
