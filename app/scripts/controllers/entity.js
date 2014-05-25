'use strict';

angular.module('dashboardApp')
  .controller('EntityCtrl', function ($scope, Entities) {

    $scope.entities = [];

    $scope.setEntity = function(entity){
      Entities.currentEntity = entity;
    };

    Entities.getList().then(function (data) {
      console.log(data);
      $scope.entities = data.values;
    });

    // Entities.get({entityId: 'ORD'}).$promise.then(function (data) {
    //   console.log(data);
    //   $scope.entities = data.values;
    // });
  });
