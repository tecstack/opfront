'use strict';

/**
 * @ngdoc function
 * @name promise.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the promise
 */

var promise = angular.module('promise');

// ui
promise.controller('Cui', function($scope,$rootScope){
  // 初始化
  $scope.indexDataLine = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            fillColor: 'rgba(220,220,220,0.2)',
            strokeColor: 'rgba(220,220,220,1)',
            pointColor: 'rgba(220,220,220,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(220,220,220,1)',
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            fillColor: 'rgba(151,187,205,0.2)',
            strokeColor: 'rgba(151,187,205,1)',
            pointColor: 'rgba(151,187,205,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(151,187,205,1)',
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
  };
  $scope.MbarDatas = {
    labels: ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "5.9", "6.0", "6.1", "6.2", "6.3", "6.4", "6.5"],
    datasets: [
      {
        label: "My First dataset",
        fillColor: "#618FFF",
        // strokeColor: "rgba(220,220,220,0.8)",
        highlightFill: "#6291FF",
        highlightStroke: "rgba(220,220,220,1)",
        data: [65, 59, 80, 81, 56, 55, 40, 59, 12, 100, 32, 72, 5, 15, 65]
      },
      {
        label: "My Second dataset",
        fillColor: "RGBA(255, 112, 118, 1.00)",
        // strokeColor: "rgba(220,220,220,0.8)",
        highlightFill: "RGBA(255, 132, 138, 1.00)",
        highlightStroke: "rgba(220,220,220,1)",
        data: [40, 59, 12, 100, 32, 72, 65, 59, 80, 81, 56, 55, 98, 54, 23]
      },
    ]
  };

  $scope.MuserOptions = [
    {value: '001', label: '小明'},
    {value: '002', label: '小暗'},
    {value: '003', label: '小美'},
  ];
  $scope.tableDataTh = ['ID','名称','来源','年龄','爱好','特长','返回值'];
  $scope.tableData = [
    ['0','小明','海岸线','29','琴棋书画','无','200'],
    ['1','小暗','山脉','25','花草走兽','无','404'],
    ['2','小美','科技城','21','山珍海味','无','304'],
    ['3','Null','Null','Null','Null','Null','Null']
  ];

  $scope.pro = {
    'xiaomin': {
      'name': '小明个人成就',
      'max': 100,
      'current': 76,
    },
    'xiaoan': {
      'name': '小暗收集图鉴',
      'max': 3065,
      'current': 798,
    },
    'xiaomei': {
      'name': '小美游历奖牌',
      'max': 1000,
      'current': 357,
    },
    'ant': {
      'name': '码蚁里程碑',
      'max': 10,
      'current': 2,
    },
  }
});
