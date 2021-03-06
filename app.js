const
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  multiparty = require('connect-multiparty'),
  mongoose = require('mongoose'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  passport = require('passport'),
  flash = require('connect-flash'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  User = require('./models/user'),
  faker = require('faker'),
  _ = require('lodash'),
  path = require('path'),
  middleware = require('./middleware'),
  cronjobs = require('./services/cronjobs');

const
  indexRoute = require('./routes/index'),
  usersRoute = require('./routes/users'),
  profileRoute = require('./routes/profile'),
  giftsRoute = require('./routes/gifts.js'),
  searchRoute = require('./routes/search'),
  dashboardRoute = require('./routes/dashboard'),
  adminsRoute = require('./routes/admin');

const
  mongooseDB = process.env.DATABASEURL || 'mongodb://localhost/giftcashing';

mongoose.connect(mongooseDB);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(multiparty());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require('express-session')({
  secret: 'anything',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: mongooseDB,
    touchAfter: 24 * 3600
  })
}));

// PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.pagination = {
    page: (parseInt(req.query.page) > 0)? req.query.page : 1,
    pages: 0,
    perPage: 1,
    records: 0,
    showing: 0
  }
  next();
});

app.use('/', indexRoute);
app.use('/admin/users', middleware.isLoggedIn, usersRoute);
app.use('/dashboard/profile', middleware.isLoggedIn, profileRoute);
app.use('/admin/gifts', middleware.isLoggedIn, giftsRoute);
app.use('/admin/search', searchRoute);
app.use('/dashboard', middleware.isLoggedIn, dashboardRoute);
app.use('/admin/admins', middleware.isLoggedIn, adminsRoute);

mongoose.Promise = global.Promise;

// Run Cronjobs
cronjobs.runJobs();

module.exports = app;