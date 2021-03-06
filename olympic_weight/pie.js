var pie_width = 300,
    pie_height = 200,
    pie_radius = Math.min(pie_width, pie_height) / 2

var pie_color = d3.scale.ordinal()
    .range(["#98abc5", "#ffc5ab"])

var pie_arc = d3.svg.arc()
    .outerRadius(pie_radius - 10)
    .innerRadius(pie_radius * 0.5)

var pie = d3.layout.pie()
    .value(function(d){return d.values.length })

var svg = d3.select("div#widget_container").append('div')
    .attr('class', 'single_widget')
    .attr('id', function(d,i){
        return i
    })
    .append("svg")
    .attr("width", 900)
    .attr("height", pie_height)
  .append("g")
    .attr("transform", "translate(" + pie_width / 2 + "," + pie_height / 2 + ")")

function make_pie(pie_data) {
    console.log('pie_data:', pie_data)
//    pie_array = []
//    if (pie_data.length > 0){
//        for(i=0;i<pie_data[0].values.length;i++){
//            var sex = pie_data[0].values[i].key
//            var population = pie_data[0].values[i].values.length
//            pie_array.push({gender:sex, pop:population})
//        }
//    }
//    console.log('pie_array', pie_array)

    var allPies = svg.selectAll('g.pie')
        .data(pie_data)
    
    allPies.enter()
        .append('g')
        .attr('class', 'pie')
      .attr("transform", function(d,i){
          return "translate(" + i * pie_width + ", 0)"
      })
    allPies.exit().remove()

  var grPie = allPies.selectAll("path")
      .data(function(d){return pie(d.values)})

  grPie.enter()
      .append("path")
      .attr("d", pie_arc)
      .style("fill", function(d){return pie_color(d.data.values)})
/*
  .append("text")
      .attr("transform", function(d) { return "translate(" + pie_arc.centroid(d) + ")" })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.Sex; })
*/
  grPie.exit().remove();

}
