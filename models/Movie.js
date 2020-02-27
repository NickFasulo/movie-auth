const mongoose = require('mongoose');

// how movies will be stored in database
const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    default: '',
    lowercase: true,
    trim: true
  },
  rating: { type: String, default: '', trim: true },
  synopsis: { type: String, default: '', trim: true },
  releaseYear: { type: String, default: '', trim: true },
  genre: { type: String, default: '', trim: true },
  director: { type: String, default: '', trim: true },
  boxOffice: { type: String, default: '', trim: true }
});

module.exports = mongoose.model('movies', MovieSchema);
