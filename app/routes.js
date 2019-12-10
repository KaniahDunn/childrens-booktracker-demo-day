module.exports = function(app, passport, db, multer, ObjectId) {
  var nodemailer = require('nodemailer');
  var multer = require('multer');
  var ObjectId = require('mongodb').ObjectID


  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    res.render('landing.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function(req, res) {
    const currentUser = req.user._id
    db.collection('userbooks').find({
      user: req.user.local.email
    }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        userbooks: result
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
        user: req.user,
        userbooks: result
      })
    })
  });

  // localhost:2000/book?userbooks_id=book
  app.get('/book/:id', isLoggedIn, function(req, res) {
    // console.log('the query request is ' + req.query);
    let queryParam = req.params.id
    db.collection('userbooks').findOne({
      _id: ObjectId(queryParam)
    }, (err, result) => {
      if (err) return console.log(err)
      res.render('book.ejs', {
        user: req.user,
        userbooks: result
      })
    });
  });

  app.put('/updatebook', (req, res) => {
    db.collection('userbooks').findOneAndUpdate({
      _id: ObjectId(req.body.userId)
    }, {
      $set: {
        bookTitle: req.body.bookTitle,
        bookAuthor: req.body.bookAuthor,
        level: req.body.level,
        description: req.body.description
      }
    }, {
      sort: {
        _id: -1
      },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.render('profile')
    })
  })

  app.post('/selectIncentives', (req, res) => {
    let incentiveId = ObjectId(req.body._id);
    const incentive = {
    'business': req.body.business,
    'coupon': req.body.coupon,
    'points' : parseInt(req.body.points),
    '_id': ObjectId(req.body.incentiveId)
    }
    db.collection('userIncentives').save(incentive, (err, result) => {
      if (err) return res.send(err)
      res.render('incentives', {
        userIncentives: result
      })
    })
  })


  app.delete('/books', (req, res) => {
    db.collection('userbooks').findOneAndDelete({
      bookTitle: req.body.bookTitle,
      bookAuthor: req.body.bookAuthor,
      level: req.body.level
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  app.post('/check',(req, res) =>{
    console.log('running updateNotes')
    db.collection('userIncentives').save({business: req.body.business,coupon: req.body.coupon,points: req.body.points, user: ObjectId(req.session.passport.user)}, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/incentives')
    })
  });

  // User incentive choices =======================================
  app.get('/incentives', isLoggedIn, function(req, res) {
    db.collection('incentives').find().toArray((err, result) => {
      let bookSum = 0;
      if (err) return console.log(err)
      db.collection('userbooks').find({
        user: req.user.local.email
      }).toArray((bookError, bookResult) => {
        for (let i = 0; i < bookResult.length; i++) {
          bookSum += bookResult[i].bookPoints
        }
        db.collection('userIncentives').find({user: ObjectId(req.session.passport.user)}).toArray((err, incentiveResult) =>{
          if (err) return console.log(err);
          res.render('incentives', {
            user: req.user,
            bookSum: bookSum,
            incentives: result,
            userIncentives : incentiveResult
          })
        })
      })
    })
  });

  // upload book form with image
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + ".png")
    }
  });
  var upload = multer({
    storage: storage
  });

  app.post('/books', upload.single('file-to-upload'), (req, res, next) => {


    insertDocuments(db, req, 'images/uploads/' + req.file.filename, () => {
      //db.close();
      //res.json({'message': 'File uploaded successfully'});
      res.redirect('/profile')
    });
  });

  var insertDocuments = function(db, req, filePath, callback) {
    const points = () => {
      const level = req.body.level
      const wordCount = req.body.wordCount
      if (level === "Easy") {
        if (wordCount <= 20) {
          return 100
        } else if (wordCount <= 50) {
          return 200
        } else {
          return 300
        }
      } else if (level === "Challenging") {
        if (wordCount <= 50) {
          return 101
        } else if (wordCount <= 80) {
          return 201
        } else {
          return 301
        }
      } else if (level === "Very Hard") {
        if (wordCount <= 80) {
          return 102
        } else if (wordCount <= 100) {
          return 202
        } else {
          return 302
        }
      } else {
        console.log(`Unexpected level ${level}`)
      }
    }
    console.log(points)

    var collection = db.collection('userbooks');
    var uId = ObjectId(req.body.userId)
    let date = new Date();
    collection.save({
      bookTitle: req.body.bookTitle,
      bookAuthor: req.body.bookAuthor,
      level: req.body.level,
      description: req.body.description,
      user: req.body.userName,
      dateAdded: date.toDateString(),
      wordCount: parseInt(req.body.wordCount),
      bookImage: filePath,
      bookPoints: points()
    }, (err, result) => {
      if (err) return res.send(err)
      callback(result)
    })
  }

// forum page ==================================================
app.get('/forum', function(req, res) {
    db.collection('userbooks').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('forum.ejs', {
        user : req.user,
        userbooks: result
      })
    })
});

app.post('/comment', (req, res) => {
      db.collection('comments').save({userName: req.body.userName, comment: req.body.comment}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/forum')
      })
    })
  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
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
// meahtaetujrridkx
