const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('../lib/passport');
const User = require('../models/User');

// get all users
router.get('/', (req, res) => {
  // empty object allows us to fill with users
  User.find({})
    .then(users => {
      return res.status(200).json({ message: 'Success', users });
    })
    .catch(err => res.status(500).json({ message: 'Server error', err }));
});

router.get('/success', (req, res) => {
  return res.render('success');
});

router.get('/fail', (req, res) => {
  return res.render('fail');
});

// login with passport
router.post(
  '/login',
  // authenticate using local login from passport file
  passport.authenticate('local-login', {
    successRedirect: '/users/success',
    failureRedirect: '/users/fail',
    failureFlash: true
  })
);

router.get('/register', (req, res) => {
  res.render('register');
});

// register with passport
router.post('/register', (req, res) => {
  // validate input
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(403).json({
      message: 'All inputs must be filled'
    });
  }
  // check if user exists
  User.findOne({ email: req.body.email })
    .then(user => {
      // check to see if there is a user value
      if (user) {
        return res.status(400).json({
          message: 'User already exists'
        });
      }
      // create a new user from the User model
      const newUser = new User();
      // salt password...place extra characters in password to make it harder to guess
      const salt = bcrypt.genSaltSync(10);
      // hash password
      const hash = bcrypt.hashSync(req.body.password, salt);
      // set values for the user to the model keys
      newUser.name = req.body.name;
      newUser.email = req.body.email;
      newUser.password = hash;
      // save user
      newUser
        .save()
        .then(user => {
          return req.login(user, err => {
            if (err) {
              return res.status(500).json({
                message: 'Server error',
                err
              });
            } else {
              console.log('register...', req.session);
              return res.redirect('/users/success');
            }
          });
        })
        .catch(err =>
          res.status(400).json({
            message: 'User not saved',
            err
          })
        );
    })
    .catch(err =>
      res.status(418).json({
        message: 'We messed up',
        err
      })
    );
});

router.put('/update/:id', (req, res) => {
  // search for user in database based on parameters
  User.findById(req.params.id)
    .then(user => {
      if (user) {
        // fill in values for inputs or leave value if no input
        user.name = req.body.name ? req.body.name : user.name;
        user.email = req.body.email ? req.body.email : user.email;
        // save user
        user
          .save()
          .then(user => {
            res.status(200).json({ message: 'User updated', user });
          })
          .catch(err =>
            res.status(400).json({ message: 'Cannot reuse credentials', err })
          );
      }
    })
    .catch(err => res.status(400).json({ message: 'User not found', err }));
});

// logout user
router.get('/logout', (req, res) => {
  req.session.destroy();
  console.log(`logout...`, req.session);
  req.logOut();
  return res.redirect('/');
});

module.exports = router;
