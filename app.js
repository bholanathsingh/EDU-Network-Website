var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// connect with mondo db data base localhost
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/edu-network', { useNewUrlParser: true });
//mongoose.connect('mongodb://bholanathsingh:bholanathsingh@1@ds249727.mlab.com:49727/searchdata',{useMongoClient: true});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// file upload limit increse of set size
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.json({limit: "50mb"}));

// CORS on ExpressJS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
  res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS, DELETE');
  if ('OPTIONS' == req.method)
    res.send(200);
  else 
    next();
});

var apiinit = require('./routes/apiinit');
apiinit(app);

// url remove #
app.get('*', function (req, res) {
  console.log('sending file: ' + req.url);
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
