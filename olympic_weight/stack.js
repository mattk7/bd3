// http://bl.ocks.org/mbostock/3020685

var height = 600; // canvas height
var width = 1000; // canvas width

///////________________________________________

var m = [79, 80, 80, 79],
    w = width - m[1] - m[3],
    h = height - m[0] - m[2];

var colors = d3.scale.ordinal()
    .range(colorbrewer.RdBu[9]);

// Scales. Note the inverted domain for the y-scale: bigger is up!
var x = d3.scale.linear().range([0, w]),
    y = d3.scale.linear().range([h, 0]),
    x_dom = [],
    x_dom_zoom = [];

// Axes.
var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

// The area generator.
var area = d3.svg.area()
    .x(function(d) {return x(d.x) })
    .y0(function(d){return y(d.y0)   })
    .y1(function(d){return y(d.y0+d.y) })
    .interpolate('cardinal');

// The plotter
function plotter(stackedData) {
    console.log(stackedData)
    index_last_stack=stackedData.length-1
    y_dom = [0, 1.1* d3.max(stackedData[index_last_stack].values, function(d) { return d.y0+d.y; })]
     
    x.domain(x_dom);
    y.domain(y_dom);

    svg.select('.x.axis').transition().call(xAxis.tickSubdivide(0).tickSize(6));
    svg.select('.x.grid').transition().call(xAxis.tickSubdivide(1).tickSize(-h));
    svg.select('.y.grid').transition().call(yAxis.tickSubdivide(1).tickSize(-w));
    svg.select('.y.axis').transition().call(yAxis.tickSubdivide(0).tickSize(6));
     
                    
    var gen = stackcontainer.selectAll("path.generator")
      .data(stackedData, function(d){
          return d.key
      })
           
    gen.enter()
        .append("svg:path")
        .attr("class", "generator")
        .attr('opacity', 0)
        .style("fill", '#eee' )
    
    gen.attr("clip-path", "url(#clip)")
        .transition()
        .duration(1000)
        .delay(function(d,i){
            return 5*i;
        })
        .style("fill",   function(d,i){ return colors(i); } )
        .attr('opacity', 1)        
        .attr("d", function(d){
            return area(d.values)
        })

    
/////   DO THIS!!!!!!!!!!!!!!!!!!!!!
// hover transitions
//    http://bl.ocks.org/GerHobbelt/3480186
//    http://bl.ocks.org/WillTurman/4631136

    gen.exit()
        .transition()
        .duration(250)
        .remove(); 

d3.csv('data/olympics_2012_clean.csv', function(data){
///////////////

    data.forEach(function(d){ 
        // casting to integer
        d.Weight = +d.Weight;
        d.Gold = +d.Gold;
        d.Silver = +d.Silver;
        d.Bronze = +d.Bronze;
    });
    
    // All `x` values
    xValues=[]
    for(s in sportWeight[0].values){
        xValues.push(sportWeight[0].values[s].x)
    }

    
    // Golds
    var golds = d3.nest()
        .key(function(d){return d.Gold;})
        .entries(data)

    /* Create the lookup table */
    var tableGold = [];
//    sportWeight.forEach(function(d){
//        tableGold[d.key] = [];
//    })
    
//    golds.forEach(function(d) {
//        if (d.key != 0){
//            d.values.forEach(function(d){
//                tableGold[d.Sport].push({'Weight': d.Weight});
//            })
//        }
//    });
    golds.forEach(function(d) {
        if (d.key != 0){
            d.values.forEach(function(d){
                tableGold.push({'key': d.Sport, 'values': [{'Weight': d.Weight}]});
            })
        }
    });

    tableGold = d3.nest()
        .key(function(d){
            return d.Sport;
        })
        .entries(data);
    
    
    console.log(tableGold);
    var medalContainer = svg.append('g')
        .attr('class', 'medalContainer')
        .selectAll('g.medalContainer')
        .data(tableGold, function(d){ return d.key; });

    medalContainer.exit().remove();

    medalContainer
    .enter()
    .append("g")
        .attr('class', 'sportMedals')

    function interpY(d) {
        xClosest = xValues.filter(function(l){ return d.Weight < l; })[0]
        p1 = stackedData[0].values[xValues.indexOf(xClosest)-1]
        p2 = stackedData[0].values[xValues.indexOf(xClosest)]
        function jitterY(p1){
        return p1.y0+p1.y*(.4 + .2* Math.random())
    }

    yGold = jitterY(p1) + (jitterY(p2) - jitterY(p1)) * (d.Weight-p1.x)/(p2.x-p1.x)

    return y(yGold);
    }
    
    medalContainer
        .transition()
        .duration(600)
        .each(function(d) {
//            console.log(d)
            var medalGroup = d3.select(this)

            d.values.forEach(function(dd){
//                console.log(dd)
                if(dd.Gold != 0) {          
                    medalGroup.append('circle')
                    .attr('class', 'gold')
                    .attr("cx", x(dd.Weight))
                    .attr("cy", interpY(dd))
                    .attr('r', 5)
                }


            })    
        });

           //--------  HOVER

    var infobox = d3.select("body")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "100")
        .style("visibility", "hidden")
        .style("top", "80px")
        .style("left", "700px");    

    

    svg.selectAll("path.generator")
        .attr("opacity", 1)
        .on("mouseover", function(d, i) {
          svg.selectAll("path.generator")
          .transition()
          .duration(300)
          .attr("opacity", function(d, j) {
            return j != i ? 0.6 : 1;
    })})
    
    .on("mousemove", function(d, i) {
      mousex = d3.mouse(this);
      mousex = mousex[0];
      var invertedx = x.invert(mousex);
      var selected = d.values;
//      for (var k = 0; k < selected.length; k++) {
//        datearray[k] = selected[k].date
//        datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
//      }
//
//      mousedate = datearray.indexOf(invertedx);
//      pro = d.values[mousedate].value;

    d3.select(this)
        .classed("hover", true)
        .attr("stroke", '#fff')
        .attr("stroke-width", "0.5px"), 
        infobox.html( "<p>" + d.key + "<br>" + 'text' + "</p>" ).style("visibility", "visible");

    })

    .on("mouseout", function(d, i) {
        svg.selectAll(".generator")
        .transition()
        .duration(300)
        .attr("opacity", "1");
        d3.select(this)
        .classed("hover", false)
        .attr("stroke-width", "0px"), infobox.html( "<p>" + d.key + "<br>" + 'text' + "</p>" ).style("visibility", "hidden");
  })

});

} // END plotter

