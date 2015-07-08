var helloworldApp = angular.module('helloworldApp');

helloworldApp.directive('edit',function(){
	return{
		restrict: 'E',
		require: 'ngModel',
		link: function(scope,element,attrs,ngModel){
			element.bind("click",function(){
				var id = ngModel.$modelValue.vm_id;
				scope.$apply(function(){
					angular.copy(ngModel.$modelValue,scope.master);

					console.log("master:");
					console.log(scope.master);

				});
				var obj = $("#"+id);
				obj.prevAll().prop("contentEditable",true).addClass("b-a");
				obj.nextAll().prop("contentEditable",true).addClass("b-a");
				obj.prev().focus();
				scope.$apply(function(){
					scope.showEdit = false;
				})
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
				scope.$apply(function(){
					angular.copy(ngModel.$modelValue,scope.master);

					console.log("master:");
					console.log(scope.master);
					console.log("ngmodel:");
					console.log(ngModel.$modelValue);

				});				
				var obj = $("#"+id);
				obj.prevAll().removeAttr("contentEditable").removeClass("b-a");
				obj.nextAll().removeAttr("contentEditable").removeClass("b-a");
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
				scope.$apply(function(){
					angular.copy(scope.master,ngModel.$modelValue);
				});
				var id = ngModel.$modelValue.vm_id;
				var obj = $("#"+id);
				obj.prevAll().removeAttr("contentEditable").removeClass("b-a");
				obj.nextAll().removeAttr("contentEditable").removeClass("b-a");
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
		link:function(scope, element, attrs,ngModel){
			element.bind("click",function(){
				var id = ngModel.$modelValue.vm_id;

				console.log("delete item where vm_id:");
				console.log(id);

				scope.$apply(function(){
					for(var i=0; i<scope.vminfos.length; i++){
						if(scope.vminfos[i].vm_id==id){
							console.log(scope.vminfos[i])
							scope.vminfos.splice(i,1);
						}
					}
					console.log(scope.vminfos);
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