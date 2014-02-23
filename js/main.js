var figuresCsv = "https://docs.google.com/spreadsheet/pub?key=0AnjnlTEMFP-idHo2aXcxVDQ3N3FLQzZvQm5uMnMtR1E&output=csv";
var linksCsv = "https://docs.google.com/spreadsheet/pub?key=0AnjnlTEMFP-idEM0N1UyWnRqeWlfakhrZ2tuZmNxMFE&output=csv";

var mugDiameter = 60;

var positions = {
  "Maciej Marcinkowski": [5,8.5],
  "Marcin Bajko": [9,1.5],
  "Hanna Gronkiewicz-Waltz": [5,0.5],
  "Jacek Wojciechowicz":[7.5,1],
  "Jolanta Zdziech-Naperty":[0.5,3],
  "Wojciech Bartelski":[1.5,1.5],
  "Działka na placu Defilad": [5,6],
  "Działka na placu Zamkowym": [2.75, 6.5],
  "Ogród Jordanowski na ul. Szarej":[6.5,6.5],
  "Parking na Krakowskim Przedmieściu":[1,8.5],
  "Kamienica na ul. Kazimierzowskiej": [9.5,6],
  "Boisko na Foksal": [8,7],
  "Kamienica na Alei Szucha": [9, 8.5],
  "Marek Mikos": [5.75, 2],
  "Gimnazjum na ul. Twardej": [1.5,7] ,
  "Pracownia Dawos": [7, 4.5],
  "Jakub Rudnicki": [8.5,4.5],
  "Ewa Nekanda-Trepka": [3,2.5],
  "Julia Pitera": [4.3,4.2]
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
};

var figureImage = function(d){
  return 'img/figures/' + figureId(d) + '.jpg';
};

var figureId = function(d){
  return cleanUpSpecialChars(d.name).toLowerCase().replace(/\s/g,'-');
};


var width = 1020,
    height = 800;


queue()
.defer(d3.csv, figuresCsv, function(d) {
  if(!positions[d['Nazwa']]){
    throw new Error('no position for' + d['Nazwa']) }
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
.defer(d3.csv, linksCsv, function(d) {
  return {
    source: d['A'],
    target: d['B'],
    name: d['Tytuł'],
    desc: d['Opis'],
    url: d['Link'],
    url2: d['Link2'],
    genre: 'link'
  }
}).await(function(error, figures, links) {

  if(error){
    throw error;
  }
  _.each(links, function(link){
    var source = _.find(figures, {name: link.source});
    var target = _.find(figures, {name: link.target});
    link.source = {x: source.x, y:source.y}
    link.target = {x: target.x, y:target.y}
  })

  var svg = d3.select(".main")
        .attr("style", "width:"+width+"px")
      .append("svg")
        .attr("width", width)
        .attr("height", height)
        .on('click', function(){
          tip.hide()
        })

  var mugCurcle = svg.append("defs").append("clipPath")
      .attr("id", "g-mug-clip")
    .append("circle")
      .attr("r", mugDiameter / 2);


  var curvedLine = function(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" +
        d.source.x + "," +
        d.source.y + "A" +
        dr + "," + dr + " 0 0,1 " +
        d.target.x + "," +
        d.target.y;
  }

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset(function(data){
      var group = link.filter(function (d) { return d === data })
      var circle = group.select('circle').node();
      if(data.genre === 'figure'){
        return [-25,0]
      }else{
        var target = d3.event.target.getBBox();
        var el = circle.getBBox();
        return [el.y-target.y-25,0]
        //return [target.x-el.x,target.y-el.y]
      }
    })
    .direction(function(d){
      if(d.x > 100 && d.y <100) return 's';
      if(d.x < 100 && d.y <100) return 'se';
      if(d.x > 850 && d.y < 150) return 'sw';
      if(d.x < 100 && d.y > 100) return 'e';
      return 'n';
    })
    .html(function(d) {
      var html = "<strong>" + d.name + "</strong><br/><br/>"+d.desc+"<br/><br/>";
      if (d.url){
        html += '<div class="d3-tip-link"><a href="'+d.url+'"  target="_blank">' + d.url + '</a></div>';
      }
      if (d.url2){
        html += '<div class="d3-tip-link"><a href="'+d.url2+'"  target="_blank">' + d.url2 + '</a></div>';
      }
      return html
    })

  svg.call(tip);


  var toggleTooltip = function(d){
    d3.event.stopPropagation();
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

  /*
    Links
  */
  var link = svg.append("g")
    .attr("class", "g-links")
    .selectAll("g")
      .data(links)
    .enter().append("g")
      .attr("class", "g-link")

    link.append("path")
      .attr("class", "link-outer")
      .attr("d", d3.svg.diagonal())
      .on('click', toggleTooltip)

    link.append("path")
      .attr("class", "link-inner")
      .on('click', toggleTooltip)
//       .attr("d", curvedLine)
      .attr("d", d3.svg.diagonal())

   link.append('circle')
      .attr("class", "link-circle")
      .attr("cx", function(d){
        var path = this.parentNode.getElementsByClassName('link-inner')[0]
        return path.getPointAtLength(path.getTotalLength()/2).x;
      })
     .attr("cy", function(d){
        var path = this.parentNode.getElementsByClassName('link-inner')[0]
        return path.getPointAtLength(path.getTotalLength()/2).y;
      })
      .attr("r", 8)
      .on('click', toggleTooltip)

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
      .attr("r", (mugDiameter / 2))
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

   circles.on('click', toggleTooltip)

});