var d3 = require('d3');
var find = require('lodash.find');

var utils = require('./utils');
var config = require('./config');

var figuresCsv = require('../data/osoby.txt');
var linksCsv = require('../data/polaczenia.txt');

var linksOutlines = require('./d3.links-outline');
var links = require('./d3.links');
var circles = require('./d3.circles')
var tooltips = require('./d3.tooltips');

var figuresData = d3.csv.parse(figuresCsv, utils.parseFigures);
var linksData = d3.csv.parse(linksCsv, utils.parseLinks);

utils.joinLinksFigures(linksData, figuresData)

var svg = d3.select(".main")
      .attr("style", "width:" + config.width + "px")
    .append("svg")
      .attr("width", config.width)
      .attr("height", config.height)
      .call(tooltips)
      .on('click', function(){
        tooltips.hide()
      })

linksOutlines(svg, linksData).on('mouseover', mouseoverLink)
                         .on('mouseout', mouseoutLink)
                         .on('click', toggleTooltip)

links(svg, linksData).on('mouseover', mouseoverLink)
                   .on('mouseout', mouseoutLink)
                   .on('click', toggleTooltip)

circles(svg, figuresData).on('mouseover', mouseoverCircle)
                         .on('mouseout', mouseoutCircle)
                         .on('click', toggleTooltip)

function toggleTooltip(d){
  var target = this;
  if (d.genre === 'link'){
    target = d3.selectAll('.link-circle').filter(function(e){return e === d;}).node();
  }
  d3.event.stopPropagation();
  var current = tooltips.current;
  if(current  && current === d){
    tooltips.hide(d);
    tooltips.current = null;
  }
  if(current !== d){
    tooltips.attr('class', 'd3-tip')
    tooltips.show(d, target);
    tooltips.current = d;
  }
};

 function mouseoverCircle(d){
   var links = d3.selectAll('.g-link').filter(function(link){
     return link.source === d || link.target === d;
   });
   links.attr('class', 'g-link g-link-active')
   links.each(mouseoverLink);
 }

 function mouseoutCircle(d){
    d3.selectAll(".g-link-active")
      .classed("g-link-active", false)
   mouseoutLink();
 }

 function mouseoverLink(d){
   var link = d3.selectAll('.g-link').filter(function(link){
     return d === link;
   });
   var figures = d3.selectAll('.g-figure').filter(function(figure){
     return d.source === figure || d.target === figure;
   });
   figures.classed('g-figure-active', true)
   link.classed('g-link-active', true)
 }

 function mouseoutLink(d){
    d3.selectAll(".g-figure-active")
      .classed("g-figure-active", false)
    d3.selectAll(".g-link-active")
      .classed("g-link-active", false)
 }

d3.select('.loader').remove()
