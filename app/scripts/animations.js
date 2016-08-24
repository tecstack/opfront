/*jshint jquery: true, unused: false, undef:false*/
'use strict';

var promise = angular.module('promise');

promise.animation('.signBg', function(){
  return{
    addClass: function(element){
      // hide
      element.animate(
        {'opacity': '0'},
        300,
        function(){
          $(this).css('display', 'none');
        }
      );
    },
    removeClass: function(element){
      // show
      element.css('display', 'block');
      element.animate({'opacity': '1'}, 300);
    }
  };
});

promise.animation('.sidebar', function(){
  return{
    addClass: function(element){
      // hide
      element.animate(
        {'opacity': '0', 'left': '-100%'},
        100,
        function(){
          $(this).css('display', 'none');
        }
      );
    },
    removeClass: function(element){
      // show
      element.css('display', 'block');
      element.animate({'opacity': '1', 'left': '0px'}, 100);
    }
  };
});

promise.animation('.infoNode', function(){
  return{
    leave: function(element){
      element.animate(
        {
          'opacity': '0',
          'margin': '0',
          'padding': '0',
          'font-size': '0',
          'line-height': '0',
        },
        150,
        function(){
          $(this).css('display', 'none');
        }
      );
    },
    enter: function(element){
      element.css({
        'opacity': '0',
        'margin': '0',
        'padding': '0',
        'font-size': '0',
        'line-height': '0',
      });
      element.animate(
        {
          'opacity': '1',
          'margin': '5px 0',
          'padding': '10px',
          'font-size': '18px',
          'line-height': '20px',
        },
        400
      );
    }
  };
});

promise.animation('.dashboardMask', function(){
  return{
    addClass: function(element){
      element.animate(
        {'opacity': '0'},
        300,
        function(){
          $(this).css({'display': 'none'});
        }
      );
    },
    removeClass: function(element){
      element.css({
        'display': 'block',
        'opacity': '0',
      });
      element.animate({'opacity': '1'}, 300);
    }
  };
});

promise.animation('.helper', function(){
  return{
    addClass: function(element){
      element.animate({'opacity': '0', 'right': '-360px'}, 100);
    },
    removeClass: function(element){
      element.css({
        'right': '-360px',
        'opacity': '0',
      });
      element.animate({'opacity': '1', 'right': '0px'}, 100);
    }
  };
});

promise.directive('label',function(){
	return{
		restrict: 'C',
		link: function(scope,element,attrs){
      element.children('div').bind({
        click: function(e){
          e.stopPropagation();
        }
      });
      element.bind({
        click: function(e){
          element.children('div').toggle(100);
        }
      });
		}
	};
});

promise.animation('.toolbar', function(){
  return{
    enter: function(element, parent){
      element.css({
        'display': 'block',
        'height': '0'
      });
      element.animate({'opacity': '1', 'height': '35px'}, 100);
    },
    leave: function(element){
      element.animate(
        {'opacity': '0', 'height': '0'},
        100,
        function(){
          $(this).css('display', 'none');
        }
      );
    }
  };
});

promise.animation('.row', function(){
  return{
    addClass: function(element){
      var marginLR = parseInt(element.css('margin-left')) + parseInt(element.css('margin-right'));
      var width = parseInt(element.css('width')) + marginLR;
      element.animate(
        {'left': width + 'px'},
        100,
        function(){
          $(this).css('display', 'none');
        }
      );
    },
    removeClass: function(element){
      var marginLR = parseInt(element.css('margin-left')) + parseInt(element.css('margin-right'));
      var width = parseInt(element.css('width')) + marginLR;
      element.css({
        'display': 'block',
        'left': width + 'px'
      });
      element.animate({'left': '0'}, 100);
    }
  };
});

promise.animation('.codeEditorLoding', function(){
  return{
    addClass: function(element){
      element.animate(
        {'opacity': '0'},
        500,
        function(){
          $(this).css('display', 'none');
        }
      );
    },
    removeClass: function(element){
      element.css({
        'display': 'block',
        'opacity': '0'
      });
      element.animate({'opacity': '1'}, 500);
    }
  };
});

// promise.animation('.trAnimate', function(){
//   return{
//     enter: function(element, parent){
//       element.css({
//         'display': 'table-row',
//         'line-height': '0',
//         'opacity': '0'
//       });
//       element.animate({'opacity': '1', 'line-height': '45px'}, 100);
//     },
//     leave: function(element){
//       element.animate({'opacity': '0', 'line-height': '0'}, 100, function(){$(this).css('display', 'none')});
//     }
//   };
// });


// first angularjs animation method (directive + jquery)

// promise.directive('sidebar',function(){
// 	return{
// 		restrict: 'C',
// 		link: function(scope,element,attrs){
//       element.bind({
//         // mouseenter: function(){
//         //   $(this).animate({left: '0'}, 100);
//         // },
//         mouseleave: function(){
//           $(this).animate({left: '-15%'}, 100);
//         }
//       });
// 		}
// 	};
// });

// 下面的调用方法要求目标必须是指定的几种directive

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
