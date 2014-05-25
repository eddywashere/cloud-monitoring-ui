'use strict';

angular.module('loginApp')
  .controller('LoginRootCtrl', function ($scope) {

    $scope.clickMe = function(){
      console.log('foobar');
    };
  });
