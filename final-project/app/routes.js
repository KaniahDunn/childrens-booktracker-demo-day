module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('landing.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/userlogin', isLoggedIn, function(req, res) {
      const currentUser = req.user._id
        db.collection('userbooks').find({user: req.user.local.email}).toArray((err, result) => {
          console.log(result);
          if (err) return console.log(err)

          res.render('userlogin.ejs', {
            user : req.user,
            userbooks : result
          })
        })
    });
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('userbooks').find({user: req.user.local.email}).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            userbooks : result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// user book list routes =========================================
    app.get('/updatelibrary', isLoggedIn, function(req, res) {
      db.collection('userbooks').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('updatelibrary', {
          user : req.user,
          userbooks: result
        })
      })
    });

    app.post('/books', (req, res) => {
      db.collection('userbooks').save({bookTitle: req.body.bookTitle, bookAuthor: req.body.bookAuthor, level: req.body.level, description: req.body.description, user: req.body.userName}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect(req.get('referer'));
      })
    })

    app.put('/changedescription', (req, res) => {
      db.collection('userbooks').findOneAndUpdate({bookTitle: req.body.bookTitle, bookAuthor: req.body.bookAuthor, level: req.body.level}, {
        $set: {
          description: req.body.description
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })
    app.delete('/deletebook', (req, res) => {
      db.collection('userbooks').findOneAndDelete({bookTitle: req.body.bookTitle, bookAuthor: req.body.bookAuthor, level: req.body.level, description: req.body.description, createdBy: req.user._id}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })
// User incentive choices =======================================
app.get('/incentives', isLoggedIn, function(req, res) {
  db.collection('incentives').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('incentives', {
      user : req.user,
      incentives: result
    })
  })
});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/userlogin', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/userlogin', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/userlogin');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
