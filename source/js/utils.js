var config = require('./config');

var utils = module.exports = {};

utils.find = function(collection, predicate) {
  for (var i = 0, l = collection.length; i < l; i++) {
    if (utils.matchPredicate(collection[i], predicate)) {
      return collection[i];
    }
  }
};

utils.matchPredicate = function(object, predicates) {
  for (var key in predicates) {
    if (predicates.hasOwnProperty(key) ) {
      if (!object[key] || object[key] !== predicates[key]) {
        return false;
      }
    }
  }
  return true;
};

utils.cleanUpSpecialChars = function(str) {
    str = str.replace(/[ÀÁÂÃÄÅĄ]/g,"A");
    str = str.replace(/[àáâãäåą]/g,"a");
    str = str.replace(/[ÈÉÊËĘ]/g,"E");
    str = str.replace(/[èéêëę]/g,"E");
    str = str.replace(/[Ł]/g,"l");
    str = str.replace(/[ł]/g,"l");
    str = str.replace(/[Ó]/g,"o");
    str = str.replace(/[ó]/g,"o");
    str = str.replace(/[Ń]/g,"n");
    str = str.replace(/[ń]/g,"n");
    str = str.replace(/[Ś]/g,"s");
    str = str.replace(/[ś]/g,"s");
    str = str.replace(/[Ż]/g,"z");
    str = str.replace(/[ż]/g,"z");
    str = str.replace(/[Ź]/g,"z");
    str = str.replace(/[ź]/g,"z");
    str = str.replace(/[.]/g,"");
    return str;
};

utils.parseFigures = function(d) {
  var position = config.positions[d['Nazwa']];
  if(!position) {
    position = [5, 5];
  }
  return {
    name: d['Nazwa'],
    desc: d['Opis'].replace(/\n/g,"<br>"),
    links: d['Linki'] ? d['Linki'].split(/\n/) : [],
    properties: d['Nieruchomości'] ? d['Nieruchomości'].split(/\n/) : [],
    size: config.sizes[d['Wielkość']],
    x: position[0] * config.width/10,
    y: position[1] * config.height/10,
    genre: 'figure',
  };
};

utils.parseLinks = function(d) {
  return {
    source: d['A'],
    target: d['B'],
    name: d['Tytuł'],
    desc: d['Opis'],
    links: d['Linki'] ? d['Linki'].split(/\n/) : [],
    genre: 'link'
  };
};

utils.joinLinksFigures = function(links, figures) {
  links.forEach(function(link) {
    var source = utils.find(figures, {name: link.source});
    var target = utils.find(figures, {name: link.target});
    link.source = source;
    link.target = target;
  });
};

utils.getFigureImageHref = function(d) {
  return '/assets/figures/' + utils.getFigureId(d) + '.png';
};

utils.getFigureId = function(d){
  return utils.cleanUpSpecialChars(d.name).toLowerCase().replace(/\s/g,'-');
};

utils.isHover = function(element) {
  return (element.parentElement.querySelector(':hover') === element);
};

utils.checkLinksFigures = function(links) {
  // Make sure there are no links involving nonexisting figures
  for(var i=0; i < links.length; i++) {
      if(!links[i].source) console.log("A w linku #" + (i+1) + " nie istnieje!");
      if(!links[i].target) console.log("B w linku #" + (i+1) + " nie istnieje!");
  }
};
