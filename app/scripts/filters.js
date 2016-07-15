'use strict';

var promise = angular.module('promise');

// locate是一个递归函数，找到object体中key对应的值，可以从多层object中寻找，将所有同名key结果压入数组里传出。
function locate(node, key, result = []){
  for (var k in node) {
    // hit!
    if (k == key) {
      result.push(node[k]);
      // return node[k];
    }
    // type of value = 'object', callback
    else if (typeof(node[k]) == 'object') {
      locate(node[k], key, result);
    };
  };
  return result;
};

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

// host filter: [{},{}] via Mfilters
promise.filter('hostFilter', function(){
  return function(input, Vfilters){
    // input = [
    //   {
    //     "available": "0",
    //     "groups": [{"groupid": "4", "name": "Zabbix servers"}],
    //     "host": "Zabbix server",
    //     "hostid": "0",
    //     "interfaces": [{"interfaceid": "1", "ip": "127.0.0.1"}],
    //     "status": "1"
    //   },
    // ......
    // ];

    // Vfilters = [
    //   {filterName:'IP', filterBool:'=', filterContent:'192.168.182.3'},
    //   {filterName:'Hostname', filterBool:'!=', filterContent:'LAB-100'},
    //   {filterName:'ID', filterBool:'=', filterContent:'MGMT'}
    // ];

    // no filter
    if (Vfilters.length == 0) {
      return input;
    };

    var output = [];
    // loop every data
    for (var i = 0; i < input.length; i++) {
      var legal = false;
      // loop every filter
      for (var j = 0; j < Vfilters.length; j++) {
        // if filter legal
        if (Vfilters[j].filterName && Vfilters[j].filterBool && Vfilters[j].filterContent) {
          // init
          var name = Vfilters[j].filterName;
          var bool = Vfilters[j].filterBool;
          var value = locate(input[i], name);
          var content = Vfilters[j].filterContent;
          var re = new RegExp(content);

          // match
          var valueLegal = (bool == '=')?false:true;
          for (var key in value) {
            // hit!
            if (re.test(value[key])) {
              valueLegal = (bool == '=')?(valueLegal || true):(valueLegal && false);
            }
            // not hit!
            else {
              valueLegal = (bool == '=')?(valueLegal || false):(valueLegal && true);
            };
          };

          // boolean judge
          legal = valueLegal;
          if (!legal) {
            break;
          };
        }
        // if filter illegal, pass
        else {
          legal = true;
        };
      };
      // judge
      if (legal) {
        output.push(input[i]);
      };
    };
    // return
    return output;
  };
});
