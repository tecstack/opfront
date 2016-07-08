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
    'ngTouch'
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
    .state('sign', {
      url: '/sign',
      views: {
        '': {templateUrl: 'views/floor.html'},
        'helperView@sign': {templateUrl: 'views/signHelper.html'},
        'dashboardView@sign': {templateUrl: 'views/signDashboard.html'}
      }
    })
  });
