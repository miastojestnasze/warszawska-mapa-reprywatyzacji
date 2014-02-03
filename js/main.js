var mugDiameter = 70;

var positions = {
  "Maciej Marcinkowski": [5,9],
  "Marcin Bajko": [9,2],
  "Hanna Gronkiewicz-Waltz": [5,1],
  "Pracownia Davos":[7,1],
  "Jacek Wojciechowicz":[7,1.5],
  "Jolanta Zdziech-Naperty":[1,3],
  "Wojciech Bartelski":[3,1.5],
  "Działka na placu Defilad": [5,5],
  "Działka na placu Zamkowym": [3,7],
  "Ogród Jordanowski na ul. Szarej":[5.5,6.5],
  "Parking na Krakowskim Przedmieściu":[1,6],
  "Kamienica przy ul. Kazimierzowskiej": [9.5,6],
  "Boisko na Foksal": [7,7],
  "Kamienica na aleji Szucha": [8, 8],
  "Marek Mikos": [6.5, 3],
  "Gimnazjum na ul. Twardej": [1.5, 5],
  "Pracownia Dawos": [7, 5],
  "Jakub Rudnicki": [8,4]
}

var cleanUpSpecialChars = function(str)
{
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


var classTypes = {
  "handlarz roszczeniami": "business",
  "nieruchomość": "property",
  "urzędnik": "city"
}

var figureImage = function(d){
  return 'img/figures/' + figureId(d) + '.jpg';
}

var figureId = function(d){
  return cleanUpSpecialChars(d.name).toLowerCase().replace(/\s/g,'-');
}


var width = 1020,
    height = 800;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var mugCurcle = svg.append("defs").append("clipPath")
    .attr("id", "g-mug-clip")
  .append("circle")
    .attr("r", mugDiameter / 2);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset(function(d){
    if(d.genre === 'figure'){
      return [-25,0]
    }else{
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
            console.log(dy/2,dx/2,dr)
      return [dy/2,0]
    }
  })
  .html(function(d) {
    var html = "<strong>" + d.name + "</strong><br/><br/>"+d.desc+"<br/><br/>";
    if (d.url){
      html += '<a href="'+d.url+'">' + d.url + '</a>';
    }
    return html
  })

var toggleTooltip = function(d){
  var current = tip.current;
  if(current  && current === d){
    tip.hide(d);
    tip.current = null;
  }
  if(current !== d){
    tip.show(d);
    tip.current = d;
  }

};


svg.call(tip);

queue()
.defer(d3.csv, 'data/figures.csv', function(d) {
  return {
    name: d['Nazwa'],
    type: d['Typ'],
    desc: d['Opis'],
    image: d['Obrazek'],
    x: positions[d['Nazwa']][0]*width/10 || 100,
    y: positions[d['Nazwa']][1]*height/10 || 100,
    genre: 'figure'

  }
})
.defer(d3.csv, 'data/links.csv', function(d) {
  return {
    source: d['A'],
    target: d['B'],
    name: d['Tytuł'],
    desc: d['Opis'],
    url: d['Link'],
    genre: 'link'
  }
}).await(function(error, figures, links) {

  _.each(links, function(link){
    var source = _.find(figures, {name: link.source});
    var target = _.find(figures, {name: link.target});
    link.source = {x: source.x, y:source.y}
    link.target = {x: target.x, y:target.y}
  })

  var links = svg.append("g")
    .attr("class", "g-links")
    .selectAll("g")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .on('click', toggleTooltip)
      .attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" +
            d.source.x + "," +
            d.source.y + "A" +
            dr + "," + dr + " 0 0,1 " +
            d.target.x + "," +
            d.target.y;
       })

  var circles = svg.append("g")
      .attr("class", "g-figures")
    .selectAll("g")
      .data(figures)
    .enter().append("g")
      .attr("class", function(d){
        return 'figure-'+classTypes[d.type];
      })
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

  circles.append("circle")
      .attr("r", (mugDiameter / 2) + 4)
      .attr("class", 'figure-circle-outer')

  circles.append("circle")
      .attr("r", mugDiameter / 2)
      .attr("class", 'figure-circle-inner')

  circles.append("image")
      .attr("xlink:href", figureImage)
      .attr("x", function(d, i) { return -mugDiameter / 2 })
      .attr("y", function(d, i) { return -mugDiameter / 2 })
      .attr("width", mugDiameter)
      .attr("height", mugDiameter)
      .attr("clip-path", "url(#g-mug-clip)")
      .style("pointer-events", "none")

   circles
      .attr('x', function(d) { return d.x })
      .attr('y', function(d, i) { return d.y })
      .on('click', toggleTooltip)

});