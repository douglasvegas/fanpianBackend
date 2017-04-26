module.exports = function (app) {
  app.all('*',function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://www.douglasvegas.com");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Content-Type", "application/json");
    res.header('Access-Control-Allow-Credentials','true');
    res.header('Accept-Encoding', 'gzip, deflate');
    if (req.method == 'OPTIONS') {
      res.sendStatus(200);
      return false;
    };
    return next();
  })
  
  app.use('/signup', require('./signup'))
  app.use('/user',require('./user'))

  app.use('/signin', require('./signin'))
  app.use('/logout', require('./logout'))

  app.use('/post', require('./post'))

  app.use('/follow', require('./follow'))
  app.use('/uploadImg', require('./uploadImg'))
  app.use('/category', require('./category'))
  app.use('/comment', require('./comment'))

  // 404
  // app.all('*', (req, res) => {
  //   res.status(404).jsonp({
  //     code: 0,
  //     message: '无效的API请求'
  //   })
  // });

}
