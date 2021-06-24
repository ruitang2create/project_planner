const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const plansRouter = require('./routes/plans');
const storiesRouter = require('./routes/stories');
const port = 8080;

const app = express();
app.use(cors({
  origin: ["http://projectplanner.ruitangcs.com","http://192.168.100.108:3000", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const cookieAge = 30;
app.use(session({
  key: "userId",
  secret: "fullmetalalchemist",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1000 * 60 * 60 * 24 * cookieAge,
  },
}));

app.get('/', (req, res) => {
  res.send("Hello from server on AWS EC2!");
});

app.use('/plans', plansRouter);
app.use('/stories', storiesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => console.log('Listening on port: ' + port + '...'));

module.exports = app;
