function adjusted_sport_names(d) {
        if (d.Sport.indexOf("Cycling") > -1) {
            return "Cycling"
        } else if (d.Sport == "Athletics, Triathlon") {
            return "Athletics";
        } else {
            return d.Sport;
        }
}

function nesting (data){
    var newdata = d3.nest()
        .key(function(d){
            return adjusted_sport_names(d);
        })
        .sortKeys(d3.ascending)
        .key(function(d) { 
            return d.Age;
        })
        .sortKeys(d3.ascending)
        .key(function(d) { 
            return d.Sex; 
        })
        .entries(data);
    return newdata;
}

function medals(people) {
    var medals = {Bronze: 0,
                  Silver: 0,
                  Gold: 0};
    people.forEach(function (person) {
        medals.Bronze += parseFloat(person.Bronze) || 0;
        medals.Silver += parseFloat(person.Silver) || 0;
        medals.Gold += parseFloat(person.Gold) || 0;
    });
    return medals;
}

function gold_medals(people) {
    return medals(people).Gold;
}

function add_reference_lines(chart, range_x, range_y, scale_x, scale_y) {
    var i;
    
    for (i = range_y[0]; i <= range_y[1]; i++) {
        if (i % 10 == 0) {
            console.log(i, scale_x(range_x[0]), scale_x(range_x[1]), scale_y(i));
            chart.append('line')
                .attr('x1', scale_x(range_x[0])).attr('x2', scale_x(range_x[1]))
                .attr('y1', scale_y(i)).attr('y2', scale_y(i))
                .style('stroke', '#eee');
        }
    }
}

