'use strict';

angular
  .module('dashboardApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      // .when('/', {
      //   templateUrl: 'views/main.html',
      //   controller: 'MainCtrl'
      // })
      .when('/entities', {
        templateUrl: 'views/entity.html',
        controller: 'EntityCtrl'
      })
      .when('/entities/:entityid', {
        templateUrl: 'views/entity-detail.html',
        controller: 'EntityDetailCtrl'
      })
      .otherwise({
        redirectTo: '/entities'
      });
  })
  .run(function($rootScope) {
    $rootScope.$on('$routeChangeStart', function(){
      $rootScope.sidebar = '';
    });
    $rootScope.$on('$routeChangeSuccess', function(){
      window.scrollTo(0,0);
    });

  });
