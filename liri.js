require("dotenv").config();
var keys = require("./keys.js");
var fs = require('fs');

var axios = require('axios');

var moment = require('moment');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var searchquery = process.argv.splice(3).join(' ');

switch (command) {
    case 'concert-this':
    searchBand(searchquery);
    break

    case 'spotify-this-song':
    searchSpotify(searchquery);
    break

    case 'movie-this':
    searchMovie(searchquery);
    break

    case 'do-what-it-says':
        dowhatitsays();
    break
};

function searchBand () {
    axios.get("https://rest.bandsintown.com/artists/" + searchquery + "/events?app_id=codingbootcamp")
    .then(function (response) {
        // handle success
        // console.log(response);
        var response = response.data[0];

        var venue = response.venue.name;
        var location = `${response.venue.city}, ${response.venue.region}, ${response.venue.country}`;
        var date = moment(response.datetime).format("MM/DD/YYYY");

        var responseobj = `\nYou searched: "${searchquery}"\nResults:\n\nVenue: ${venue}\n\nLocation: ${location}\n\nEvent date: ${date}\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;

        console.log(responseobj);

    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
};

function searchSpotify (searchquery) {
    if (!searchquery) {
        searchquery = "The Sign by Ace of Base";
    }
    spotify
    .search({ type: 'track', query: searchquery })
    .then(function(response) {
     response = response.tracks.items[0];
//      Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from
     var artists = response.artists[0].name; //+ response.artists[1].name;
     var song = response.name;
     var url = response.external_urls.spotify;
     var album = response.album.name;

     var responseobj = `\nYou searched: "${searchquery}"\nResults:\n\nArtists: ${artists}\n\nSong name: ${song}\n\nAlbum: ${album}\n\nSpotify url: ${url}\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;

     console.log(responseobj);
    })
    .catch(function(err) {
      console.log(err);
    });
};

function searchMovie() {
    if (!searchquery) {
        searchquery = 'Mr. Nobody';
    }
    axios.get("https://www.omdbapi.com/?t=" + searchquery + "&apikey=trilogy")
    .then(function (response) {
        var response = response.data;

        var title = response.Title;
        var releaseyear = response.Year;
        var imbdrating = response.imdbRating;
        var rottonrating = response.Ratings[1].Value;
        var country = response.Country;
        var avaliablelanguage = response.Language;
        var actors = response.Actors;
        var plot = response.Plot;

        // console.log(response);

        var responseobj = `\nYou searched: "${searchquery}"\nResults:\n\nTitle: ${title}\n\nRelease Year: ${releaseyear}\n\nIMBD Rating: ${imbdrating}\n\nRotton Tomatoes Rating: ${rottonrating}\n\nCountry of Origin: ${country}\n\nLanguage: ${avaliablelanguage}\n\nActors: ${actors}\n\nMovie plot: ${plot}\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;

        console.log(responseobj);

    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
};

function dowhatitsays () {
    fs.readFile('random.txt','utf8', (err, data) => {
        if (err) throw err;
        var data = data.split(',');
        var searchquery = data[1];
        searchSpotify(searchquery);
      });
}
