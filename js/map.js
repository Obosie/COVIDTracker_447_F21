

var markers = [];

    

function getRange(data) {
	minCases = Number.MAX_SAFE_INTEGER;
	maxCases = Number.MIN_SAFE_INTEGER;
	console.log(data.length)
	for(let e = 0; e < data.length; e++){


        let obj = data[e];
		if(obj.Address == null && obj.Jurisdiction == null){
			console.log("Object at ",e," is county information");
        }else{
			if (obj.Cases < minCases) {
				minCases = obj.Cases;
			}
			if (obj.Cases > maxCases) {
				maxCases = obj.Cases;
		}}
	}
	return [minCases, maxCases]
}


// Gets color value based on where a case value stands between the minimum and maximum Number
// of cases for a given date
function getColor(minCases,maxCases,cases){
	colors = ['#4477aa', '#5177af', '#5f76b3', '#6e75b6', '#7d74b7', '#8c72b7', '#9b70b5', '#a96db2', '#b76bad', '#c468a7', '#cf669f', '#d96497', '#e2648d', '#e96482', '#ee6677'];
	range = maxCases - minCases; 
	casesAdj = cases - minCases; 
	var percentageOfRange = casesAdj/range;
	colorNum = Math.floor(percentageOfRange * 15);
	if (colorNum == 15) {
		colorNum = 14;
	}
	return colors[colorNum];
}



function update(data){

    for(let i = 0; i < markers.length; i++){

        map.removeLayer(markers[i]);
        markers.pop();
    }
    markers.length = 0;
    

    caseRange = getRange(data);


    for(let e = 0; e < data.length; e++){

        let obj = data[e];
        if(obj.Address == null && obj.Jurisdiction == null){

            console.log("Object at ",e," is county information");
        }else{

            let name = obj.Name;
            let lat = obj.Latitude;
            let long = obj.Longitude;
            let cases = obj['Residents.Confirmed'] + obj['Staff.Confirmed'];


            var circle = new L.circle([lat,long], {
                color: 'grey',
                fillColor: getColor(caseRange[0],caseRange[1],obj.Cases),
                fillOpacity: 0.62,
                radius: 20000
            }).bindPopup(name + "  |  Cases: " + cases);
            
            markers.push(circle);
            circle.addTo(map);
        }
    }

}







$(document).ready(function() {

    $('#user_in').submit((e) => {
    
        e.preventDefault();
        
        var fdata = $('#userdate').val();
        
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