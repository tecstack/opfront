var helloworldApp = angular.module('helloworldApp')

helloworldApp.factory('vmInfos',function($resource){
	var url = "http://localhost:5000";
	var ver = "v0.0";
	var vmInfosRestApi = $resource(url+"/api/"+ver+"/vminfos/:vmid", {},{} );

	return vmInfosRestApi;
});