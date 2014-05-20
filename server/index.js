'use strict';

var express = require('express');
// var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')({ session: session });
var bodyParser = require('body-parser');
var compress = require('compression')();
var Authentication = require('./authentication');
var ErrorHandler = require('./error');
var passport = require('passport');
var flash = require('connect-flash');
var cors = require('cors');
var corsOptions = {
  origin: '*'
};
// A proxy for Keystone Service Catalog Endpoints
var proxyKeystone = require('proxy-keystone');
// routes
var routes = require('./routes/index');
var corsOptions = {
  origin: 'https://b5d45c6f37adce61f143-6257090f8b77658659ee2c55c0d9059e.ssl.cf1.rackcdn.com'
};

// express setup
var app = express();

app.use(favicon());
app.use(logger('dev'));
app.use(compress);
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
  secret: 'chachachangeme!!!',
  store: new MongoStore({
    url: process.env.MONGODB || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/cloud-images-ui',
    auto_reconnect: true
  })
}));
// setup passport authentication
app.use(passport.initialize());
app.use(passport.session());
// other
app.use(flash());
app.use(cors(corsOptions));

app.get('/', function(req, res){
  res.render('index', { user: req.user, title: 'Dashboard' });
});

if (app.get('env') === 'production') {
  app.set('views', __dirname + '/../dist');
  app.use(express.static(__dirname + '/../dist'));
} else {
  app.set('views', __dirname + '/../app');
  app.use(express.static(__dirname + '/../app'));
  app.use('/styles', express.static(__dirname + '/../.tmp/styles'));
}
app.set('view engine', 'html');
app.engine('html', require('ejs-locals'));

passport.use(Authentication.keystoneStrategy);
passport.serializeUser(Authentication.serializeUser);
passport.deserializeUser(Authentication.deserializeUser);

// setup routes
app.use('/', routes);

app.all('/proxy/*',
  proxyKeystone({
    userAgent: 'Rackspace Custom Dashboard'
  })
);

// app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
if (app.get('env') === 'development') {
  app.use(ErrorHandler.development);
} else {
  app.use(ErrorHandler.production);
}

module.exports = app;
