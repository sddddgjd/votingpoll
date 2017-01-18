var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// connect to database in config
mongoose.connect(configDB.url);

require('./config/passport')(passport); // pass passport for configuration

//set up views
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// set up our express application
app.use(morgan('dev')); // log requests
app.use(cookieParser()); // read cookies
app.use(bodyParser()); // get html forms


// passport setup
app.use(session({ secret: 'notsosecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // save loggin sessions
app.use(flash()); //use connect flash

//set up routes
require('./app/routes.js')(app, passport);

app.listen(port);
console.log('App listening on port: ' + port);