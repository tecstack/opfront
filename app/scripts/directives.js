/*jshint jquery: true, unused: false, undef:false*/
'use strict';

var promise = angular.module('promise');

// sidebarNode 切换
promise.directive('sidebarNode',function(){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
			element.children().first().bind({
				'mouseenter': function(){
					element.siblings().children('.sidebarSubnode').removeClass('show');
					element.children('.sidebarSubnode').addClass('show');
				}
			});
		}
	};
});
// sidebar 隐藏
promise.directive('dashboard',function($rootScope){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
			element.bind({
				'mouseenter': function(){
					$rootScope.MshowMenu = false;
					scope.$apply();
				}
			});
		}
	};
});
// script项，操作控制指令
promise.directive('scriptNode',function($rootScope){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
			scope.MshowAction = true;
			// 删除键，点击后提示用户确认
			element.find('.delete').bind({
				'click': function(){
					scope.MshowAction = false;
					scope.$apply();
				}
			});
			// 确认删除
			element.find('.confirm').bind({
				'click': function(){
					scope.MshowAction = true;
					scope.$apply();
				}
			});
			// 取消删除
			element.find('.cancel').bind({
				'click': function(){
					scope.MshowAction = true;
					scope.$apply();
				}
			});
		}
	};
});
// progressBar
promise.directive('progressbar',function(){
	return{
		restrict: 'C',
		replace: true,
		scope: {
			option: '=option'
		},
		templateUrl: 'views/directives/progressBar.html',
		link: function(scope,element,attrs){
			scope.$watchCollection('option', function(){
				scope.rate = parseFloat(scope.option.current)/parseFloat(scope.option.max)*100 + '%';
			});
		}
	};
});
// ng-table
promise.directive('ngTable',function($filter){
	return{
		restrict: 'E',
		scope: {
			Mth: '=th',
			Mdata: '=data',
			Fselect: '=select',
			FunSelect: '=unselect',
			FdbClick: '=dbclick',
		},
		templateUrl: 'views/directives/ng-table.html',
		link: function(scope, element, attrs){
			// showdatas
			scope.Mpp = 100;
			scope.Mpage = 1;
			scope.FinitData = function(){
				scope.MfilterDatas = $filter('filter')(scope.Mdata, scope.Mfil);
			};
			scope.FinitShow = function(){
				if (scope.MfilterDatas.length && scope.Mpp){
					scope.Mpages = Math.ceil(parseFloat(scope.MfilterDatas.length)/parseFloat(scope.Mpp));
				} else if (scope.MfilterDatas.length === 0){
					scope.Mpages = 0;
				} else if (scope.Mpp === 0){
					scope.Mpages = 1;
				}
				if (scope.Mpage > scope.Mpages && scope.Mpage !== 1){
					scope.Mpage = scope.Mpages;
				} else if (scope.Mpage < 0){
					scope.Mpage = 0;
				}
				scope.MshowDatas = scope.MfilterDatas.slice(scope.Mpp*(scope.Mpage-1),scope.Mpp*scope.Mpage);
			};
			scope.FchangePage = function(Vpage){
				scope.Mpage = Vpage;
			};

			// event binding
			scope.FcheckAll = function(Vstatus){
				for (var index in scope.MfilterDatas){
					if (scope.MfilterDatas.hasOwnProperty(index)){
						if (scope.MfilterDatas[index].select !== true && Vstatus === true) {
							if (scope.Fselect) {
								scope.Fselect(scope.MfilterDatas[index]);
							}
						} else if (scope.MfilterDatas[index].select === true && Vstatus === false) {
							if (scope.FunSelect) {
								scope.FunSelect(scope.MfilterDatas[index]);
							}
						}
						scope.MfilterDatas[index].select = Vstatus;
					}
				}
			};
			scope.FtrClick = function(Vnode){
				Vnode.select = (Vnode.select === undefined)?true:!Vnode.select;
				if (Vnode.select === true) {
					if (scope.Fselect) {
						scope.Fselect(Vnode);
					}
				} else if (Vnode.select === false) {
					if (scope.FunSelect) {
						scope.FunSelect(Vnode);
					}
				}
			};
			scope.FtrDbClick = function(Vnode){
				if (scope.FdbClick) {
					scope.FdbClick(Vnode);
				}
			};

			// init & watch
			scope.FinitData();
			scope.FinitShow();
			scope.$watch('Mfil', function(){
				scope.FinitData();
				scope.FinitShow();
			});
			scope.$watchGroup(['Mpp','Mpage'], function(){
				scope.FinitShow();
			});
			scope.$watchCollection('Mdata', function(){
				scope.FinitData();
				scope.FinitShow();
			});
		}
	};
});
// nameCard
promise.directive('nameCard',function(){
	return{
		restrict: 'E',
		scope: {
			MuserInfo: '=userinfo',
		},
		templateUrl: 'views/directives/name-card.html',
		link: function(scope, element, attrs){
			// showdatas
			// event binding
			// init & watch
		}
	};
});
// must option
promise.directive('must',function(){
	return{
		restrict: 'E',
		replace: true,
		template: '<span style="color:#FF3640; font-size: 20px;">*</span>',
	};
});
// roleNode
promise.directive('roleNode',function($rootScope){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
			scope.Mselected = false;
			element.bind({
				'click': function(){
					$(this).toggleClass('toolbarNodeSelected');
					scope.$apply();
				}
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
			var chartData = jQuery.parseJSON(attrs.data);
		  var myChart = new Chart(chartDom).Line(chartData);
		}
	};
});
// chartjs bar
promise.directive('chartBar',function(){
	var options = {
		scaleShowHorizontalLines: false,
	  scaleShowVerticalLines: false,
	};
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
			var chartDom = element.get(0).getContext('2d');
			var chartData = jQuery.parseJSON(attrs.data);
		  var myChart = new Chart(chartDom).Bar(chartData, options);
		}
	};
});
// chartjs radar
promise.directive('chartRadar',function(){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
			var chartDom = element.get(0).getContext('2d');
			var chartData = jQuery.parseJSON(attrs.data);
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
			var chartData = jQuery.parseJSON(attrs.data);
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
			var chartData = jQuery.parseJSON(attrs.data);
		  var myChart = new Chart(chartDom).Pie(chartData);
		}
	};
});
//












