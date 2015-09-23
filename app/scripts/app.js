'use strict';

/**
 * @ngdoc overview
 * @name helloworldApp
 * @description
 * # helloworldApp
 *
 * Main module of the application.
 */

var helloworldApp = angular.module('helloworldApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch'
  ]);


helloworldApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        // 首页路由加载配置
        .state('index', {
            url: '/',
            views: {
                '': {
                    templateUrl: 'views/floor.html'
                },
                'navbar@index': {
                    templateUrl: 'views/navbar.html'
                },
                'sidebar@index': {
                    templateUrl: 'views/sidebar.html'
                },
                'dashboard-left@index': {
                    templateUrl: 'views/left-main.html'
                },
                'helper@index': {
                    templateUrl: 'views/left-about.html'
                }
            }
        })
        // UI展示页路由加载配置
        .state('ui', {
            url: '/ui',
            views: {
                '': {
                    templateUrl: 'views/floor.html'
                },
                'navbar@ui': {
                    templateUrl: 'views/navbar.html'
                },
                'sidebar@ui': {
                    templateUrl: 'views/sidebar.html'
                },
                'dashboard-left@ui': {
                    templateUrl: 'views/left-ui.html'
                },
                'helper@ui': {
                    templateUrl: 'views/right-ui.html'
                }
            }
        })
        // angularjs实验区路由加载配置
        .state('nglab', {
            url: '/nglab',
            views: {
                '': {
                    templateUrl: 'views/floor.html'
                },
                'navbar@nglab': {
                    templateUrl: 'views/navbar.html'
                },
                'sidebar@nglab': {
                    templateUrl: 'views/sidebar.html'
                },
                'dashboard-left@nglab': {
                    templateUrl: 'views/left-nglab.html'
                },
                'helper@nglab': {
                    templateUrl: 'views/right-docker.html'
                }
            }
        })
        // blog测试页路由加载配置
        .state('blog', {
            url: '/blog',
            views: {
                '': {
                    templateUrl: 'views/floor.html'
                },
                'navbar@blog': {
                    templateUrl: 'views/navbar.html'
                },
                'sidebar@blog': {
                    templateUrl: 'views/sidebar.html'
                },
                'dashboard-left@blog': {
                    templateUrl: 'views/left-blog.html'
                },
                'helper@blog': {
                    templateUrl: 'views/left-about.html'
                }
            }
        })
        // 云主机检视测试页路由加载配置
        .state('docker', {
            url: '/docker',
            views: {
                '': {
                    templateUrl: 'views/floor.html'
                },
                'navbar@docker': {
                    templateUrl: 'views/navbar.html'
                },
                'sidebar@docker': {
                    templateUrl: 'views/sidebar.html'
                },
                'dashboard-left@docker': {
                    templateUrl: 'views/left-docker.html'
                },
                'helper@docker': {
                    templateUrl: 'views/right-docker.html'
                }
            }
        })
        // 介绍页路由加载配置
        .state('about', {
            url: '/about',
            views: {
                '': {
                    templateUrl: 'views/floor.html'
                },
                'navbar@about': {
                    templateUrl: 'views/navbar.html'
                },
                'sidebar@about': {
                    templateUrl: 'views/sidebar.html'
                },
                'dashboard-left@about': {
                    templateUrl: 'views/left-about.html'
                },
                'helper@about': {
                    templateUrl: 'views/left-about.html'
                }
            }
        })


});

