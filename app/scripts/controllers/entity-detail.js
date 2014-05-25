'use strict';

angular.module('dashboardApp')
  .controller('EntityDetailCtrl', function ($scope, $routeParams, Entities) {

    var getHostInfo = function(){
      Entities.getAgentHostInfo($scope.entity.id).then(function(data){
        $scope.entity.hostInfo = data.values[0].host_info;
        $scope.hostInfoLoading = false;
      }).catch(function(){
        $scope.hostInfoLoading = false;
      });
    };

    $scope.hostInfoLoading = true;

    if (Entities.currentEntity.id) {
      $scope.entity = Entities.currentEntity;
      getHostInfo();
    } else {
      // make call to get entity
      Entities.getDetail($routeParams.entityid).then(function(data){
        $scope.entity = data;
        Entities.currentEntity = $scope.entity;
        getHostInfo();
      });
    }
  });