var svg = d3.select("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

svg.append("svg:rect")
    .attr("class", 'bg')
    .attr("width", w)
    .attr("height", h);

svg.append("svg:clipPath")
    .attr("id", "clip")
  .append("svg:rect")
    .attr("x", x(0))
    .attr("y", y(1))
    .attr("width", x(1) - x(0))
    .attr("height", y(0) - y(1));

svg.append("svg:g")
  .attr("class", "x grid")
  .attr("transform", "translate(0," + h + ")")
  .call(xAxis.tickSubdivide(0).tickSize(-h));

svg.append("svg:g")
  .attr("class", "y grid")
  .attr("transform", "translate(0,0)")
  .call(yAxis.tickSubdivide(1).tickSize(-w));

svg.append("svg:g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + h + ")")
  .call(xAxis.tickSubdivide(0).tickSize(6));

svg.append("svg:g")
  .attr("class", "y axis")
  .call(yAxis.tickSubdivide(0).tickSize(6));

            
var stackcontainer = svg.append('g').attr('class', 'stackcontainer')

//////////////////////////
// The CSV function
d3.csv("data/hist.csv", function(data) {
    
    // And then was the data...
    data.forEach(function(d){ 
        d.x = +d.x; // casting to integer
        d.y = +d.y; // casting to integer
    });

    sportWeight = d3.nest()
        .key(function(d){
            return d.Sport;
        })
        .entries(data);

//    console.log(colors(0))
    
    // Stack
    stack = d3.layout.stack()
        .offset("zero")
        .values(function(d){
            return d.values;
        })
 
    stackValues = stack(sportWeight)
  
//    index_last_stack=stackValues.length-1
//    console.log(stackValues.length) 
  
    minWeight = d3.min(data, function(d){ return d.x; });
    maxWeight = d3.max(data, function(d){ return d.x; });

  // Compute the minimum and maximum weight, and the maximum counts.
  // d0 = stack_gens[0].map(function(d){return d.x}); //the whole domain
  x_dom = [30, 150]//[minWeight, maxWeight]
  x_dom_zoom = [40, 120]; //just a small part of domain
  
    plotter(stackValues)

});  // d3.csv END

// On click, update the x-axis.
//svg.on("click", function() {
//  var new_dom = x.domain()[0] - x_dom[0] ? x_dom : x_dom_zoom;
//  x.domain(new_dom);
//  var t = svg.transition().duration(d3.event.altKey ? 7500 : 750);
//  t.select("g.x.grid").call(xAxis.tickSubdivide(1).tickSize(-h));
//  t.select("g.y.grid").call(yAxis.tickSubdivide(1).tickSize(-w));
//  t.select("g.x.axis").call(xAxis.tickSubdivide(0).tickSize(6));
//  t.select("g.y.axis").call(yAxis.tickSubdivide(0).tickSize(6));
//  t.selectAll("path.generator").attr("d", function(d){
//      return area(d.values)
//  });
//});
        
            
///////________________________________________