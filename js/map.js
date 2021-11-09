
var mapboxAccessToken = "pk.eyJ1IjoiYnNjaGVyeiIsImEiOiJja3ZvNzQ3MG5lNHN3MnFtYW1keWYyMnAwIn0.hN-2JumWaHsnPsBqyz9etQ";
var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
            id: 'mapbox/light-v9',
            tileSize: 512,
            zoomOffset: -1
}).addTo(map);