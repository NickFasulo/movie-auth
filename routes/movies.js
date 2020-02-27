const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// get all movies
router.get('/', (req, res) => {
  Movie.find({})
    .then(movies => {
      return res.status(200).json(movies);
    })
    .catch(err => res.status(500).json({ message: 'Server Error', err }));
});

// find movie by title
router.get('/findmovie', (req, res) => {
  Movie.findOne({ title: req.query.title })
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

module.exports = router;
