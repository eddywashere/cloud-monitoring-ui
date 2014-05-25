'use strict';

angular.module('dashboardApp')
  .factory('Servers', function ($resource) {

    var Servers = $resource('/proxy/cloudMonitoring/entities',
      {},
      {
        'query': {
          method: 'GET',
          isArray: true,
          transformResponse: function (data){
            var entities = data.values;
            return entities;
          }
        }
      });

    // Public API here
    return Servers;
  });
