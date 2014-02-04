var mugDiameter = 70;

var positions = {
  "Maciej Marcinkowski": [5,9],
  "Marcin Bajko": [8.5,2],
  "Hanna Gronkiewicz-Waltz": [5,1],
  "Jacek Wojciechowicz":[7,1.5],
  "Jolanta Zdziech-Naperty":[1,3.5],
  "Wojciech Bartelski":[1.5,1.5],
  "Działka na placu Defilad": [5, 5.5],
  "Działka na placu Zamkowym": [2, 7],
  "Ogród Jordanowski na ul. Szarej":[6,6.5],
  "Parking na Krakowskim Przedmieściu":[1,8],
  "Kamienica na ul. Kazimierzowskiej": [9.5,6],
  "Boisko na Foksal": [7.5,7],
  "Kamienica na aleji Szucha": [9, 8],
  "Marek Mikos": [6, 2.5],
  "Gimnazjum na ul. Twardej": [3.5,6] ,
  "Pracownia Dawos": [6.5, 4.5],
  "Jakub Rudnicki": [8,4],
  "Ewa Nekanda-Trepka": [3,2]
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



queue()
.defer(d3.csv, 'data/figures.csv', function(d) {
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
      var group = links.filter(function (d) { return d === data })
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
    .html(function(d) {
      var html = "<strong>" + d.name + "</strong><br/><br/>"+d.desc+"<br/><br/>";
      if (d.url){
        html += '<a href="'+d.url+'">' + d.url + '</a>';
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
  var links = svg.append("g")
    .attr("class", "g-links")
    .selectAll("g")
      .data(links)
    .enter().append("g")
      .attr("class", "g-link")

    links.append("path")
      .attr("class", "link-outer")
      .attr("d", d3.svg.diagonal())
      .on('click', toggleTooltip)

    links.append("path")
      .attr("class", "link-inner")
      .on('click', toggleTooltip)
//       .attr("d", curvedLine)
      .attr("d", d3.svg.diagonal())

   links.append('circle')
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