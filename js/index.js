
var bubble_map = new Datamap({
  element: document.getElementById("world"),
  done: function(map){
    map.svg.call(d3.behavior.zoom().on('zoom', redraw));
    function redraw(){
      map.svg.selectAll('g')
              .attr('transform', "translate("
                    + d3.event.translate + ")scale("
                    + d3.event.scale + ")");
    }
  },
    bubblesConfig: {
        borderWidth: 1
    }
});

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', function(error, data){
  
  if ( error == null )
    processData(data);
  
});

function processData(data){
  
 
  var maxRadius = 0;
  var radiusArr = [];
  
  for ( var index in data.features ){
    var r = data.features[index].properties.mass;
    if ( r != null )
      radiusArr.push( +r );
    else
      data.features[index] = null;
  }
  radiusArr.sort(function(a,b){
    return a > b ? 1 : a < b ? -1 : 0;
  });
  
  console.log('lowest: ' + radiusArr[0] + ' highest: ' + radiusArr[radiusArr.length-1]);
  
  var scaleByRadius = d3.scale.linear()
                      .clamp([true])
                          .domain([radiusArr[0], radiusArr[radiusArr.length-1] /5])
                            .range([2, 15]);
  
  
  // cause for 38. json element year is null
  data.features[37].properties.year = 'missing';
  
  var formated = [];
  for ( index in data.features ){
    
    if ( !data.features[index] || !data.features[index].geometry)
      continue;
    
    var coords = data.features[index]
                      .geometry
                        .coordinates;
    var current = data.features[index].properties;
    formated.push({
      name: current.name,
      latitude: coords[1],
      longitude: coords[0],
      mass: current.mass,
      radius: (function(){ 
          var val = scaleByRadius(+current.mass);
        console.log('mass: ' + current.mass + ' radScal: ' + val);
        return val;
      })(),
      class: current.recclass,
      year: current.year.substring(0,10)
      
      
    });
  }
  
  bubble_map.bubbles(
    formated,
    {   
      popupTemplate: function(geo, data) {
    return '<div class="hoverinfo">'
              + 'name: ' + data.name + '<br>'
              + 'class: ' + data.class + '<br>'
              + 'mass: ' + data.mass + '<br>'
              + 'longitude: ' + data.longitude + '<br>'
              + 'latitude: '  + data.latitude;
  }
});
  
}