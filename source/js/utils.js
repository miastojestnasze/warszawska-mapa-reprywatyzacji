var find = require('lodash.find');
var config = require('./config');

var utils = module.exports = {};

utils.cleanUpSpecialChars = function(str) {
    str = str.replace(/[ÀÁÂÃÄÅĄ]/,"A");
    str = str.replace(/[àáâãäåą]/,"a");
    str = str.replace(/[ÈÉÊËĘ]/,"E");
    str = str.replace(/[èéêëę]/,"E");
    str = str.replace(/[Ł]/,"l");
    str = str.replace(/[ł]/,"l");
    str = str.replace(/[Ó]/,"o");
    str = str.replace(/[ó]/,"o");
    str = str.replace(/[Ń]/,"n");
    str = str.replace(/[ń]/,"n");
    str = str.replace(/[Ś]/,"s");
    str = str.replace(/[ś]/,"s");
    str = str.replace(/[Ż]/,"z");
    str = str.replace(/[ż]/,"z");
    str = str.replace(/[Ź]/,"z");
    str = str.replace(/[ź]/,"z");
    return str;
}

utils.parseFigures = function(d) {
  if (!config.positions[d['Nazwa']]) {
    throw new Error('no position for' + d['Nazwa'])
  }
  return {
    name: d['Nazwa'],
    type: d['Typ'],
    desc: d['Opis'],
    image: d['Obrazek'],
    x: config.positions[d['Nazwa']][0] * config.width/10 || 100,
    y: config.positions[d['Nazwa']][1] * config.height/10 || 100,
    genre: 'figure'
  }
}

utils.parseLinks = function(d) {
  return {
    source: d['A'],
    target: d['B'],
    name: d['Tytuł'],
    desc: d['Opis'],
    url: d['Link'],
    url2: d['Link2'],
    genre: 'link'
  }
}

utils.joinLinksFigures = function(links, figures) {
  links.forEach(function(link) {
    var source = find(figures, {name: link.source});
    var target = find(figures, {name: link.target});
    link.source = source;
    link.target = target;
  });
}

utils.getFigureImageHref = function(d) {
  return '/assets/figures/' + utils.getFigureId(d) + '.jpg';
};

utils.getFigureId = function(d){
  return utils.cleanUpSpecialChars(d.name).toLowerCase().replace(/\s/g,'-');
};