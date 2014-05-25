'use strict';

angular
  .module('loginApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'LoginRootCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
