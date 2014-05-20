'use strict';

angular.module('dashboardApp')
  .factory('Servers', function ($resource) {

    var Servers = $resource('/proxy/cloudServersOpenStack,:region/servers/detail',
      {
        region: '@region'
      },
      {
        'query': {
          method: 'GET',
          isArray: true,
          transformResponse: function (data){
            var servers = data.servers;
            return servers;
          }
        }
      });

    // Public API here
    return Servers;
  });
