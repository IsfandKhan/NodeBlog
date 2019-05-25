var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session= require('express-session');
var multer = require('multer');
var flash = require('connect-flash');
var moment = require('moment');
var expressValidator = require('express-validator');
var upload = multer({dest:'uploads/'});
var db = require('monk')('localhost/nodeblog');

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var categoryRouter = require('./routes/categories');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(req, res, next)
{
  req.db = db;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(flash());
app.use(function(req, res, next)
{
  res.locals.messages = require('express-messages')(req, res);
  next();
});
  
app.locals.moment = moment;
app.locals.truncateText = function(text, length){
  var truncatedText = text.substring(0,length);
  return truncatedText;
}
app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave:true
}));

app.use(expressValidator({
  errorFormatter:function(param, msg, value){
    var namespace = param.split('.'),
    root  = namespace.shift(),
    formParam = root;

    while(namespace.length)
      formParam += '[' + namespace.shift() + ']';

    return {
      param: formParam,
      msg: msg,
      value:value
    };
  }
}));

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/categories', categoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
