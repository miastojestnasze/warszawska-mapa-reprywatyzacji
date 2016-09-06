var d3 = require('d3');

module.exports = function(svg, links) {

  return svg.append("g")
    .attr("class", "g-links-bg")
    .selectAll("g")
      .data(links)
    .enter().append("g")
      .attr("class", "g-link-bg")
    .append("path")
      .attr("class", "link-outer")
      .attr("d", d3.svg.diagonal());

};
