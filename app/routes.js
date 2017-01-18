//app routes
module.exports = function(app, passport) {
    
    //home page
    app.get('/', function(req, res){
       res.render('index.ejs'); 
    });
    
    //login page
    app.get('/login', function(req, res){
        res.render('login.ejs', { message: req.flash('loginMessage') });  
    });
    
    //process login form
    app.post('/login', passport.authenticate('local-login', { successRedirect: '/',
                                                            failureRedirect: '/login',
                                                            failureFlash: true}));

    //signup
    app.get('/signup', function(req, res){
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });
    
    //process signup form
    app.post('/signup', passport.authenticate('local-signup', { successRedirect: '/',
                                                            failureRedirect: '/signup',
                                                               failureFlash: true}));
    
    //logout
    app.get('/logout', function(req, res){
       req.logout();
       res.redirect('/');
    });
}