



function update(data){

    for(let e = 0; e < data.length; e++){

        let obj = data[e];
        if(obj.Address == null && obj.Jurisdiction == null){

            console.log("Object at ",e," is county information");
        }else{

            let name = obj.Name;
            let lat = obj.Latitude;
            let long = obj.Longitude;

            var circle = L.circle([lat,long], {
                color: 'grey',
                fillColor: '#03b1fc',
                fillOpacity: 0.4,
                radius: 5000
            }).addTo(map);

            circle.bindPopup(name);
        }
    }
}







$(document).ready(function() {

    $('#user_in').submit((e) => {
    
        e.preventDefault();
        
        var fdata = $('#userdate').val();
        var action = e.currentTarget.action;
        
        $.ajax({
            type: "POST",
            url: "/get-data",
            async: false,
            data: {udate: fdata},
            dataType: "json",
            success: function(data){

                update(data);
                map.redraw();
            },
            error: function(jqXHR, textStatus, err){

                alert("Status: " + textStatus + ", Error: " + err);
            }
           
        });
    });

});