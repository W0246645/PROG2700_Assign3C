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
                "name": flight[1]
            }
        }))}
        geoJsonLayer.clearLayers()
        geoJsonLayer.addData(geoJson)
        console.log("refresh")
    })
}

(function(){
    //create map in leaflet and tie it to the div called 'theMap'
    const map = L.map('theMap').setView([42, -60], 4);
    const geoJsonLayer = L.geoJSON().addTo(map)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    L.marker([42, -60]).addTo(map)
        .bindPopup('This is a sample popup. You can put any html structure in this including extra flight data. You can also swap this icon out for a custom icon. Some png files have been provided for you to use if you wish.')
        .openPopup();
    getPlanes(geoJsonLayer)
    setInterval(function() {getPlanes(geoJsonLayer)}, 15000)
    

    
})()