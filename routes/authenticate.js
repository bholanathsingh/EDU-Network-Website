
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var shortid = require('shortid');
var User = require('../models/user');

router.route('/login')
.post(function (req, res) {
    User.getUser({ $or: [{ UserName: req.body.UserName }, { PhoneNumber: req.body.UserName }] }, function (error, user) {
        if (error)
            res.json({ success: false, data: error });
        if(user)    
        {
        if (user.validPassword(req.body.Password)) {
          
          const payload = {admin: user.Email};
          var token = jwt.sign(payload,'secret');

          User.findOneAndUpdate({ UserName: user.UserName },{ $set: { AcessTocken: token }}, function (error, user) {
            if (error)
                 res.json({ success: false, data: error });
                // return the information including token as JSON
                res.json({
                  success: true,
                  data:{
                  user:{UserName:user.UserName,Email:user.Email,DisplayName:user.DisplayName,PhoneNumber:user.PhoneNumber},
                  token: token}
                });
           });

        } 
        else  
        {
            console.log('Invalid Password');
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        }
      }
       else
       res.json({ success: false, message: 'Authentication failed. User not found.' });
    });
});

router.route('/user/:token')
.get(function (req, res,next) {
  debugger;  
    // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token']||req.params.token;
  
    // decode token
    if (token) {
        console.log(token);
      // verifies secret and checks exp
      jwt.verify(token, 'secret', function(err, decoded) {      
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;    
          console.log(decoded) // bar
          next();
        }
      });
  
    } else {
  
      // if there is no token
      // return an error
      return res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
      });
  
    }

});



router.route('/signup')
.post(function (req, res) {
    // console.log('==========================+++++++++++++++++++++======================================');
    // console.log(req.body);
    // console.log('==========================+++++++++++++++++++++======================================');
   User.getUser({ $or: [{ UserName: req.body.UserName }, { PhoneNumber: req.body.UserName }] }, function (error, user) {
        if (error)
            throw error;
        if(!user)    
        {
          var objUser=new User();
          req.body.Password=objUser.generateHash(req.body.Password);
          req.body.YourReferralCode=(shortid.generate()).toUpperCase();
          const payload = {admin: req.body.UserName};
          var token = jwt.sign(payload,'secret');
          // var token = jwt.sign(payload,'secret', { expiresIn: '4h' });
          req.body.AcessTocken=token;
          // referal code valu add in acoount refered amount - 
          User.addUser(req.body, function (error, user) {
              if (error)
                  res.json({ success: false, data: error });
                  // return the information including token as JSON
              res.json({
                  success: true,
                  data:{
                  user:{UserName:user.UserName,Email:user.Email,DisplayName:user.DisplayName,PhoneNumber:user.PhoneNumber},
                  token: token}
                });
          });

        }
        else  
        {
            console.log('user already exist');
            res.json({ success: false, message: 'user already exist.' });
        }
    });
});




router.route('/validateuser')
.post(function (req, res) {
    // console.log(req.body);
    User.getUser({ $or: [{ UserName: req.body.UserName }, { PhoneNumber: req.body.UserName }] }, function (error, user) {
        if (error)
            res.json({ success: false, data: error });
        if(user)    
          res.json({ success: false, message: 'user already exist.' });
      
         res.json({ success: true, data: user });
    });
});



router.route('/user')
.get(function (req, res) {
    User.getUsers(function (error, users) {
      if (error)
         res.json({ success: false, data: error });

      res.send({ success: true, data: users });
    });
});


module.exports = router;