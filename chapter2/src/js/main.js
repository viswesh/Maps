var map = L.map('map', {
    minZoom: 2,
    maxZoom: 10,
    zoomControl: false
}).setView([0, 0], 3);

var populationById = {};

/**
 * Returns color based on population.
 * @param d
 * @returns {string}
 */
function getColor(d) {
    return d > 10000000 ? '#4d004b' :
        d > 5000000 ? '#8c6bb1' :
            d > 5000000 ? '#8c96c6' :
                d > 400000 ? '#9ebcda' :
                    d > 200000 ? '#bfd3e6' :
                        d > 100 ? '#e0ecf4' :
                            d > 10 ? '#F7FCFD' :
                                'grey';
}

// var tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
var tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    noWrap: true,
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);

var xhr = new XMLHttpRequest();
xhr.open('GET', "src/data/population.json");
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onload = function () {
    if (xhr.status === 200) {
        var population = JSON.parse(xhr.responseText);
        population.forEach(function (d) {
            populationById[d.country] = {
                total: +d.total,
                females: +d.females,
                males: +d.males
            }
        });

    }
};
xhr.send();


var xhr1 = new XMLHttpRequest();
//xhr1.open('GET', "src/data/50m.json");
xhr1.open('GET', "src/data/world.geo.json");
xhr1.setRequestHeader('Content-Type', 'application/json');
xhr1.onload = function () {
    if (xhr1.status === 200) {
        var world = JSON.parse(xhr1.responseText);
        //var worldGeoJSON = topojson.feature(world, world.objects.countries).features;
        var geoJsonLayer = L.geoJson(world, {
            style: function (feature) {
                var country = feature.properties.name;
                total = populationById[country] && populationById[country]["total"];

                return {
                    fillColor: (total ? getColor(total) : getColor(0)),
                    fillOpacity: 0.8,
                    weight: 1,
                    color: 'grey'
                };
            },
            onEachFeature: function (feature, layer) {
                layer.on({
                    'mousemove': function (e) {
                        //Handle mousemove event
                        e.target.setStyle({
                            weight: 2
                        });

                        details = feature.properties;
                        country = details.name;
                        document.getElementsByClassName("country")[0].innerHTML = country;
                        document.getElementsByClassName("females")[0].innerHTML = "Female " + (populationById[country] ? populationById[country].females : "¯\\_(ツ)_/¯");
                        document.getElementsByClassName("males")[0].innerHTML = "Male " + (populationById[country] ? populationById[country].males : "¯\\_(ツ)_/¯");
                        document.getElementsByClassName("details")[0].style.visibility = 'visible';
                    },
                    'mouseout': function (e) {
                        //Handle mouseout event
                        e.target.setStyle({
                            weight: 1
                        });
                    },
                    'click': function (e) {
                        //Handle click event
                    }
                });
            }
        }).addTo(map);

    }
};
xhr1.send();
