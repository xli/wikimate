(function(){
  wikimate = {version: '0.0.1'}
  wikimate.wiki = function(id) {
    return {
      story: function(elements) {
        d3.select(id).selectAll('.wikimate-element')
          .data(elements).enter()
          .append('div').classed('wikimate-element', true)
            .append('p')
            .attr('id', function(d) {return d['type'] + '-' + d['id'];})
            .text(function(d) {return d['text'];});
      },
    }
  }
})()
  