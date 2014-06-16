function populateSelect(id, data) {
    var select, option;
    
    //get the select element from the DOM - jquery problem with d3 : todo
    select = document.getElementById(id);
    $.each(data, function(key, val) 
        { 
            //create and add each title as option to the select
            option = document.createElement('option');
            option.value = option.text = val;
            select.add(option);
        });
}

$(document).ready(function() {     
     $.getJSON('./Data/DropVariables.json', function(data) {
         /*
         var items = [];
         
         //getting all the keys, i.e. column titles
         $.each(data['upperVariables'], function( key, val ) {
            items.push(key);
         });
         */
         //not liking this part at all - should re-arrange the json and then just slice the array
         var topSelectArray = data['upperVariables'];         
         var bottomSelectArray = data['lowerVariables'];
         var filtersSelectArray = data['Filters'];
         
         populateSelect('TopVariable', topSelectArray);         
         populateSelect('BottomVariable', bottomSelectArray);
         populateSelect('Filter', filtersSelectArray);
      });
  });
