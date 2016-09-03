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
};

utils.parseFigures = function(d) {
  if (!config.positions[d['Nazwa']]) {
    throw new Error('no position for' + d['Nazwa']);
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
