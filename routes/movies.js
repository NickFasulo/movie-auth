const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// get all movies
router.get('/', (req, res) => {
  Movie.find({})
    .then(movies => {
      return res.render('viewMovies', { movies });
    })
    .catch(err => res.status(500).json({ message: 'Server Error', err }));
});

// find movie by title
router.get('/findmovie', (req, res) => {
  Movie.findOne({ title: req.body.title }) // change to req.query.title once view is up
    .then(title => {
      if (title) {
        // render find word page with word
        // return res.render('findWord', { word });
        return res.status(200).json({ title });
      } else {
        return res.status(400).json({ message: 'Movie not found' });
      }
    })
    .catch(err => res.status(500).json({ message: 'Server Error', err }));
});

router.get('/addmovie', (req, res) => {
  res.render('addMovie');
});

// add movie to database
router.post('/addmovie', (req, res) => {
  // check to see if movie is unique
  // Use the Movie model and the .findOne mongoose method to compare the movie in the database to input movie
  Movie.findOne({ title: req.body.title })
    .then(title => {
      if (title) {
        return res.status(500).json({
          message: 'Movie is already in the database'
        });
      }
      // add movie to database
      // this creates newMovie object:
      const newMovie = new Movie();
      //these place items in newMovie:
      newMovie.title = req.body.title;
      newMovie.rating = req.body.rating;
      newMovie.synopsis = req.body.synopsis;
      newMovie.releaseYear = req.body.releaseYear;
      newMovie.genre = req.body.genre;
      newMovie.director = req.body.director;
      newMovie.boxOffice = req.body.boxOffice;

      newMovie
        .save()
        .then(movie => {
          return res.status(200).json({
            message: 'Movie added',
            movie
          });
        })
        .catch(err => {
          return res.status(500).json({
            message: 'Movie was not added',
            err
          });
        });
    })
    .catch(err => {
      return res.status(500).json({
        message: 'Server Error',
        err
      });
    });
});

// update movie
router.put('/update/:title', (req, res) => {
  // search for movie in database based on title parameter
  Movie.findOne({ title: req.params.title })
    .then(movie => {
      if (movie) {
        // fill in values for inputs or leave value if no input
        movie.rating = req.body.rating ? req.body.rating : movie.rating;
        movie.synopsis = req.body.synopsis ? req.body.synopsis : movie.synopsis;
        movie.releaseYear = req.body.releaseYear
          ? req.body.releaseYear
          : movie.releaseYear;
        movie.genre = req.body.genre ? req.body.genre : movie.genre;
        movie.director = req.body.director ? req.body.director : movie.director;
        movie.boxOffice = req.body.boxOffice
          ? req.body.boxOffice
          : movie.boxOffice;
        // save movie
        movie
          .save()
          .then(movie => {
            res.status(200).json({
              message: 'Movie updated',
              movie
            });
          })
          .catch(err =>
            res.status(400).json({
              message: 'Cannot reuse info',
              err
            })
          );
      }
    })
    .catch(err =>
      res.status(400).json({
        message: 'Movie not found',
        err
      })
    );
});

// delete movie
router.delete('/delete', (req, res) => {
  Movie.findOneAndDelete({ title: req.body.title })
    .then(movie => {
      if (movie) {
        return res.status(200).json({ message: 'movie deleted', movie });
      } else {
        return res.status(400).json({ message: 'No movie to delete' });
      }
    })
    .catch(err => res.status(400).json({ message: 'Movie not deleted', err }));
});

module.exports = router;
