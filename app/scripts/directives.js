var helloworldApp = angular.module('helloworldApp');

helloworldApp.directive('add',function(){
	return{
		restrict: 'E',
		link: function(scope,element,attrs,ngModel){
			element.bind("click",function(){
				scope.$apply(function(){
					scope.showAdd = false;
				});
			});
		}
	}
});

helloworldApp.directive('edit',function(){
	return{
		restrict: 'E',
		require: 'ngModel',
		link: function(scope,element,attrs,ngModel){
			element.bind("click",function(){
				var id = ngModel.$modelValue.vm_id;
				var obj = $("#"+id);
    			var tdsize = [];

				scope.$apply(function(){
					angular.copy(ngModel.$modelValue,scope.rowBak);
					obj.children("td").each(function(){
						var size = { width:$(this).children("clevertd").width(), height:$(this).height() }
						tdsize.push(size);
					});
					obj.find("td input").each(function(i){
						$(this).width(tdsize[i].width);
						$(this).height(tdsize[i].height);
					});
					scope.showEdit = false;
				});
			})
		}
	}
});

helloworldApp.directive('update',function(){
	return{
		restrict: 'E',
		require: 'ngModel',
		link: function(scope,element,attrs,ngModel){
			element.bind("click",function(){
				var id = ngModel.$modelValue.vm_id;
				var obj = $("#"+id);

				scope.$apply(function(){
					angular.copy(ngModel.$modelValue,scope.rowBak);
				});				

				scope.$apply(function(){
					scope.showEdit = true;
				})
			})
		}
	}
});

helloworldApp.directive('cancel',function(){
	return{
		restrict: 'E',
		require: 'ngModel',
		link: function(scope,element,attrs,ngModel){
			element.bind("click",function(){
				var id = ngModel.$modelValue.vm_id;
				var obj = $("#"+id);

				scope.$apply(function(){
					angular.copy(scope.rowBak,ngModel.$modelValue);
				});

				scope.$apply(function(){
					scope.showEdit = true;
				})				
			})
		}
	}
});

helloworldApp.directive("delete",function(){
	return{
		restrict:'E',
		require: 'ngModel',
		link:function(scope,element,attrs,ngModel,vmInfos){
			element.bind("click",function(){
				var id = ngModel.$modelValue.vm_id;

				console.log("delete item where vm_id:"+id);

				scope.$apply(function(){

					// for(var i=0; i<scope.vminfos.length; i++){
					// 	if(scope.vminfos[i].vm_id==id){
					// 		console.log(scope.vminfos[i])
					// 		scope.vminfos.splice(i,1);
					// 	}
					// }
				})
			})
		}
	}
});

// helloworldApp.directive('',function(){
// 	return{
// 		restrict: 'E',
// 		link: function(scope,element,attrs,ngModel){
// 			element.bind("",function(){

// 			})
// 		}
// 	}
// });
				// obj.prevAll().removeAttr("contentEditable").removeClass("b-a");
				// obj.nextAll().removeAttr("contentEditable").removeClass("b-a");