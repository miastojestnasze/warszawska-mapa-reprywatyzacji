var d3 = require('d3');
var config = require('./config');
var utils = require('./utils');

module.exports = function(svg, figures) {

    var defs = svg.append("defs");
    for(var key in config.sizes) {
        var size = config.sizes[key];
        defs.append("clipPath")
            .attr("id", "g-mug-clip-" + size)
            .append("circle")
            .attr("r", size / 2);
    }

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
        .attr("r", function(d){
            return d.size / 2;
        })
        .attr("class", 'figure-circle-inner');

    circles.append("image")
        .attr("xlink:href", utils.getFigureImageHref)
        .attr("x", function(d, i) { return - d.size / 2; })
        .attr("y", function(d, i) { return - d.size / 2; })
        .attr("width", function(d){ return d.size; })
        .attr("height", function(d){ return d.size; })
        .attr("clip-path", function(d){ return "url(#g-mug-clip-" + d.size + ")"; } )
        .style("pointer-events", "none");

    return circles;

};
