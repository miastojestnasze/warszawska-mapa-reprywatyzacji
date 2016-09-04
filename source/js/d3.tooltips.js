var d3 = require('d3');
var d3tip = require('d3-tip')(d3);

module.exports = d3.tip()
  .attr('class', function(){
    return 'd3-tip';
  })
  .offset(function(data){
    return [-12,0];
  })
  .direction(function(d){
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
