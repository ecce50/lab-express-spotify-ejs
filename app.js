require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const SpotifyWebApi = require("spotify-web-api-node");
// require spotify-web-api-node package here:

const app = express();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (request, response) => {
  console.log(request);
  response.render("index");
});

app.get("artist-search", (request, response) => {
  const searchedArtist = request.query.artist_name;

  spotifyApi
    .searchArtists(searchedArtist)
    .then((data) => {
      console.log("Data from API", data.body);
      response.render("arist-search-results", {
        artists: data.body.artists.items,
      });
    })
    .catch((err) => console.log("An error occurred: ", err));
});



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
