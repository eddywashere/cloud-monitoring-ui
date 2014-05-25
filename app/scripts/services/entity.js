'use strict';

angular.module('dashboardApp')
  .factory('Entities', function ($resource) {

    var entities = {},
    Entities = $resource('/proxy/cloudMonitoring/entities/:entityId',
      {
        entityId: '@entityId'
      });

    entities.currentEntity = {};

    entities.getList = function(){
      return Entities.get().$promise;
    };

    entities.getDetail = function(entityId){
      return Entities.get({
        entityId: entityId
      }).$promise;
    };
    // MonitoringAgentService.getAgentInstaller = function(entityId) {
    //   var data = {
    //     entity_id: entityId
    //   };

    //   return agentInstaller().post(data).promise;
    // };

    // Public API here
    return entities;
  });
