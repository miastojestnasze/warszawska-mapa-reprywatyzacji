var d3 = require('d3');
var config = require('./config');
var utils = require('./utils');

module.exports = function(svg, figures) {

    svg.append("defs").append("clipPath")
        .attr("id", "g-mug-clip")
      .append("circle")
        .attr("r", config.mugDiameter / 2);

    var circles = svg.append("g")
        .attr("class", "g-figures")
      .selectAll("g")
        .data(figures)
      .enter().append("g")
        .attr("class", function(d){
          return 'g-figure figure-' + config.classTypes[d.type];
        })
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
      });

    circles.append("circle")
        .attr("r", (config.mugDiameter / 2))
        .attr("class", 'figure-circle-inner');

    circles.append("image")
        .attr("xlink:href", utils.getFigureImageHref)
        .attr("x", function(d, i) { return - config.mugDiameter / 2; })
        .attr("y", function(d, i) { return - config.mugDiameter / 2; })
        .attr("width", config.mugDiameter)
        .attr("height", config.mugDiameter)
        .attr("clip-path", "url(#g-mug-clip)")
        .style("pointer-events", "none");

    return circles;

};
