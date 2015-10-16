var d3 = require('d3');

module.exports = function(svg, links) {

  var link = svg.append("g")
  .attr("class", "g-links")
  .selectAll("g")
    .data(links)
  .enter().append("g")
    .attr("class", "g-link")

  link.append("path")
    .attr("class", "link-inner")
    .attr("d", d3.svg.diagonal())

 link.append('circle')
    .attr("class", "link-circle")
    .attr("cx", function(d){
      var path = this.parentNode.getElementsByClassName('link-inner')[0]
      return path.getPointAtLength((path.getTotalLength()||0)/2).x;
    })
   .attr("cy", function(d){
      var path = this.parentNode.getElementsByClassName('link-inner')[0]
      return path.getPointAtLength((path.getTotalLength()||0)/2).y;
    })
    .attr("r", 8);

  return link;

}
