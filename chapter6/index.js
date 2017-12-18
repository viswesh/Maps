/**
 * Express Application to convert
 * Creator - James Seppi
 * https://github.com/jseppi/issgeojson
 */

var geojson = require('geojson');
var request = require('request');
var express = require('express');
var cors = require('cors');

var ISS_API_URL = "https://api.wheretheiss.at/v1/satellites/25544";

var app = express();
app.use(cors());

app.set('port', (process.env.PORT || 5000));

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

app.get('/', function (req, res) {
    request(ISS_API_URL, function (err, resp, body) {
        if (err) {
            console.log(err);
            res.status(400).json({error: 'Unable to contact ISS API'});
            return;
        }

        var issStatus = JSON.parse(body);
        var issGj = geojson.parse([issStatus], {Point: ['latitude', 'longitude']});

        res.json(issGj);

    });
});

app.listen(app.get('port'), function () {
    console.log("App listening on port " + app.get('port'));
});