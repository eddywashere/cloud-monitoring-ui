'use strict';

angular.module('dashboardApp')
  .controller('AppRootCtrl', function ($rootScope, $scope) {
    $scope.toggleSidebar = function(){
      $rootScope.sidebar = $rootScope.sidebar !== '' ? '' : 'open';
    };
  });
