'use strict';

var promise = angular.module('promise');

// New
// logo
promise.directive('logo',function(){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
			element.bind('click',function(){
				window.location.href='/';
			});
		}
	};
});
// sidebarNode 切换
promise.directive('sidebarNode',function(){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
			element.children().first().bind('click',function(){
				element.siblings().children(".sidebarSubnode").removeClass("show");
				element.children(".sidebarSubnode").toggleClass("show");
			});
		}
	};
});
// chartjs line
promise.directive('chartLine',function(){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
			var chartDom = element.get(0).getContext('2d');
			var chartData = jQuery.parseJSON(attrs.data)
		  var myChart = new Chart(chartDom).Line(chartData);
		}
	};
});
// chartjs bar
promise.directive('chartBar',function(){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
			var chartDom = element.get(0).getContext('2d');
			var chartData = jQuery.parseJSON(attrs.data)
		  var myChart = new Chart(chartDom).Bar(chartData);
		}
	};
});
// chartjs radar
promise.directive('chartRadar',function(){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
			var chartDom = element.get(0).getContext('2d');
			var chartData = jQuery.parseJSON(attrs.data)
		  var myChart = new Chart(chartDom).Radar(chartData);
		}
	};
});
// chartjs polar
promise.directive('chartPolar',function(){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
			var chartDom = element.get(0).getContext('2d');
			var chartData = jQuery.parseJSON(attrs.data)
		  var myChart = new Chart(chartDom).PolarArea(chartData);
		}
	};
});
// chartjs pie
promise.directive('chartPie',function(){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
			var chartDom = element.get(0).getContext('2d');
			var chartData = jQuery.parseJSON(attrs.data)
		  var myChart = new Chart(chartDom).Pie(chartData);
		}
	};
});
//












promise.directive('add',function(){
	return{
		restrict: 'E',
		link: function(scope,element,attrs,ngModel){
			element.bind('click',function(){
				scope.$apply(function(){
					scope.showAdd = false;
				});
			});
		}
	};
});

promise.directive('edit',function(){
	return{
		restrict: 'E',
		require: 'ngModel',
		link: function(scope,element,attrs,ngModel){
			element.bind('click',function(){
				var id = ngModel.$modelValue.vm_id;
				var obj = $('#'+id);
    			var tdsize = [];

				scope.$apply(function(){
					angular.copy(ngModel.$modelValue,scope.vm_infos_bak);
					obj.children('td').each(function(){
						var size = { width:$(this).children('clevertd').width(), height:$(this).height() };
						tdsize.push(size);
					});
					obj.find('td input').each(function(i){
						$(this).width(tdsize[i].width);
						$(this).height(tdsize[i].height);
					});
					scope.showEdit = false;
				});
			});
		}
	};
});

promise.directive('update',function(){
	return{
		restrict: 'E',
		require: 'ngModel',
		link: function(scope,element,attrs,ngModel){
			element.bind('click',function(){
				var id = ngModel.$modelValue.vm_id;
				var obj = $('#'+id);

				scope.$apply(function(){
					angular.copy(ngModel.$modelValue,scope.vm_infos_bak);
				});

				scope.$apply(function(){
					scope.showEdit = true;
				});
			});
		}
	};
});

promise.directive('cancel',function(){
	return{
		restrict: 'E',
		require: 'ngModel',
		link: function(scope,element,attrs,ngModel){
			element.bind('click',function(){
				var id = ngModel.$modelValue.vm_id;
				var obj = $('#'+id);

				scope.$apply(function(){
					angular.copy(scope.vm_infos_bak,ngModel.$modelValue);
				});

				scope.$apply(function(){
					scope.showEdit = true;
				});
			});
		}
	};
});

promise.directive('delete',function(){
	return{
		restrict:'E',
		require: 'ngModel',
		link:function(scope,element,attrs,ngModel,vmInfos){
			element.bind('click',function(){
				var id = ngModel.$modelValue.vm_id;

				console.log('delete item where vm_id:'+id);

				scope.$apply(function(){
				});
			});
		}
	};
});

// promise.directive('',function(){
// 	return{
// 		restrict: 'E',
// 		link: function(scope,element,attrs,ngModel){
// 			element.bind('',function(){

// 			})
// 		}
// 	}
// });

// obj.prevAll().removeAttr('contentEditable').removeClass('b-a');
// obj.nextAll().removeAttr('contentEditable').removeClass('b-a');
