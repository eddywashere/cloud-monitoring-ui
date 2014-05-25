'use strict';

angular.module('dashboardApp')
  .factory('Entities', function ($resource, $cacheFactory, $timeout) {

    var entities = {},
    Entities = $resource('/proxy/cloudMonitoring/entities/:entityId',
      {
        entityId: '@entityId'
      },
      {
        'query': {
          method: 'GET',
          cache: $cacheFactory,
          isArray: false
        }
      }),
    AgentHostInfo = $resource('/proxy/cloudMonitoring/views/agent_host_info?entityId=:entityId&include=memory&include=cpus&include=disks&include=processes&include=network_interfaces',
      {
        entityId: '@entityId'
      },
      {
        'get': {
          method: 'GET',
          isArray: false
        }
      });

    entities.currentEntity = {};

    var getListTimeout;
    entities.getList = function(){
      if (!angular.isDefined(getListTimeout)) {
        getListTimeout = $timeout(entities.clearListCache, 60000);
      }
      return Entities.query().$promise;
    };

    entities.clearListCache = function(){
      $timeout.cancel(getListTimeout);
      $cacheFactory.get('$http').remove('/proxy/cloudMonitoring/entities');
    };

    entities.create = function(){
      entities.clearListCache();
    };

    entities.getDetail = function(entityId){
      return Entities.get({
        entityId: entityId
      }).$promise;
    };

    entities.getAgentHostInfo = function(entityId){
      return AgentHostInfo.get({entityId: entityId}).$promise;
    };

    return entities;
  });
