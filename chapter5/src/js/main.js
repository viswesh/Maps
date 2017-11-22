mapboxgl.accessToken = 'pk.eyJ1Ijoid2l0eXZpcyIsImEiOiJjajl4MGo0OWowczk4MnFtZHVob3I0MTdnIn0.KHhjbfQIuxBcoOsukPTldQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-97.38, 42.87774],
    // maxBounds: [ [-180, -85], [180, 85] ],
    zoom: 3
});

map.on('load', function () {

    map.addControl(new mapboxgl.FullscreenControl());

    var xhr = new XMLHttpRequest();
    xhr.open('GET', "src/data/us_prisons.geojson");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            map.addLayer({
                "id": "prisons",
                "type": "symbol",
                "source": {
                    "type": "geojson",
                    "data": data
                },
                "layout": {
                    "icon-image": "prison-15",
                    "text-field": "{name}",
                    "text-size": 8,
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0, 0.6],
                    "text-anchor": "top"
                }
            });

        }
    };
    xhr.send();

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'prisons', function (e) {
        var prison = e.features[0].properties,
            popOverContet;

        for (prop in prison) {
            popOverContet += prison[prop] + '</br>';
        }

        new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML(popOverContet)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'prisons', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'prisons', function () {
        map.getCanvas().style.cursor = '';
    });

});