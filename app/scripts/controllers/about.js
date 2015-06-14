'use strict';

/**
 * @ngdoc function
 * @name nodejsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the nodejsApp
 */
angular.module('nodejsApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
