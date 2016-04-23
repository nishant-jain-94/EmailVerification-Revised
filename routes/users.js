var express = require('express');
var router = express.Router();
var User = require('../models/user');
var tempUser = require('../models/tempUser');

var mongoose = require('mongoose');
var nev = require('email-verification')(mongoose);

mongoose.connect('mongodb://localhost/nev');

nev.configure({
  verificationURL: "http://localhost:8081/users/confirm/${URL}",
  persistentUserModel: User,
  URLLength: 48,
  tempUserCollection: 'tempUsers',
  tempUserModel: tempUser,
  URLFieldName: 'VERIFICATION_URL', //same field has to be in the temporary collection
  transportOptions: {
    service: 'Gmail',
    auth: {
      user: '*****',
      pass: '*****'
    }
  },
  verifyMailOptions: {
    from: 'Do Not Reply <limberstack@gmail.com>',
    subject: 'please confirm account',
    html: '<p>Click on the following link to confirm your account <a href="${URL}">LINK</a>.</p>',
    text: 'Please confirm by clicking on this link'
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/',function(req,res,next) {
  var email = req.body.email;
  nev.createTempUser(User(req.body),function(err,newTempUser) {
    console.log(err,newTempUser);
    if(newTempUser) {
      URL = newTempUser[nev.options.URLFieldName];
      console.log(URL)
      nev.sendVerificationEmail(email,URL,function(err,info) {
        console.log(URL);
        if(err) {
          return res.status(404).send("Error: Sending Verfication Mail.");
        }
        res.json({
          msg: "An email has been sent",
          info: info
        });
      });
    } else {
      console.log("error",err);
    }
  });
});

router.get('/confirm/:id',function(req,res,next) {
  nev.confirmTempUser(req.params.id,function(err,user){
    if(user) {
      res.send("Hurray your mail is confirmed");
    }
  });
});

module.exports = router;
