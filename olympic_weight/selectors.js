            ///////////////////////////////////

            // Importing the data from scratch
            
            var data = d3.csv('data/olympics_2012_clean.csv', function(data){
            ///////////////
            
            	// Nest the array in two levels
                var data_by_sport_and_gender = d3.nest()
                    .key(function(d){return d.Sport;})
                    .key(function(d){return d.Sex;})
                    .entries(data)
                
                
                function update_widgets(widget_sports){
//                    console.log('widget sport: ', widget_sports)
                    // Select all present and future <g class="widget"> objects
                    var widgets = svg.selectAll('g.widget')
                        .data(widget_sports)

                    // if widget exists in the canvas and we don't want it anymore
                    widgets.exit()
                        .remove()

                    // if not exists then create
                    widgets.enter()
                        .append('g')
                        .attr('class', 'widget')
                }
// This array contains the objects representing the nations the user selected.
                var widget_sports = []
                
                d3.select('#buttons')
                    .selectAll('button.widget_trigger')
                    .data(data_by_sport_and_gender)
                    .enter()
                    .append('button')
                    .attr('class', 'widget_trigger')
                    .attr('id', function(d){
                        return d.key
                    })
                    .text(function(d){
                        return d.key
                    })
                
                d3.select('#buttons')
                    .selectAll('button.widget_reset')
                    .data(['Reset'])
                    .enter()
                    .append('button')
                    .attr('class', 'widget_reset')
                    .text(function(d){
                        return d
                    })
                
                d3.selectAll('.widget_trigger')
                    .on('click', function(){
                        var sport = this.id
                        selected_data = data_by_sport_and_gender
                            .filter(function(d){
                                return (d.key == sport )
                            }).pop()
                        var i = widget_sports.indexOf(selected_data) // Look for nation in array.
                        if (i > -1) {                                 // If nation in array...
                            widget_sports.splice(i, 1)               // ... pop it out.
                        } else {
                            widget_sports.push(selected_data)        // else push new nation in array.
                        }
                        update_widgets(widget_sports)       // Update widget view
                        update_stack(widget_sports)
                        make_pie(widget_sports)
                        })

            d3.select('.widget_reset')
                .on('click', function(){
                    widget_sports = []
                    update_widgets(widget_sports)
                    update_stack(widget_sports)
                    make_pie(widget_sports)
                    })
            });
            
            
// --------- Update Distribution ---------------

function update_stack(widget_sports){
//    var t = svg.transition().duration(d3.event.altKey ? 7500 : 750);
    var selectedWeight = sportWeight.filter(function(d){
        selectedKeys=[]
        for(s in widget_sports){
            selectedKeys.push(widget_sports[s].key)
        }
        return ( selectedKeys.indexOf(d.key) > -1 )
        })
    
//    console.log('selectedWeight:', selectedWeight);
    if(selectedKeys.length != 0) {
        plotter(stack(selectedWeight));
    }
    else {
        plotter(stack(sportWeight));
    }
    }
