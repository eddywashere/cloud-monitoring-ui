'use strict';

/**
 * @ngdoc directive
 * @name dashboardApp.directive:spark
 * @description
 * # spark
 */
angular.module('dashboardApp')
  .directive('spark', function() {
  return {
    'restrict': 'EA',
    'scope': {},
    'link': function(scope, element, attrs) {
      var n = 20,
          random = d3.random.normal(0.4, 0.2),
          data = d3.range(n).map(random);

      var margin = {top: 0, right: 0, bottom: 0, left: 0},
          width = 100 - margin.left - margin.right,
          height = 20 - margin.top - margin.bottom;

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

      var svg = d3.select(element[0]).append("svg")
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
            .duration(2000)
            .ease("linear")
            .attr("transform", "translate(" + x(0) + ",0)")
            .each("end", tick);

        // pop the old data point off the front
        data.shift();
      }
    }
  };
});
