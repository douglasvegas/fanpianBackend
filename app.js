var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');

var nunjuck = require('nunjucks')
var config = require('config-lite')
var pkg = require('./package.json')

var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

var cors = require('cors')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
nunjuck.configure('views', {
  autoescape: true,
  express: app
})
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'my.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false,limit:'3072kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session中间件
app.use(session({
  resave: false,
  saveUninitialized: false,
  name: config.session.key,
  secret: config.session.secret,
  cookie: {
    maxAge: config.session.maxAge,
    httpOnly: false
  },
  store: new MongoStore({
    url: config.mongodb
  })
}))


//处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/upload'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));




// app.use(cors());
routes(app);

app.use(function (err, req, res, next) {
  res.render('error', {
    error: err
  })
})


if ( module.parent ) {
  module.exports = app;
} else {
  app.listen(config.port,function () {
    console.log(`${pkg.name} is listening on port ${config.port}`)
  })
}