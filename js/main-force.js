var mugDiameter = 70;

var figuresStrokes = {
  "handlarz roszczeniami": "red",
  "urzędnik": "rgb(84, 124, 226)",
  "nieruchomość": "rgb(67, 145, 73)"
}
var figureImage = function(d){
  return 'img/figures/' + figureId(d) + '.jpg';
}

var figureId = function(d){
  return d.name.toLowerCase().replace(/\s/g,'-');
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
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>" + d.name + "</strong><br/>"+d.desc;
  })

svg.call(tip);

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-420)
    .linkDistance(30)
    .size([width, height]);

queue()
.defer(d3.csv, 'data/figures.csv', function(d) {
  return {
    name: d['Nazwa'],
    type: 'figure',
    desc: d['Opis'],
    image: d['Obrazek'],
    subType: d['Typ']

  }
})
.defer(d3.csv, 'data/links.csv', function(d) {
  return {
    name: d['Tytuł'],
    desc: d['Opis'],
    url: d['Link'],
    type: 'connection',
    from: d['A'],
    to: d['B'],
  }
}).await(function(error, figures, connections) {

  var links = [], bilinks=[];

  nodes = figures.concat(connections);

  _.each(connections, function(connection){
    var from = _.find(figures, {name: connection.from});
    var to = _.find(figures, {name: connection.to});
    links.push({source: from, target: connection}, {source: connection, target: to});
  })

  force
      .nodes(nodes)
      .links(links)
      .start();

  var link = svg.selectAll(".link")
      .data(links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", 3);


  var figures = svg.append("g")
      .attr("class", "g-figures")
    .selectAll("g")
      .data(_.where(nodes, {type: 'figure'}))
    .enter().append("g")
      .attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")";
      })
      .call(force.drag);
      
  figures.append("circle")
      .attr("r", mugDiameter / 2)
      .style("stroke", function(d){
        return figuresStrokes[d.subType];
      })
      .style("stroke-width", 10)
      .on('mouseover', function(d){
        d3.select(this)
          .transition().duration(150)
          .ease("cubic-in")
          .style("stroke", 'black');
      })
      .on('mouseout', function(d){
        d3.select(this).style("stroke", figuresStrokes[d.subType]);
      })
      
  figures.append("image")
      .attr("xlink:href", figureImage)
      .attr("x", function(d, i) { return -mugDiameter / 2 })
      .attr("y", function(d, i) { return -mugDiameter / 2 })
      .attr("width", mugDiameter)
      .attr("height", mugDiameter)
      .attr("clip-path", "url(#g-mug-clip)")
      .style("pointer-events", "none")
      
   figures
      .attr('x', function(d) { return d.x })
      .attr('y', function(d, i) { return d.y })
      .on('click', function(d){
        var current = _.find(nodes, {tip:true});
        if(current){
          tip.hide(d);  
          current.tip = false;
        }        
        if(current !== d){
          tip.show(d);
          d.tip = true;
        }        
      })
  
  
  var conn = svg.append("g")
        .attr("class", "g-dots")
      .selectAll("circle")
      .data(_.where(nodes, {type: 'connection'}))
      .enter().append("circle")
      .attr("class", 'connection')
      .attr("r", 5)
      .style("fill", 'black')
  
          
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    figures.attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")";
      });

    conn.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });


  });


});