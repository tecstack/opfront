/*jshint jquery: true, unused: false, undef:false*/
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

// hosts data init filter
promise.filter('hostsInitFilter', function($filter){
  return function(input){
    var output = [];
    for (var index in input) {
      var tempNode = [];
      if (input[index].hasOwnProperty('id')) {
        tempNode.push(input[index].id);
      } else {
        tempNode.push('');
      }
      if (input[index].hasOwnProperty('ip') && input[index].ip.length > 0) {
        if (input[index].ip[0].hasOwnProperty('ip_addr')) {
          tempNode.push(input[index].ip[0].ip_addr);
        } else {
          tempNode.push('');
        }
      } else {
        tempNode.push('');
      }
      if (input[index].hasOwnProperty('name')) {
        tempNode.push(input[index].name);
      } else {
        tempNode.push('');
      }
      if (input[index].hasOwnProperty('model') && input[index].model.length > 0) {
        if (input[index].model[0].hasOwnProperty('vender')) {
          tempNode.push(input[index].model[0].vender);
        } else {
          tempNode.push('');
        }
      } else {
        tempNode.push('');
      }
      if (input[index].hasOwnProperty('model') && input[index].model.length > 0) {
        if (input[index].model[0].hasOwnProperty('name')) {
          tempNode.push(input[index].model[0].name);
        } else {
          tempNode.push('');
        }
      } else {
        tempNode.push('');
      }
      if (input[index].hasOwnProperty('group')) {
        var groups = $filter('groupsFilter')(input[index].group);
        tempNode.push(groups);
      } else {
        tempNode.push('');
      }
      output.push(tempNode);
    }
    return output;
  };
});

// scripts data init filter
promise.filter('scriptsInitFilter', function($filter){
  return function(input, scriptType){
    var output = [];
    for (var index in input) {
      if (input[index].script_type === scriptType) {
        var tempNode = [];
        tempNode.push(input[index].script_name);
        tempNode.push(input[index].script_lang);
        tempNode.push($filter('scriptTypeFilter')(input[index].script_type));
        tempNode.push(input[index].owner_name);
        tempNode.push(input[index].time_create);
        output.push(tempNode);
      }
    }
    return output;
  };
});

// script_type filter: 1->ansible 2->Forward
promise.filter('scriptTypeFilter', function(){
  return function(input){
    if (input === 1) {
      return 'Ansible';
    } else if (input === 2) {
      return 'Forward';
    } else {
      return '未定义';
    }
  };
});

// is_public filter: 0->not public 1->public
promise.filter('isPublicFilter', function(){
  return function(input){
    if (input === 0) {
      return '否';
    } else if (input === 1) {
      return '是';
    } else {
      return '未知';
    }
  };
});

// date filter: 'Tue, 23 Aug 2016 00:50:12 GMT' - > '2016-08-23 00:50:12'
promise.filter('dateFilter', function($filter){
  return function(input){
    var dateInput = new Date(input);
    var dateOutput = new Date(dateInput.valueOf() + dateInput.getTimezoneOffset() * 60000);
    var output = $filter('date')(dateOutput, 'yyyy-MM-dd HH:mm:ss');
    return output;
  };
});

// groups filter: [{xxx},{xxx}] - > 'group1,group2'
promise.filter('groupsFilter', function(){
  return function(input){
    // [{"groupid": "8", "name": "cloudlab"}, {"groupid": "5", "name": "Discovered hosts"}]
    var groupNameList = [];
    var output = '';
    for (var key in input) {
      if (input[key].hasOwnProperty('name')) {
        groupNameList.push(input[key].name);
      }
    }
    output = groupNameList.join();
    return output;
  };
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
    return output;
  };
});
