'use strict';

angular.module('dashboardApp')
  .controller('EntityDetailCtrl', function ($scope, $routeParams, Entities) {
    if (Entities.currentEntity.id) {
      $scope.entity = Entities.currentEntity;
    } else {
      // make call to get entity
      Entities.getDetail($routeParams.entityid).then(function(data){
        $scope.entity = data;
        Entities.currentEntity = $scope.entity;
      });
    }
  });
