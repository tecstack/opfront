var helloworldApp = angular.module('helloworldApp');

helloworldApp.directive('edit',function(){
	return{
		restrict: 'E',
		require: 'ngModel',
		link: function(scope,element,attrs,ngModel){
			element.bind("click",function(){
				var id = ngModel.$modelValue.id;
				scope.$apply(function(){
					angular.copy(ngModel.$modelValue,scope.master)
					// console.log(scope.master);
				});
				var obj = $("#"+id);
				obj.removeClass("inactive");
				obj.addClass("active");
				obj.removeAttr("readOnly");
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
				var id = ngModel.$modelValue.id;
				scope.$apply(function(){
					angular.copy(ngModel.$modelValue,scope.master)
					alert("Updated:"+scope.master.name);
				});				
				var obj = $("#"+id);
				obj.removeClass("active");
				obj.addClass("inactive");
				obj.attr("readOnly",true);
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
				var id = ngModel.$modelValue.id;
				var obj = $("#"+id);
				obj.removeClass("active");
				obj.addClass("inactive");
				obj.prop("readOnly",true);
				scope.$apply(function(){
					scope.showEdit = true;
				})				
			})
		}
	}
});

// app.directive("delete",function($document){
//   return{
//     restrict:'AE',
//     require: 'ngModel',
//     link:function(scope, element, attrs,ngModel){
//       element.bind("click",function(){
//         var id = ngModel.$modelValue.id;
//         alert("delete item where employee id:=" + id);
//         scope.$apply(function(){
//           for(var i=0; i<scope.employees.length; i++){
//             if(scope.employees[i].id==id){
//                console.log(scope.employees[i])
//                scope.employees.splice(i,1);
//             }
//           }
//           console.log(scope.employees);
//         })
//       })
//     }
//   }
// });

// helloworldApp.directive('',function(){
// 	return{
// 		restrict: 'E',
// 		link: function(scope,element,attrs,ngModel){
// 			element.bind("",function(){

// 			})
// 		}
// 	}
// });