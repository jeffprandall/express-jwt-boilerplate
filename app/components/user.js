const User = require('../models/user')
const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
const config = require('../config') // get our config file

// Create a new User
exports.create = function(req, res) {
  // create a user
  let user = new User({
    name: req.body.name || 'Jeff Randall',
    password: req.body.password || 'password',
    admin: true
  });

  // save the sample user
  user.save(function(err) {
    if (err) throw err;

    res.json({ success: `Successfully created user ${user.name}` });
  });
}

// Find all the Users
exports.findAll = function(req, res) {
  // User.find({}, function(err, users) {
  //   res.json(users);
  // });

  User.find({}, (err, users) => {
    res.json(users);
  });
}

// Authenticate a User
exports.authenticate = function(req, res) {
  
  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        let token = jwt.sign(user, config.secret, {
          expiresIn: '1 hour' // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  })
}