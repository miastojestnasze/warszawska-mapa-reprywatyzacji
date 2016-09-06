var d3 = require('d3');
var d3tip = require('d3-tip')(d3);

function get_direction(d) {
    var x = d.x, y=d.y;
    if(!x||!y){
      x = (d.source.x + d.target.x)/2;
      y = (d.source.y + d.target.y)/2;
    }
    if(x > 200 && y < 250) return 's';
    if(x < 200 && y < 250) return 'e';
    if(x > 1000) return 'w';
    if(x < 200 && y > 200) return 'e';
    return 'n';
}

module.exports = d3.tip()
  .attr('class', function(){
    return 'd3-tip';
  })
  .offset(function(d){
    var direction = get_direction(d);
    switch(direction) {
        case 'n':
            return [-10,0];
        case 's':
            return [10,0];
        case 'e':
            return [0,10];
        case 'w':
            return [0,-10];
    }
  })
  .direction(function(d){
      return get_direction(d);
  })
  .html(function(d) {
    var html = "";

    if(d.name) {
        html += "<strong>" + d.name + "</strong><br/><br/>";
    }

    html += d.desc;

    if (d.links && d.links.length){
      html += '<div class="links meta-section"><strong>Odnośniki:</strong><br>';

      for(var j=0; j < d.links.length; j++) {
          html += '<div class="link"><a target="_blank" href="' + d.links[j] + '">' + d.links[j] + '</a></div>';
      }

      html += '</div>';
    }

    if (d.properties && d.properties.length){
      html += '<div class="meta-section"><strong>Powiązane nieruchomości:</strong><br>';
      for(var i=0; i < d.properties.length; i++) {
          html += '<span class="property">' + d.properties[i] + '</span>';
      }
      html += '</div>';
    }
    return html;
});
