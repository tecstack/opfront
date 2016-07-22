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
    .state('host', {
      url: '/host',
      views: {
        '': {templateUrl: 'views/floor.html'},
        'helperView@host': {templateUrl: 'views/hostHelper.html'},
        'dashboardView@host': {templateUrl: 'views/hostDashboard.html'}
      }
    })
    .state('module', {
      url: '/module',
      views: {
        '': {templateUrl: 'views/floor.html'},
        'helperView@module': {templateUrl: 'views/moduleHelper.html'},
        'dashboardView@module': {templateUrl: 'views/moduleDashboard.html'}
      }
    })
    .state('script', {
      url: '/script',
      views: {
        '': {templateUrl: 'views/floor.html'},
        'helperView@script': {templateUrl: 'views/scriptHelper.html'},
        'dashboardView@script': {templateUrl: 'views/scriptDashboard.html'}
      }
    })
  });