function start() {
    
    var CHART_X = 50;
    var CHART_Y = 20;
    var INNER_WIDTH = 900;
    var INNER_HEIGHT = 480;
    var AXIS_MARGIN = 10;
    
    var COLOR_MALE = '#5B97CC';
    var COLOR_FEMALE = '#D47874';

    var svg = d3.select('svg');


    d3.csv('olympics_2012.csv', function (raw_data) {
        var nested_data = nesting(raw_data);
        
        var sport_names = nested_data.map(function (d) { return d.key });
        console.log("NAMES", sport_names);
        
        var age_range = [10, 75];
        var range_x = [-0.7, sport_names.length - 0.3];
        
        var chart = svg.append('g')
            .attr('class', 'chart')
            .attr('transform', 'translate(' + CHART_X + ', '
                                            + CHART_Y + ')');

        // axis X
        var scale_x = d3.scale.linear()
            .domain(range_x)
            .range([0, INNER_WIDTH]);
        var axis_x = d3.svg.axis()
            .scale(scale_x)
            .orient('bottom')
            .tickValues(d3.range(sport_names.length))
            .tickSize(10)
            .outerTickSize(0)
            .tickFormat('');
        var axis_x_g = chart.append('g')
            .attr('class', 'axis_x')
            .attr('transform', 'translate(0, ' + (INNER_HEIGHT + AXIS_MARGIN) + ')');
        axis_x_g.call(axis_x);
        axis_x_g.selectAll('text.sport')
            .data(sport_names)
            .enter()
            .append('text')
            .attr('text-anchor', 'end')
            .attr('transform', function (d, i) {
                return 'translate(' + scale_x(i + 0.2) + ',20),rotate(-45)'
            })
            .attr('class', 'sport')
            .text(function (d, i) { return d; })
            .attr('y', 0);
        
        // axis Y
        var scale_y = d3.scale.linear()
            .domain(age_range)
            // Put 0 on the bottom.
            .range([INNER_HEIGHT, 0]);
        var axis_y = d3.svg.axis()
            .ticks(7)
            .scale(scale_y)
            .orient('left');
        
        chart.append('g')
            .attr('class', 'axis_y')
            .attr('transform', 'translate(' + (-AXIS_MARGIN) + ',0)')
            .call(axis_y);
        
        add_reference_lines(chart, range_x, age_range, scale_x, scale_y);
        
        // data layers
        var sports = chart.selectAll('g.cluster-column')
            .data(nested_data)
            .enter()
            .append('g').attr('class', 'cluster-column')
            .attr('transform', function (d, i) {
                return 'translate(' + scale_x(i) + ', 0)';
            });
        
        var age_groups = sports.selectAll('g.cluster')
            .data(function(d){
                 return d.values;
            })
            .enter()
            .append('g')
            .attr('class', 'cluster')
            .attr('transform', function (d, i) {
                return 'translate(0, ' + scale_y(d.key) + ')';
            });
        
        
        var MAX_PEOPLE = 111;
        
        var scale_opacity = d3.scale.log()
            .domain([1, MAX_PEOPLE])
            .range([0.6, 1]);
        var scale_width = d3.scale.log()
            .domain([1, MAX_PEOPLE])
            .range([2, 15]);
        
        var max = 0;
        
        var genders = age_groups.selectAll('circle')
            .data(function (d) {
                return d.values;
            })
            .enter()
            .append('g');
            
        //adding the gendered distribution
        genders.append('rect')
        .attr('x', function (d, i) {
                if (d.key == 'F'){
                    return -scale_width(d.values.length) - 3;
                }
                else {
                    return 0;
                }
            })
            .attr('y', 0)
            .attr('width', function (d, i) {
                return scale_width(d.values.length);
            })
            .attr('height', function (d, i) {
                return 8;
            })
            .style('opacity', 0.5)
            .attr('fill', function (d, i) {
                if (d.key == 'F'){
                    return COLOR_FEMALE;
                }
                else {
                    return COLOR_MALE;
                }
            })
        .on('mouseover', function(d, i) {
            //gold olymic medals *********************
            //Get this squares x/y values, then augment for the tooltip
            /*var coordinates = [0, 0];
                coordinates = d3.mouse(this);
                console.log(coordinates);

                var xPositionTT = coordinates[0];
                var yPositionTT = coordinates[1];

                medals(people).Gold
                */
            function getInfoMedals(d,i){
                goldArray = []

                for (i=0; i<d.values.length; i++){
                    console.log(d);
                    if (d.values[i].Gold){
                        var goldCount = parseFloat(d.values[i].Gold); 
                        goldArray.push(goldCount);
                    }
                }
                
                return goldArray.length;
            }

            function getInfoName(d,i){
                namesArray = [];

                for (i=0; i<d.values.length; i++){
                    
                    if (d.values[i].Gold){
                        var nameTTinfo = d.values[i].Name;
                        namesArray.push(nameTTinfo);
                    }
                }

                return namesArray;
            }

            function getInfoCountry(d,i){
                countriesArray = [];
                for (i=0; i<d.values.length; i++){
                    if (d.values[i].Gold){
                        var countryTTinfo = d.values[i].Country;
                        countriesArray.push(countryTTinfo);
                    }
                } 
                return countriesArray; 
            }

        function getInfoAge(d,i){
                ageArray = [];
                for (i=0; i<d.values.length; i++){
                    
                    if (d.values[i].Gold){
                        var ageTTinfo = d.values[i].Age;
                        ageArray.push(ageTTinfo);
                    }
                }
               return ageArray[0]; 
            }
            
            function getAllAthletes(d,i){
                
                console.log(d.values.length)
                return d.values.length;
            }
            

                        //Update the tooltip values
            d3.select("#tooltip")
            .style("left", 960 + "px")
            .style("top", 48 + "px")
            .style("border", 1)
            .select("#nameTT")
            .text(getInfoName(d))

            d3.select("#tooltip")
            .select("#countryTT")
            .text(getInfoCountry(d))

            d3.select("#tooltip")
            .select("#ageTT")
            .text(getInfoAge(d))

            d3.select("#tooltip")
            .select("#medalsTT")
            .text(getInfoMedals(d))
            
            d3.select("#tooltip")
            .select("#allAthletesTT")
            .text(getAllAthletes(d))
        });

        
        //adding the gold medal boxes + mouseover info 
        genders
            .append('rect')
            .attr('x', function (d, i) { 
                if (d.key == ('F')){
                    return -Math.ceil(gold_medals(d.values)) - 3;
                }
                else {
                    return 1;
                } 
            })
            .attr('y', function (d, i) { return 1; })
            .attr('width', function (d, i) {
                var cnt = Math.ceil(gold_medals(d.values));
                if (cnt > 0) {
                    return cnt + 1;
                } else {
                    return 0;
                }
            })
            .attr('height', 6)
            .style('fill', function (d, i) {
                return "black";
            })

        //legend
        LEGEND_WIDTH = 200
        WIDTH_RECT = 40
        HEIGHT_RECT = 25
        VSPACE = 10

        var legend = chart.append('g')
        .attr('class','legend')
        .attr('transform','translate(' + (INNER_WIDTH - LEGEND_WIDTH) + ',0)')
        .style('font-size','18px')
        legend.append('rect')
        .attr('x', 20)
        .attr('y',0)
        .attr('width',170)
        .attr('height',125)
        .style('fill','white')
        .style('stroke','gray')

        legend.append('rect')
        .attr('x', 30)
        .attr('y', 10)
        .attr('width', WIDTH_RECT)
        .attr('height', HEIGHT_RECT)
        .style('fill', COLOR_FEMALE)

        legend.append('text')
        .attr('x', 80)
        .attr('y', 29)
        .text('Females \u2640')
        .style('fill',COLOR_FEMALE)

        legend.append('rect')
        .attr('x', 30)
        .attr('y', 50)
        .attr('width', WIDTH_RECT)
        .attr('height', HEIGHT_RECT)
        .style('fill',COLOR_MALE)

        legend.append('text')
        .attr('x', 80)
        .attr('y', 34 + HEIGHT_RECT + VSPACE)
        .text('Males \u2642')
        .style('fill',COLOR_MALE)

        legend.append('rect')
        .attr('x', 30)
        .attr('y', 90)
        .attr('width', WIDTH_RECT)
        .attr('height', HEIGHT_RECT)
        .style('fill','black')

        legend.append('text')
        .attr('x', 80)
        .attr('y', 39 + 2*HEIGHT_RECT + 2*VSPACE)
        .text('Gold medals')
        .style('fill','black')
    });
};

// Start the viewer after all the libs load.
$(start);

/* 

*/
