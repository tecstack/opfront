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
    'base64',
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
                'navbarView@index': {
                    templateUrl: 'views/navbar.html'
                },
                'sidebarView@index': {
                    templateUrl: 'views/sidebar.html'
                },
                'dashboardView@index': {
                    templateUrl: 'views/left-main.html'
                },
                'helperView@index': {
                    templateUrl: 'views/left-about.html'
                },
                'signView@index': {
                    templateUrl: 'views/sign.html'
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
                'navbarView@ui': {
                    templateUrl: 'views/navbar.html'
                },
                'sidebarView@ui': {
                    templateUrl: 'views/sidebar.html'
                },
                'dashboardView@ui': {
                    templateUrl: 'views/left-ui.html'
                },
                'helperView@ui': {
                    templateUrl: 'views/right-ui.html'
                },
                'signView@ui': {
                    templateUrl: 'views/sign.html'
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
                'navbarView@nglab': {
                    templateUrl: 'views/navbar.html'
                },
                'sidebarView@nglab': {
                    templateUrl: 'views/sidebar.html'
                },
                'dashboardView@nglab': {
                    templateUrl: 'views/left-nglab.html'
                },
                'helperView@nglab': {
                    templateUrl: 'views/right-docker.html'
                },
                'signView@nglab': {
                    templateUrl: 'views/sign.html'
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
                'navbarView@blog': {
                    templateUrl: 'views/navbar.html'
                },
                'sidebarView@blog': {
                    templateUrl: 'views/sidebar.html'
                },
                'dashboardView@blog': {
                    templateUrl: 'views/left-blog.html'
                },
                'helperView@blog': {
                    templateUrl: 'views/left-about.html'
                },
                'signView@blog': {
                    templateUrl: 'views/sign.html'
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
                'navbarView@docker': {
                    templateUrl: 'views/navbar.html'
                },
                'sidebarView@docker': {
                    templateUrl: 'views/sidebar.html'
                },
                'dashboardView@docker': {
                    templateUrl: 'views/left-docker.html'
                },
                'helperView@docker': {
                    templateUrl: 'views/right-docker.html'
                },
                'signView@docker': {
                    templateUrl: 'views/sign.html'
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
                'navbarView@about': {
                    templateUrl: 'views/navbar.html'
                },
                'sidebarView@about': {
                    templateUrl: 'views/sidebar.html'
                },
                'dashboardView@about': {
                    templateUrl: 'views/left-about.html'
                },
                'helperView@about': {
                    templateUrl: 'views/left-about.html'
                },
                'signView@about': {
                    templateUrl: 'views/sign.html'
                }
            }
        })


});
