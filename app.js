var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

const models = require("./models/index.js");

models.sequelize.sync().then( () => {
  console.log(" DB 연결 성공");
}).catch(err => {
  console.log("연결 실패");
  console.log(err);
});

const session = require('express-session');


/*
----로그인 유지를 세션으로 하는 방법----

app.use(session({
  key: 'sid',//세션의 키 값
  secret: 'secret',//세션의 비밀 키,쿠키값의 변조를 막기 위해서 이 값을 통해 세션을 암호화 하여 저장
  resave: false,//세션을 항상 지 여부 (false를 권장)
  saveUninitialized: true,//세션이 저장되기전에 uninitalize 상태로 만들어 저장
  cookie: {//쿠키 설정
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}));
*/
module.exports = app;
