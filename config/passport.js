// config/passport.js

// load strategy and user model
var LocalStrategy   = require('passport-local').Strategy, User = require('../app/models/user');

// export
module.exports = function(passport) {

    // serialize user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

  passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {


        process.nextTick(function() {

        // check if there is a user with this username
        User.findOne({ 'local.username' :  username }, function(err, user) {
            
            // error handling
            if (err)
                return done(err);

            // if username is taken
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {

                // create new user
                var newUser = new User();

                // set up credentials
                newUser.local.username = username;
                newUser.local.password = newUser.generateHash(password);

                // save user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

};