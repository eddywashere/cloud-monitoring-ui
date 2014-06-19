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
    Checks = $resource('/proxy/cloudMonitoring/entities/:entityId/checks/:checkId',
      {
        entityId: '@entityId',
        checkId: '@checkId'
      },
      {
        'query': {
          method: 'GET',
          isArray: false
        }
      }),
    Alarms = $resource('/proxy/cloudMonitoring/entities/:entityId/alarms/:alarmId',
      {
        entityId: '@entityId',
        checkId: '@alarmId'
      },
      {
        'query': {
          method: 'GET',
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

    entities.getChecks = function(entityId){
      return Checks.get({
        entityId: entityId
      }).$promise;
    };

    entities.getAlarms = function(entityId){
      return Alarms.get({
        entityId: entityId
      }).$promise;
    };

    entities.deleteCheck = function(entityId, checkId){
      return Checks.delete({
        entityId: entityId,
        checkId: checkId
      }).$promise;
    };

    entities.deleteAlarm = function(entityId, alarmId){
      return Alarms.delete({
        entityId: entityId,
        alarmId: alarmId
      }).$promise;
    };

    entities.getAgentHostInfo = function(entityId){
      return AgentHostInfo.get({entityId: entityId}).$promise;
    };

    return entities;
  });
