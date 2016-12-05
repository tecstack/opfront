/*jshint jquery: true, unused: false, undef:false*/
'use strict';

/**
 * @ngdoc overview
 * @name promise
 * @description
 * # promise
 *
 * Main module of the application.
 */

var promise = angular.module('promise', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ui.router',
    'base64',
    'ngSanitize',
    'ngTouch',
    'ui.codemirror'
  ]);

  promise.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      // 首页路由加载配置
    .state('index', {
      url: '/',
      views: {
        '': {templateUrl: 'views/floor.html'},
        'helperView@index': {templateUrl: 'views/indexHelper.html'},
        'dashboardView@index': {templateUrl: 'views/indexDashboard.html'}
      }
    })
    .state('ui', {
      url: '/ui',
      views: {
        '': {templateUrl: 'views/floor.html'},
        'helperView@ui': {templateUrl: 'views/uiHelper.html'},
        'dashboardView@ui': {templateUrl: 'views/uiDashboard.html'}
      }
    })
    .state('user', {
      url: '/user',
      views: {
        '': {templateUrl: 'views/floor.html'},
        'helperView@user': {templateUrl: 'views/userHelper.html'},
        'dashboardView@user': {templateUrl: 'views/userDashboard.html'}
      }
    })
    .state('setting', {
      url: '/setting',
      views: {
        '': {templateUrl: 'views/floor.html'},
        'helperView@setting': {templateUrl: 'views/settingHelper.html'},
        'dashboardView@setting': {templateUrl: 'views/settingDashboard.html'}
      }
    })
    .state('host', {
      url: '/host',
      views: {
        '': {templateUrl: 'views/floor.html'},
        'helperView@host': {templateUrl: 'views/hostHelper.html'},
        'dashboardView@host': {templateUrl: 'views/hostDashboard.html'}
      }
    })
    .state('network', {
      url: '/network',
      views: {
        '': {templateUrl: 'views/floor.html'},
        'helperView@network': {templateUrl: 'views/networkHelper.html'},
        'dashboardView@network': {templateUrl: 'views/networkDashboard.html'}
      }
    })
    .state('ansible', {
      url: '/ansible',
      views: {
        '': {templateUrl: 'views/floor.html'},
        'helperView@ansible': {templateUrl: 'views/ansibleHelper.html'},
        'dashboardView@ansible': {templateUrl: 'views/ansibleDashboard.html'}
      }
    })
    .state('forward', {
      url: '/forward',
      views: {
        '': {templateUrl: 'views/floor.html'},
        'helperView@forward': {templateUrl: 'views/forwardHelper.html'},
        'dashboardView@forward': {templateUrl: 'views/forwardDashboard.html'}
      }
    })
    .state('script', {
      url: '/script',
      views: {
        '': {templateUrl: 'views/floor.html'},
        'helperView@script': {templateUrl: 'views/scriptHelper.html'},
        'dashboardView@script': {templateUrl: 'views/scriptDashboard.html'}
      }
    });
  });
