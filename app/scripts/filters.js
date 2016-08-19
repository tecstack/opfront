'use strict';

var promise = angular.module('promise');

// locate是一个递归函数，找到object体中key对应的值，可以从多层object中寻找，将所有同名key结果压入数组里传出。
// function locate(node, key, result){
//   for (var k in node) {
//     // hit!
//     if (k == key) {
//       result.push(node[k]);
//       // return node[k];
//     }
//     // type of value = 'object', callback
//     else if (typeof(node[k]) == 'object') {
//       locate(node[k], key, result);
//     };
//   };
//   return result;
// };

// groups filter: [{xxx},{xxx}] - > 'group1,group2'
promise.filter('groupsFilter', function(){
  return function(input){
    // [{"groupid": "8", "name": "cloudlab"}, {"groupid": "5", "name": "Discovered hosts"}]
    var groupNameList = [];
    var output = '';
    for (var key in input) {
      groupNameList.push(input[key].name);
    }
    output = groupNameList.join();
    return output;
  }
});

// walker result filter: [{xxx},{xxx}] - > 'OK' 'Change' 'fail' 'unreachable'
promise.filter('trailsFilter', function(){
  return function(input){
    //     sum_changed:0
    //     sum_failures:1
    //     sum_ok:0
    //     sum_skipped:0
    //     sum_unreachable:0
    var output = '';
    if (input.sum_unreachable > 0) {
      output = 'unreachable';
    }
    else if (input.sum_failures > 0) {
      output = 'failed';
    }
    else if (input.sum_changed > 0 || input.sum_ok > 0) {
      output = 'success';
    }
    else if (input.sum_skipped > 0) {
      output = 'skipped';
    }
    else {
      output = 'waiting';
    }
    ;
    return output;
  }
});
