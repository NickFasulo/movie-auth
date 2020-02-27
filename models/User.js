const mongoose = require('mongoose');

// how user will be stored in the database
const UserSchema = new mongoose.Schema({
  name: { type: String, default: '', trim: true, lowercase: true },
  email: {
    type: String,
    unique: true,
    default: '',
    trim: true,
    lowercase: true
  },
  password: { type: String, default: '', trim: true }
});

// we name the UserSchema users and export the model
module.exports = mongoose.model('users', UserSchema);
