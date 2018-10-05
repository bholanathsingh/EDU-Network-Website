var express = require('express');
var router = express.Router();
var User=require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/update', function(req, res, next) {

  User.updateUser({},{$set:{"UserAccount.Point":1000}},
  function (err, user){ });

  res.send({'Message':'Updated'});

});
module.exports = router;
