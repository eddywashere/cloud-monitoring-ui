'use strict';

angular.module('dashboardApp')
  .controller('MainCtrl', function ($scope, $http, Servers, $window) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.servers = [];
    var serviceDefaults = {
      autoscale: 'groups',
      cloudBackup: 'backup-configuration',
      cloudBigData: 'clusters',
      cloudBlockStorage: 'volumes',
      cloudDNS: 'domains',
      cloudDatabases: 'instances',
      cloudFiles: '',
      cloudFilesCDN: '',
      cloudImages: 'images',
      cloudLoadBalancers: 'loadbalancers',
      cloudMonitoring: 'entities',
      cloudOrchestration: 'stacks',
      cloudQueues: 'queues',
      cloudServersOpenStack: 'servers'
    };

    $scope.user = $window.user;

    $scope.getListCall = function(name){
      return serviceDefaults[name] || '';
    };

    Servers.get().$promise.then(function (data) {
      console.log(data);
      $scope.servers = data.values;
    });
  });
