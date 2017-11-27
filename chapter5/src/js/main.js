/**
 * mapModule renders data sets with different visual representation.
 * @type {{renderPrisons, renderPrisonHeatMap}}
 */
var mapModules = (function () {
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2l0eXZpcyIsImEiOiJjajl4MGo0OWowczk4MnFtZHVob3I0MTdnIn0.KHhjbfQIuxBcoOsukPTldQ';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [-97.38, 42.87774],
        zoom: 3
    });

    /**
     * Renders prisons in USA
     */
    function renderPrisons() {
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

    }

    /**
     * Renders prisons in USA with heatmap
     */
    function renderPrisonHeatMap() {
        map.on('load', function () {

            var xhr = new XMLHttpRequest();
            xhr.open('GET', "src/data/us_prisons.geojson");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);

                    renderCluster(data);

                }
            };
            xhr.send();

            function renderCluster(dataSource) {
                //Add a geojson point source.
                //Heatmap layers also work with a vector tile source.
                map.addSource('prisons', {
                    "type": "geojson",
                    "data": dataSource
                });

                map.addLayer({
                    "id": "prisons-heat",
                    "type": "heatmap",
                    "source": "prisons",
                    "maxzoom": 9,
                    "paint": {
                        //Increase the heatmap weight based on frequency and property magnitude
                        "heatmap-weight": {
                            "property": "mag",
                            "type": "exponential",
                            "stops": [
                                [0, 0],
                                [6, 1]
                            ]
                        },
                        //Increase the heatmap color weight weight by zoom level
                        //heatmap-ntensity is a multiplier on top of heatmap-weight
                        "heatmap-intensity": {
                            "stops": [
                                [0, 1],
                                [9, 3]
                            ]
                        },
                        //Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                        //Begin color ramp at 0-stop with a 0-transparancy color
                        //to create a blur-like effect.
                        "heatmap-color": [
                            "interpolate",
                            ["linear"],
                            ["heatmap-density"],
                            0, "#f7f7f7",
                            0.2, "#d9d9d9",
                            0.4, "#bdbdbd",
                            0.6, "#969696",
                            0.8, "#636363",
                            1, "#252525"
                        ],
                        //Adjust the heatmap radius by zoom level
                        "heatmap-radius": {
                            "stops": [
                                [0, 2],
                                [9, 20]
                            ]
                        },
                        //Transition from heatmap to circle layer by zoom level
                        "heatmap-opacity": {
                            "default": 1,
                            "stops": [
                                [7, 1],
                                [9, 0]
                            ]
                        }
                    }
                });
            }

        });
    }

    return {
        renderPrisons: renderPrisons,
        renderPrisonHeatMap: renderPrisonHeatMap
    };

})();