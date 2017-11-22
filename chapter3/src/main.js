var mapModules = (function () {

    function renderOpenLayers() {
        var apiKey = 'sYiygsgnpE4nkvWftR1h';

        var tilegrid = ol.tilegrid.createXYZ({
            tileSize: 512,
            maxZoom: 12
        });
        var layer = new ol.layer.VectorTile({
            source: new ol.source.VectorTile({
                attributions: '© <a href="https://openmaptiles.org/">OpenMapTiles</a> ' +
                '© <a href="http://www.openstreetmap.org/copyright">' +
                'OpenStreetMap contributors</a>',
                format: new ol.format.MVT(),
                tileGrid: tilegrid,
                tilePixelRatio: 8,
                url: 'https://free-0.tilehosting.com/data/v3/{z}/{x}/{y}.pbf?key=' + apiKey
            })
        });

        var view = new ol.View({
            center: [0, 0],
            zoom: 2
        })

        var map = new ol.Map({
            target: 'map',
            view: view
        });

        fetch('https://openmaptiles.github.io/klokantech-basic-gl-style/style-cdn-undecorated.json').then(function (response) {
            response.json().then(function (glStyle) {
                olms.applyStyle(layer, glStyle, 'openmaptiles').then(function () {
                    map.addLayer(layer);
                });
            });
        });

    }

    function renderMapboxGlJS() {
        mapboxgl.accessToken = 'pk.eyJ1Ijoid2l0eXZpcyIsImEiOiJjajl4MGo0OWowczk4MnFtZHVob3I0MTdnIn0.KHhjbfQIuxBcoOsukPTldQ';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v10',
            center: [0, 0],
            zoom: 1
        });

        map.on('load', function () {
            map.addLayer({
                id: 'terrain-data',
                type: 'line',
                source: {
                    type: 'vector',
                    url: 'mapbox://mapbox.mapbox-terrain-v2'
                },
                'source-layer': 'contour'
            });
        });
    }

    return {
        renderOpenLayers: renderOpenLayers,
        renderMapboxGlJS: renderMapboxGlJS
    };

})();