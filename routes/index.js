module.exports = function (app) {
  app.all('*',function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    // res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    // res.header('X-Content-Type-Options','nosniff');

    // res.header("Access-Control-Allow-Headers", "Authorization, Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With");
    // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");

    res.header('Access-Control-Allow-Credentials','true');
    if (req.method == 'OPTIONS') {
      res.sendStatus(200);
      return false;
    };
    next();
  })
  app.get('/',function (req, res) {
    res.render('index',{title:'sunxin'})
  })
  app.use('/signup', require('./signup'))
  app.use('/user',require('./user'))

  app.use('/signin', require('./signin'))
  app.use('/logout', require('./logout'))

  app.use('/post', require('./post'))

  app.use('/follow', require('./follow'))
  app.use('/uploadImg', require('./uploadImg'))

}
