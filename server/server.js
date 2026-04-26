const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/

app.get('/genres', function (req, res) {
    const genres = new Set();
    Object.values(movieModel).forEach(movie => {
        movie.Genres.forEach(genre => genres.add(genre));
    });
    res.json(Array.from(genres).sort());
})  

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given,
   return only movies that have the given genre
 */
app.get('/movies', function (req, res) {
    const genre = req.query.genre;
    if (genre) {
        const filtered = Object.values(movieModel).filter(movie =>
            movie.Genres && movie.Genres.includes(genre)
        );
        res.json(filtered);
    } else {
        res.json(Object.values(movieModel));
    }
})

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
    const movie = movieModel[req.params.imdbID];
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).send("Movie not found");
    }
})

app.put('/movies/:imdbID', function (req, res) {
  const imdbID = req.params.imdbID;
  const movie = req.body;
  if (movieModel[imdbID]) {
    movieModel[imdbID] = movie;
    res.sendStatus(200);
  } else {
    movieModel[imdbID] = movie;
    res.status(201).send(movie);
  }
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
