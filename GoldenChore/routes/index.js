var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home');
});

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index', {expressFlash: req.flash('message') });
});

/* GET instruction */
router.get('/instruction', function(req, res) {
    res.render('tasklist');
});

/* Login */
router.post('/login', function(req, res) {

    // Set our internal DB variable
    var con = req.con;

    // Get our form values. These rely on the "name" attributes
    var useremail = req.body.useremail;
    var password = req.body.password;

    // Set our collection and submit to DB
    con.query('SELECT user_id, first_name, password FROM users WHERE email=\"'+ useremail +'\";',
      function(err, rows) {
        if(err) throw err;
        // And forward to success page
        if(rows[0]) {
          if(rows[0].password == password) {
            console.log('login succ');
            // res.render('home', {fnname: rows[0].first_name});
            res.redirect('/users/'+rows[0].user_id+'?fname='+rows[0].first_name);
          }
          else {
            console.log('login fail');
            req.flash('message', 'Your login attempt has failed. Please check that your email and password have been entered correctly.');
            res.redirect('/');
          }
        }
        else {
          console.log('login fail');
          req.flash('message', 'Your login attempt has failed. Please check that your email and password have been entered correctly.');
          res.redirect('/');
        }
      }
    );
});

/* GET Singup page. */
router.get('/newuser', function(req, res) {
    res.render('newuser');
});

/* POST to Add User */
router.post('/signup', function(req, res) {

    // Set our internal DB variable
    var con = req.con;

    // Get our form values. These rely on the "name" attributes
    var useremail = req.body.useremail;
    var password = req.body.password;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var phone = req.body.phone;
    var driverlicense = req.body.driverlicense;
    var street = req.body.street;
    var city = req.body.city;
    var state = req.body.state;
    var zip_code = req.body.zip_code;

    // Set our collection and submit to DB
    con.query('SELECT loc_id FROM location WHERE city=\"'+city+'\" AND state=\"'+state+'\" AND zip_code=\"'+zip_code+'\";',
      function(err, rows) {
        if(err) throw err;
        // if the combination is in the database
        if(rows[0])
        { 
          var loc_id = rows[0].loc_id;
          con.query('INSERT INTO users (last_name,first_name,password,email,phone_number,street_address,driver_license) VALUES (' + 
          '\"'+lname+'\",\"'+fname+'\",\"'+password+'\",\"'+useremail+'\",\"'+phone+'\",\"'+street+'\",\"'+driverlicense+'\");',
            function(err) {
              if(err) throw err;
              con.query('SELECT user_id, first_name FROM users WHERE email=\"'+useremail+'\";',
                function(err, rows) {
                  if(err) throw err;
                  // console.log(rows[0]);
                  // console.log(loc_id);
                  var first_name = rows[0].first_name;
                  // console.log('first_name: '+first_name);
                  var user_id = rows[0].user_id;
                  con.query('INSERT INTO user_loc VALUES (\"'+loc_id+'\",\"'+user_id+'\");',
                    function(err) {
                      if(err) throw err;
                      
                      // only for old people
                      // con.query('SELECT ser_id FROM ')

                      // And forward to success page
                      // res.render('home', {fname: first_name, user_id: user_id});
                      res.redirect('/users/'+user_id+'?fname='+first_name);

                    }
                  );
                }
              );
            }
          );
        }

        // the combination is not in the database
        else {
          con.query('INSERT INTO location (city,state,zip_code) VALUES (' + 
          '\"'+city+'\",\"'+state+'\",\"'+zip_code+'\");',
            function(err) {
              if(err) throw err;
              con.query('INSERT INTO users (last_name,first_name,password,email,phone_number,street_address,driver_license) VALUES (' + 
              '\"'+lname+'\",\"'+fname+'\",\"'+password+'\",\"'+useremail+'\",\"'+phone+'\",\"'+street+'\",\"'+driverlicense+'\");',
                function(err) {
                  con.query('SELECT loc_id FROM location WHERE city=\"'+city+'\" AND state=\"'+state+'\" AND zip_code=\"'+zip_code+'\";',
                    function(err, rows) {
                      if(err) throw err;
                      // console.log(rows);
                      var loc_id = rows[0].loc_id;
                      con.query('SELECT user_id, first_name FROM users WHERE email=\"'+useremail+'\";',
                        function(err, rows) {
                          var user_id = rows[0].user_id;
                          var first_name = rows[0].first_name;
                          console.log('first_name: '+first_name);
                          con.query('INSERT INTO user_loc VALUES (\"'+loc_id+'\",\"'+user_id+'\");',
                            function(err) {
                              if(err) throw err;
                              // And forward to success page
                              // res.render('home', {fnname: first_name});
                              res.redirect('/users/'+user_id+'?fname='+first_name);
                            }

                          );
                        }
                      );
                    }
                  );

                }
              );
              
            }
          );
        }

      }
    );

});

module.exports = router;
