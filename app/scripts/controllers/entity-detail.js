'use strict';

angular.module('dashboardApp')
  .controller('EntityDetailCtrl', function ($scope, $routeParams, Entities, $interval) {

    var getHostInfo = function(){
      Entities.getAgentHostInfo($scope.entity.id).then(function(data){
        $scope.entity.hostInfo = data.values[0].host_info;
        $scope.hostInfoLoading = false;
      }).catch(function(){
        $scope.hostInfoLoading = false;
      });
    },
    polling;

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

    Entities.getChecks($routeParams.entityid).then(function(data){
      $scope.checks = data.values;
    });

    Entities.getAlarms($routeParams.entityid).then(function(data){
      $scope.alarms = data.values;
    });

    $scope.delete = function(checkId){
      Entities.deleteCheck($routeParams.entityid, checkId).then(function(data){
        console.log('boom deleted');
        $scope.checks.splice(_.indexOf($scope.checks, _.findWhere($scope.checks, { id : checkId})), 1);
      });
    };

    $scope.deleteAllChecks = function(){
      angular.forEach($scope.checks, function(check, i){
        Entities.deleteCheck($routeParams.entityid, check.id).then(function(data){
          console.log('boom deleted');
          $scope.checks.splice(_.indexOf($scope.checks, _.findWhere($scope.checks, { id : check.id})), 1);
        });
      });
    };

    $scope.deleteAllAlarms = function(){
      angular.forEach($scope.alarms, function(alarm, i){
        Entities.deleteAlarm($routeParams.entityid, alarm.id).then(function(data){
          console.log('boom deleted');
          $scope.alarms.splice(_.indexOf($scope.alarms, _.findWhere($scope.alarms, { id : alarm.id})), 1);
        });
      });
    };

    var graph = function(name, change){
      var n = 40,
      change = change || .2,
        random = d3.random.normal(.5, change),
        data = d3.range(n).map(random);

      var margin = {top: 20, right: 20, bottom: 20, left: 20},
          width = 400 - margin.left - margin.right,
          height = 100 - margin.top - margin.bottom;

      var x = d3.scale.linear()
          .domain([1, n - 2])
          .range([1, width]);

      var y = d3.scale.linear()
          .domain([0, 1])
          .range([height, 0]);

      var line = d3.svg.line()
          .interpolate("basis")
          .x(function(d, i) { return x(i); })
          .y(function(d, i) { return y(d); });

      var svg = d3.select("."+name).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("defs").append("clipPath")
          .attr("id", "clip")
        .append("rect")
          .attr("width", width)
          .attr("height", height);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + y(0) + ")")
          .call(d3.svg.axis().scale(x).orient("bottom"));

      svg.append("g")
          .attr("class", "y axis")
          .call(d3.svg.axis().ticks(1).scale(y).orient("left"));

      var path = svg.append("g")
          .attr("clip-path", "url(#clip)")
        .append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);

      tick();

      function tick() {

        // push a new data point onto the back
        data.push(random());

        // redraw the line, and slide it to the left
        path
            .attr("d", line)
            .attr("transform", null)
          .transition()
            .duration(500)
            .ease("linear")
            .attr("transform", "translate(" + x(0) + ",0)")
            .each("end", tick);

        // pop the old data point off the front
        data.shift();

      }
    };
    graph('graph1');
    graph('graph2', .15);
    graph('graph3', .02);
    graph('graph4', .17);
    // polling = $interval(getHostInfo, 1000);
  });
