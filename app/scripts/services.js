'use strict';

var helloworldApp = angular.module('helloworldApp');

helloworldApp.factory('SuserService', function($resource){
	// var url = 'http://localhost:5000';
	var url = 'http://192.168.86.23:5000';
	var ver = 'v0.0';

	return {
		// FsignIn: function(token) {
		// 	var signInRestApi = $resource(url+'/api/'+ver+'/tokens/:username', {}, {
		// 		'get': {method:'GET', headers: {'Authorization': token}},
		// 		// 'save': {method:'POST', headers: {'Authorization': 'Token token='xxxxxxxxx ''}}
		// 	});
		// 	return signInRestApi;
		// },
		FsignIn: function() {
			var signInRestApi = $resource(url+'/api/'+ver+'/user/login', {}, {
				'post': {method:'POST', isArray:false}
			});
			return signInRestApi;
		},
		FsignUp: function() {},
		FtokenAuth: function() {
			var tokenAuthRestApi = $resource(url+'/api/'+ver+'/user/tokenauth', {}, {
				'post': {method:'POST', isArray:false}
			});
			return tokenAuthRestApi;
		}
	};

});

helloworldApp.factory('SvmInfos', function($resource){
	var url = 'http://localhost:5000';
	var ver = 'v0.0';
	var vmInfosRestApi = $resource(url+'/api/'+ver+'/vminfos/:vmid', {}, {
		// 'get': {method:'GET', headers: {'Authorization': 'Token token='xxxxxxxxx ''}},
		'update': {method:'PUT', isArray:false }
	});
	return vmInfosRestApi;
});

helloworldApp.factory('SvmHelpInfo', function($resource){
	var url = 'http://localhost:5000';
	var ver = 'v0.0';
	var vmInfosRestApi = $resource(url+'/api/'+ver+'/vminfos/help/:vmid', {}, {

	});
	return vmInfosRestApi;
});
