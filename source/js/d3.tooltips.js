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
    var html = "<strong>" + d.name + "</strong><br/><br/>"+d.desc+"<br/><br/>";
    if (d.url){
      html += '<div class="d3-tip-link"><a href="'+d.url+'"  target="_blank">' + d.url + '</a></div>';
    }
    if (d.url2){
      html += '<div class="d3-tip-link"><a href="'+d.url2+'"  target="_blank">' + d.url2 + '</a></div>';
    }
    return html;
});
