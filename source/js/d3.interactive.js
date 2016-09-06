/*
Interactive mode is used by editors to position the circles.
*/
var d3 = require('d3');
var config = require('./config');

var interactive = module.exports = {};

interactive.addForceLayout = function(linksData, figuresData, links, circles) {
    var force = d3.layout.force()
        .nodes(figuresData)
        .links(linksData)
        .size([config.width, config.height])
        .on("tick", tick);

    if(!config.autodistribution) {
        force = force.linkStrength(0)
        .charge(-100)
        .chargeDistance(100)
        .gravity(0).start();
    } else {
        // automatic
        force = force.linkDistance(100)
        .linkStrength(0.8)
        .charge(-10000)
        .chargeDistance(500)
        .start();
    }

    circles.call(force.drag);
    var inner_links = links.selectAll(".link-inner");
    var link_circles = links.selectAll(".link-circle");

    function tick() {
        circles
          .attr("cx", function(d) { return d.x = Math.max(30, Math.min(config.width - 30, d.x)); })
          .attr("cy", function(d) { return d.y = Math.max(30, Math.min(config.height - 30, d.y)); })
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        links
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
        inner_links.attr("d", d3.svg.diagonal());
        link_circles
          .attr("cx", function(d){
            var path = this.parentNode.getElementsByClassName('link-inner')[0];
            return path.getPointAtLength((path.getTotalLength()||0)/2).x;
          })
          .attr("cy", function(d){
             var path = this.parentNode.getElementsByClassName('link-inner')[0];
             return path.getPointAtLength((path.getTotalLength()||0)/2).y;
         });
        showPositions();
    }

    function showPositions() {
        var text = "";
        for (var i = 0; i < figuresData.length; i++) {
            var figure = figuresData[i];
            var width = (figure.x / config.width * 10).toPrecision(4);
            var height = (figure.y / config.height * 10).toPrecision(4);

            text += '"' + figure.name + '": [' + width + ', ' + height + '],<br>';
        }
        d3.select('.interactive-output').html(text);
    }
};
