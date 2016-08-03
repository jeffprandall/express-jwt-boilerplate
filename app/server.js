const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
const config = require('./config') // get our config file
const User = require('./components/user') // get our Usermongoose model

const app = express();

const port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database

app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// Basic Routes ==========
// =======================

// setup new user
app.post('/setup', (req, res) => User.create(req, res))

// basic route
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// get an instance of the router for api routes
var apiRoutes = express.Router();

// ============================
// Unauthenticated api routes =
// ============================

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', User.authenticate)

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  let token = req.body.token || req.param('token') || req.headers['x-access-token']

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' })
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded
        next()
      }
    })

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

// ==========================
// Authenticated API Routes =
// ==========================

apiRoutes.get('/', (req, res) => {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', User.findAll)

apiRoutes.get('/check', (req, res) => {
  res.json(req.decoded);
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);