//app routes
var Poll = require('../app/models/poll');
module.exports = function(app, passport) {
    
    //home page
    app.get('/', function(req, res){
        Poll.find({}, function(err, polls) {
            if(err)
                throw err;
            res.render('index.ejs', { user: req.user,polls: polls}); 
        });
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
        //redirect if there is no logged in user
       if(!req.user){
            req.flash('loginMessage', 'Log in to create a new poll!');
            res.redirect('/login');
        }
       res.render('new.ejs', {user:req.user}); 
    });
    
    //process poll form
    app.post('/new', function(req,res){
        
        //get poll name and options
        var name = req.body.name, options = req.body.options;
        options = options.replace(/\r/g,'');
        var allOptions = options.split('\n');
        
        //create a new poll with this data
        var newPoll = new Poll();
        newPoll.name = name;
        newPoll.creator = req.user.local.username;
        allOptions.forEach(function(option){
           newPoll.options.push({option: option, votes: 0, perc: 0}); 
        });
        //save poll
        newPoll.save(function(err) {
            if (err)
                throw err;
            return;
        });
        res.redirect('/poll/' + newPoll._id);
    });
    //poll page
    app.get('/poll/:id', function(req,res){
       Poll.findById(req.params.id, function(err, poll){
           if(err)
             throw err;
            var colors = ['progress-bar-success','progress-bar-info','progress-bar-warning','progress-bar-danger'];
            res.render('poll.ejs', {poll: poll, user: req.user, message: req.flash('pollMessage'), colors:colors});
       });
    });
    //get post votes
    app.post('/poll/:id', function(req, res){
        var user = req.user;
        //get the poll
       Poll.findById(req.params.id, function(err, poll){
           if(err)
             throw err;
             //if there is no user logged in, or if the user already voted redirect
            if( !user || poll.voters.indexOf(user.local.username) != -1){
                var message = 'You need to be logged in!';
                if (user)
                    message = 'You already voted on this poll!';
                req.flash('pollMessage', message);
                res.redirect('/poll/' + req.params.id); 
            }
            else{
                //check if custom option already exists
                var found = false;
                poll.options.forEach(function(option){
                    if(option.option == req.body.custom)
                        found = true;
                });
                if (found)
                    req.body.sel = req.body.custom;
                //if we have a custom option and it doesn't exists
                if ( !found && req.body.custom){
                    //push the new option & mark voter
                    poll.options.push({option : req.body.custom, votes:1, perc: 0});
                    poll.voters.push(user.local.username);
                    poll.markModified('options');
                    poll.markModified('voters');
                    //save poll, update and redirect
                    poll.save(function(err){
                            if (err)
                                throw err;
                            //update poll percentages
                            poll.update();
                            res.redirect('/poll/'+req.params.id);
                        });
                } else{
                //search for the option the user voted for
                poll.options.forEach(function(option){
                     if(option.option == req.body.sel){
                         //add user vote and push user to list of users who voted
                        option.votes ++;
                        poll.voters.push(user.local.username);
                        //mark changes
                        poll.markModified('options');
                        poll.markModified('voters');
                        //save poll
                        poll.save(function(err){
                            if (err)
                                throw err;
                            //update poll percentages
                            poll.update();
                            res.redirect('/poll/'+req.params.id);
                        });
                    }
                });
            }
            }
       });
    });
    //mypolls
    app.get('/myPolls',function(req, res){
       if (!req.user){
            req.flash('loginMessage', 'Login to see your polls.');
            res.redirect('/login');
       } else{
        Poll.find({creator: req.user.local.username}, function(err,polls){
           if(err)
                throw err;
            res.render('myPolls.ejs', {polls: polls});
       })
       }
    });
    app.get('/delete/:id', function(req, res){
       var user = req.user, id = req.params.id;
       Poll.findById(req.params.id, function(err, poll){
           if(err)
              throw err;
            if(!user || poll.creator != user.local.username){
                res.redirect('/');
            }
            else{
                poll.remove(function(err){
                    if(err)
                    throw err;
                    res.redirect('/myPolls');
                });
            }
       })
    });
    //logout
    app.get('/logout', function(req, res){
       req.logout();
       res.redirect('/');
    });
}