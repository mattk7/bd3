d3.csv('./Data.csv', function(data){
                
    // console.log(data);

    var data_by_series = d3.nest()
        .key(function(d){
            return d['Series Name'];
        })

        .sortKeys(d3.ascending)
    .rollup(function(d){
	return {
	    years: d3.entries(d)
	}
    })
        .entries(data);

    // console.log(data_by_country);

    console.log(data_by_series);

    // var data_by_country_by_year = d3.nest()
    //     .key(function(d){
    //         return d['Country Name'];
    //     })
    //     .sortKeys(d3.ascending)
    //     .entries(data);

    // var gdp_by_country = d3.nest()
    // 	.key(function(d){
    // 	    return d['NY.GDP.MKTP.CD']
    // 	})
    // 	.sortKeys(d3.ascending)
    // 	.entries(data);

    var countries = d3.select('svg')
	.attr('height',1000)
	.selectAll('g')
        .data(data_by_series)
	.enter()
	.append('g')
	.attr('transform', function(d,i){ return 'translate(0,' + i*21 + ')';});
    
    // countries.append('rect')
    // 	.attr('width', function(d,i){return 50})
    // 	.attr('height',function(d,i){return 20});

    // console.log(data_by_country);
    countries.append('text')
	.text(function(d,i){return d.key;})
	// .attr('width', function(d,i){return 50})
	// .attr('height',function(d,i){return 20});

    var minAge = d3.min(data,function(d){return d['NY.GDP.MKTP.CD']});
    var maxAge = d3.max(data,function(d){return d['NY.GDP.MKTP.CD']});
    
    // console.log(minAge);
    // console.log(maxAge);

    var mapCol = d3.scale.linear()
	.domain([minAge,maxAge])
	.range([0,1]);
              
    countries.selectAll('rect')
	.data(data_by_series)
	.enter()
	.append('rect')
        .attr('width',function(d){return d['NY.GDP.MKTP.CD'];})
	.attr('height',10)
	.attr('y',10)
	// .append('circle')
	// .attr('r',5)
	.style('fill','red')
	.style('fill-opacity',function(d){return mapCol(d['NY.GDP.MKTP.CD'])})
	// .attr('cy',10)
	// .attr('cx',function(d,i){return 100+i*10});
    
    
    
    
    // console.log(data_by_country)
    
});
        
