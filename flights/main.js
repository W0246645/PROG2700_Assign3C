function getPlanes(geoJsonLayer) {
    fetch('https://prog2700.onrender.com/opensky')
    .then((response) => response.json())
    .then((json) => {
        var geoJson = {
            "type": "FeatureCollection",
            "features": json.states.filter(flight => flight[2] == "Canada").map(flight => ({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [flight[5], flight[6]]
            },
            "properties": {
                "icao24": flight[0],
                "callsign": flight[1],
                "country": flight[2],
                "speed": flight[9],
                "altitude": flight[13],
                "inflight": !flight[8],
                "true_track": flight[10]
            }
        }))}
        geoJsonLayer.clearLayers()
        geoJsonLayer.addData(geoJson)
        
        console.log("tick")
    })
}

(function(){
    let plane = L.icon({
        iconUrl: 'plane2.png',
    
        iconSize:     [50, 50], // size of the icon
        iconAnchor:   [25, 25], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -15] // point from which the popup should open relative to the iconAnchor
    });
    //create map in leaflet and tie it to the div called 'theMap'
    const map = L.map('theMap').setView([42, -60], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    const geoJsonLayer = L.geoJSON(null, {
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng, {
                icon: plane,
                rotationAngle: feature.properties.true_track
            }).bindPopup(`
            <h3>${feature.properties.icao24}</h3>
            <ul>
                <li><b>Callsign</b>: ${feature.properties.callsign}</li>
                <li><b>Country</b>: ${feature.properties.country}</li>
                <li><b>In flight?</b>: ${feature.properties.inflight}</li>
                <li><b>Speed</b>: ${feature.properties.speed}m/s</li>
                <li><b>Altitude?</b>: ${feature.properties.altitude}m</li>
            </ul>
            `);
        }
    }).addTo(map);
    

    

    // L.marker([42, -60]).addTo(map)
    //     .bindPopup('This is a sample popup. You can put any html structure in this including extra flight data. You can also swap this icon out for a custom icon. Some png files have been provided for you to use if you wish.')
    //     .openPopup();

    getPlanes(geoJsonLayer)
    setInterval(function() {getPlanes(geoJsonLayer)}, 15000)
    

    
})()