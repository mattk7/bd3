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
     $.getJSON('./Data/data_joined.json', function(data) {
         
         var items = [];
         
         //getting all the keys, i.e. column titles
         $.each(data['Afghanistan'], function( key, val ) {
            items.push(key);
         });
         
         //not liking this part at all - should re-arrange the json and then just slice the array
         var topSelectArray = [items[0],items[2],items[3],items[4],items[6],items[7],items[11],items[16]];         
         var bottomSelectArray = $(items).not(topSelectArray).get();
         
         populateSelect('TopVariable', topSelectArray);         
         populateSelect('BottomVariable', bottomSelectArray);
      });
  });