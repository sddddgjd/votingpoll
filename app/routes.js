//app routes
module.exports = function(app, passport) {
    
    //home page
    app.get('/', function(req, res){
       res.render('index.ejs', { user: req.user}); 
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
    //new poll
    app.get('/new', function(req, res){
       /* if(!req.user){
            res.redirect('/');
        }*/
       res.render('new.ejs', {user:req.user}); 
    });
    
    //process poll form
    app.post('/new', function(req,res){
        
        //get poll schema
        var Poll = require('../app/models/poll');
        
        //get poll name and options
        var name = req.body.name, options = req.body.options;
        options = options.replace(/\r/g,'');
        var allOptions = options.split('\n');
        
        //create a new poll with this data
        var newPoll = new Poll();
        newPoll.name = name;
        newPoll.options = allOptions;
        
        //save poll
        newPoll.save(function(err) {
            console.log("la");
            if (err)
                throw err;
            return;
        });
        res.send('Saved poll!');
    });
    //logout
    app.get('/logout', function(req, res){
       req.logout();
       res.redirect('/');
    });
}