'use strict';

var promise = angular.module('promise');

promise.directive('sidebarTrigger',function(){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
      element.bind({
        mouseenter: function(){
          $('.sidebar').animate({left: '0'}, 100);
        }
      });
		}
	};
});
promise.directive('sidebar',function(){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
      element.bind({
        // mouseenter: function(){
        //   $(this).animate({left: '0'}, 100);
        // },
        mouseleave: function(){
          $(this).animate({left: '-15%'}, 100);
        }
      });
		}
	};
});

promise.animation('.helper',function(){
  return{
    addClass: function(element){
			// hide
      element.animate({'opacity': '0', 'right': '-25%'}, 100);
    },
    removeClass: function(element){
			// show
      element.animate({'opacity': '1', 'right': '2%'}, 100);
    }
  };
});
// 下面的调用方法要求目标必须是指定的几种directive，其它自定义的元素需要通过$animate完成复杂的注入工作

//
// promise.animation('.sidebar',function(){
//   return{
//     enter: function(element){
//       console.log('enter!');
//       element.animate({left: 0}, 1000);
//     },
//     leave: function(){
//
//     }
//   };
// });