// promise.directive('edit',function(){
// 	return{
// 		restrict: 'E',
// 		require: 'ngModel',
// 		link: function(scope,element,attrs,ngModel){
// 			element.bind('click',function(){
// 				var id = ngModel.$modelValue.vm_id;
// 				var obj = $('#'+id);
//     			var tdsize = [];
//
// 				scope.$apply(function(){
// 					angular.copy(ngModel.$modelValue,scope.vm_infos_bak);
// 					obj.children('td').each(function(){
// 						var size = { width:$(this).children('clevertd').width(), height:$(this).height() };
// 						tdsize.push(size);
// 					});
// 					obj.find('td input').each(function(i){
// 						$(this).width(tdsize[i].width);
// 						$(this).height(tdsize[i].height);
// 					});
// 					scope.showEdit = false;
// 				});
// 			});
// 		}
// 	};
// });
//
// promise.directive('update',function(){
// 	return{
// 		restrict: 'E',
// 		require: 'ngModel',
// 		link: function(scope,element,attrs,ngModel){
// 			element.bind('click',function(){
// 				var id = ngModel.$modelValue.vm_id;
// 				var obj = $('#'+id);
//
// 				scope.$apply(function(){
// 					angular.copy(ngModel.$modelValue,scope.vm_infos_bak);
// 				});
//
// 				scope.$apply(function(){
// 					scope.showEdit = true;
// 				});
// 			});
// 		}
// 	};
// });

// promise.directive('',function(){
// 	return{
// 		restrict: 'E',
// 		link: function(scope,element,attrs,ngModel){
// 			element.bind('',function(){

// 			})
// 		}
// 	}
// });
