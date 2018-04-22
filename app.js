// Modules needed to run the app
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bb = require('express-busboy');
var passport = require('passport');

// Create the schemas needed
require('./models/user.model');
require('./models/shop.model');

// Configuring the middleware for authentication
require('./config/passport.config');

// Routes API
const routesApi = require('./routes/auth.route');
const routesShop = require('./routes/shop.route');

// Define our app using express
const app = express();

// Encode the App
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// To allow restricted resources on a web page
app.all("/*", function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});
// express-busboy to parse multipart/form-data
bb.extend(app);

// configure app
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
// set the port
const port = process.env.PORT || 3000;
// connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/shops');

app.use(passport.initialize());
// Defining the routes
app.use('/api', routesApi);
app.use('/api', routesShop);
app.get('/', (req, res) => {
    return res.end('');
});
// Catch unauthorised errors
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({ "message": err.name + ": " + err.message });
    }
});
// catch 404
app.use((req, res, next) => {
    res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});
// start the server
app.listen(port, () => {
    console.log(`App Server Listening at ${port}`);
});