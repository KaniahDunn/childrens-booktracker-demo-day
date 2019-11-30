module.exports = function(app, passport, db, multer, ObjectId) {
var ObjectId = require('mongodb').ObjectID

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('landing.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      const currentUser = req.user._id
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

// profile routes =========================================
    app.get('/updatelibrary', isLoggedIn, function(req, res) {
      db.collection('userbooks').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('updatelibrary', {
          user : req.user,
          userbooks: result
        })
      })
    });

    // localhost:2000/book?userbooks_id=book
    app.get('/book/:id', isLoggedIn, function(req, res) {
    // console.log('the query request is ' + req.query);
     let queryParam = req.params.id
     db.collection('userbooks').findOne({ _id : ObjectId(queryParam)}, (err, result) => {
       if (err) return console.log(err)
       res.render('book.ejs', {
         user : req.user,
         userbooks: result
       })
     });
 });

    app.post('/books', (req, res) => {
      let date = new Date();
      db.collection('userbooks').save({bookTitle: req.body.bookTitle, bookAuthor: req.body.bookAuthor, level: req.body.level, description: req.body.description, user: req.body.userName, dateAdded: date.toDateString()}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect(req.get('referer'));
      })
    })

    app.put('/updatebook', (req, res) => {
      console.log("this is the request body " + req.body.userId);
      db.collection('userbooks').findOneAndUpdate({_id: ObjectId(req.body.userId)}, {
        $set: {
          bookTitle: req.body.bookTitle,
          bookAuthor : req.body.bookAuthor,
          level : req.body.level,
          description: req.body.description
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.render('profile')
      })
    })

    app.delete('/books', (req, res) => {
      db.collection('userbooks').findOneAndDelete({bookTitle: req.body.bookTitle, bookAuthor: req.body.bookAuthor, level: req.body.level}, (err, result) => {
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

// ---------------------------------------
// IMAGE CODE
// ---------------------------------------
// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'public/images/uploads')
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + '-' + Date.now() + ".png")
//     }
// });
// var upload = multer({storage: storage});
//
// app.post('/up', upload.single('file-to-upload'), (req, res, next) => {
//
//     insertDocuments(db, req, 'images/uploads/' + req.file.filename, () => {
//         //db.close();
//         //res.json({'message': 'File uploaded successfully'});
//         res.redirect('/profile')
//     });
// });
//
// var insertDocuments = function(db, req, filePath, callback) {
//     var collection = db.collection('users');
//     var uId = ObjectId(req.session.passport.user)
//     collection.findOneAndUpdate({"_id": uId}, {
//       $set: {
//         profileImg: filePath
//       }
//     }, {
//       sort: {_id: -1},
//       upsert: false
//     }, (err, result) => {
//       if (err) return res.send(err)
//       callback(result)
//     })
//     collection.findOne({"_id": uId}, (err, result) => {
//         //{'imagePath' : filePath }
//         //assert.equal(err, null);
//         callback(result);
//     });
// }
// ---------------------------------------
// IMAGE CODE END
// ---------------------------------------


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
            successRedirect : '/profile', // redirect to the secure profile section
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
            successRedirect : '/profile', // redirect to the secure profile section
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
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
