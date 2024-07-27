var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var https = require('https'); 
var http = require('http'); 
var fs = require('fs'); 

var indexRouter = require('./routes/index');

var app = express();

// HTTPS Options
const options = {
  key: fs.readFileSync('/path/to/your/ssl/key.pem'),
  cert: fs.readFileSync('/path/to/your/ssl/cert.pem') 
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
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

// Create an HTTP server that redirects to HTTPS
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80, () => {
  console.log('HTTP server listening on port 80 and redirecting to HTTPS');
});

// Create an HTTPS server
https.createServer(options, app).listen(8443, () => {
  console.log('HTTPS server listening on port 8443');
});

module.exports = app;
