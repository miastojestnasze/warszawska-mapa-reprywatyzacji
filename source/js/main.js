var d3 = require('d3');
var debounce = require('debounce');
jQuery = require('jquery');

require('featherlight');

var utils = require('./utils');
var config = require('./config');

var figuresCsv = require('../data/osoby.txt');
var linksCsv = require('../data/polaczenia.txt');

var linksOutlines = require('./d3.links-outline');
var links = require('./d3.links');
var circles = require('./d3.circles');
var tooltips = require('./d3.tooltips');
var interactive = require('./d3.interactive');


var figuresData = d3.csv.parse(figuresCsv, utils.parseFigures);
var linksData = d3.csv.parse(linksCsv, utils.parseLinks);

var interactive_mode = (document.location.search == '?interactive');

utils.joinLinksFigures(linksData, figuresData);

if(interactive_mode) {
    utils.checkLinksFigures(linksData);
}

var svg = d3.select(".main")
      .attr("style", "width:" + config.width + "px")
      .append("svg")
      .attr("width", config.width)
      .attr("height", config.height)
      .call(tooltips)
      .on('click', function(){
        tooltips.hide();
    });

var LinkOutlineObjs = linksOutlines(svg, linksData)
    .on('mouseover', mouseoverLink)
    .on('mouseout', mouseoutLink);

var LinkObjs = links(svg, linksData)
    .on('mouseover', mouseoverLink)
    .on('mouseout', mouseoutLink);

var CircleObjs = circles(svg, figuresData)
    .on('mouseover', mouseoverCircle)
    .on('mouseout', mouseoutCircle);

if(interactive_mode) {
    interactive.addForceLayout(linksData, figuresData, LinkObjs, CircleObjs);
    d3.select("body").attr('class', 'interactive');
}

function showHideTooltip(d){
  var target = this;
  if (d && d.genre === 'link'){
    target = d3.selectAll('.link-circle').filter(function(e){return e === d;}).node();
  }
  var tooltip = d3.selectAll('.d3-tip').node();

  if(!interactive_mode && (utils.isHover(target) || utils.isHover(this))) {
    tooltips.attr('class', 'd3-tip');
    tooltips.show(d, target);
    tooltips.current = d;
  } else if(!utils.isHover(tooltip)) {
    tooltips.hide();
    tooltips.current = null;
  }
}
delayedShowHideTooltip = debounce(showHideTooltip, 200);
d3.selectAll('.d3-tip').on('mouseout', delayedShowHideTooltip);

function mouseoverCircle(d){
  var links = d3.selectAll('.g-link').filter(function(link){
    return link.source === d || link.target === d;
  });
  links.attr('class', 'g-link g-link-active');
  links.each(highlightLink);
  delayedShowHideTooltip.call(this, d);
}

function mouseoutCircle(d){
  d3.selectAll(".g-link-active")
    .classed("g-link-active", false);
  unhighlightLinks();
  delayedShowHideTooltip.call(this, d);
}

function highlightLink(d){
  var link = d3.selectAll('.g-link').filter(function(link){
    return d === link;
  });
  var figures = d3.selectAll('.g-figure').filter(function(figure){
    return d.source === figure || d.target === figure;
  });
  figures.classed('g-figure-active', true);
  link.classed('g-link-active', true);
}

function unhighlightLinks(){
  d3.selectAll(".g-figure-active")
    .classed("g-figure-active", false);
  d3.selectAll(".g-link-active")
    .classed("g-link-active", false);
}

function mouseoverLink(d){
  highlightLink(d);
  delayedShowHideTooltip.call(this, d);
}

function mouseoutLink(d){
  unhighlightLinks(d);
  delayedShowHideTooltip.call(this, d);
}

d3.select('.loader').remove();
