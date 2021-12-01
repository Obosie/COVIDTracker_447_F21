

var geo = L.geoJSON(ca, {

    style: {"stroke": false,"fillColor": "#D3D3D3", "fillOpacity": 0.4},

    onEachFeature: function(feature, layer){

        if(feature.properties){

            var kind = feature.properties.kind;
            var name = feature.properties.name;
                   
            layer.bindPopup(name + " " + kind);
        }
    }
});
function mapInit(){
    
    geo.addTo(map);
}




var markers = [];
var countyData = [];


function getCountyRange(data){

    minCases = Number.MAX_SAFE_INTEGER;
	maxCases = Number.MIN_SAFE_INTEGER;
	console.log(data.length)
	for(let e = 0; e < data.length; e++){


        let obj = data[e];
		if(obj.Address == null && obj.Jurisdiction == null){
			
            let cases = obj.Cases;

			if (cases < minCases) {
				minCases = cases;
			}
			if (cases > maxCases) {
				maxCases = cases;
		    }
        }
	}
	return [minCases, maxCases]
}
    

function getPrisonRange(data) {
	minCases = Number.MAX_SAFE_INTEGER;
	maxCases = Number.MIN_SAFE_INTEGER;
	console.log(data.length)
	for(let e = 0; e < data.length; e++){


        let obj = data[e];
		if(obj.Address != null && obj.Jurisdiction != null){
			
            let cases = obj['Residents.Confirmed'] + obj['Staff.Confirmed'];

			if (cases < minCases) {
				minCases = cases;
			}
			if (cases > maxCases) {
				maxCases = cases;
		}}
	}
	return [minCases, maxCases]
}


// Gets color value based on where a case value stands between the minimum and maximum Number
// of cases for a given date
function getColor(minCases,maxCases,cases){


	
    let gradient = [
        '#ab7fcd',
        '#a276c4',
    
        '#8f64b2',
        '#855ba9',
    
        '#734997',
        '#6a408e',
    
        '#572f7d',
        '#4e2675',
    
        '#3c1464',
        '#330b5c'
    ];


    let range = maxCases - minCases; 
	let casesAdj = cases - minCases; 
	var percentageOfRange = casesAdj/range;
	let colorNum = Math.floor(percentageOfRange * 10);
	if (colorNum >= 10) {
		colorNum = 9;
	}
	return gradient[colorNum];
}



function update(data){

    
    geo.eachLayer(function(layer){

        geo.removeLayer(layer);
    });
    geo.removeFrom(map);
    countyData
    for(let i = 0; i < markers.length; i++){

        map.removeLayer(markers[i]);
        markers.pop();
    }
    for(let k = 0; k < countyData.length; k++){
        countyData.pop();
    }
    markers.length = 0;
    countyData.length = 0;

    
    

    let caseRange = getPrisonRange(data);
    let countyRange = getCountyRange(data);


    for(let e = 0; e < data.length; e++){

        var obj = data[e];
        if(obj.Address == null && obj.Jurisdiction == null){

            countyData.push(obj);

        }else{

            let name = obj.Name;
            let lat = obj.Latitude;
            let long = obj.Longitude;
            let cases = obj['Residents.Confirmed'] + obj['Staff.Confirmed'];


            var circle = new L.circle([lat,long], {
                color: 'grey',
                fillColor: getColor(caseRange[0],caseRange[1],cases),
                fillOpacity: 0.7,
                radius: 8000
            }).bindTooltip(name + "  |  Cases: " + cases);
            
            markers.push(circle);
        }
    }


    geo = L.geoJSON(ca, {

        onEachFeature: function(feature, layer){


            for(let c = 0; c < countyData.length; c++){
                console.log("c = ",c);
                if(feature.properties.name == countyData[c].County){

                    console.log("changing color");

                    layer.setStyle({
                        fillColor: getColor(countyRange[0],countyRange[1],countyData[c].Cases),
                        fillOpacity: 0.55,
                        stroke: true,
                        color: 'grey'
                    });

                    let date = countyData[c].Date
                    let name = feature.properties.name;
                    let cases = countyData[c].Cases;
                    layer.bindPopup(name + " County | Cases: " + cases + " (" + date.substring(0,10) + ")");

                    break;
                }

                layer.setStyle({
                    stroke: false,
                    fillOpacity: 0.2,
                    fillColor: '#D3D3D3'
                });

            }                      
        }
        
    });

    let prisons = L.layerGroup(markers);

    geo.addTo(map);
    prisons.addTo(map);


}







$(document).ready(function() {

    $('#user_in').submit((e) => {
    
        e.preventDefault();
        
        var fdata = $('#userdate').val();
        if(fdata){
        
            $.ajax({
                type: "POST",
                url: "/get-data",
                async: false,
                data: {udate: fdata},
                dataType: "json",
                success: function(data){

                    update(data);
                    map.invalidateSize(true);
                },
                error: function(jqXHR, textStatus, err){

                    alert("Status: " + textStatus + ", Error: " + err);
                }
           

            });
        }else{
            alert("Please enter a date!")
        }
    });

});