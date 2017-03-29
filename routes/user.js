var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');

// var check = require('../interceptor/check')
// var checkLogin = check.checkLogin;
/* GET /user listing. */
router.get('/', function(req, res, next) {
      //查询所有用户
      UserModel.getAllUsers().then(function(result){
          return res.json(result)
      })
    //根据session获取当前用户
   

    //新建一个用户
    // UserModel.createAccount(user).then(function (result) {
    //   return res.json(result)
    // }).catch(function (err) {
    //   return res.json(err)
    // })  
    //修改一个用户信息
    // UserModel.updateUserInfo("testname",{gender:'f',phone: 15013516500}).then(function (result) {
    //   return res.json(result)
    // }).catch(function(err){
    //   return res.json(err)
    // })
    //删除一个用户
    // UserModel.deleteUser(sName).then(function (result) {
    //   res.json(result)
    // })

    //根据用户名查询一个用户
    // UserModel.getUserByName(sName).then(function(result) {
    //   return res.json(result);
    // })
});

// post /user
router.post('/', (req, res, next) => {
     if (!req.session.user) {
       return res.json({
         code:202,
         message:'重新登录'
       })
     }

    var id = req.session.user._id;
    UserModel.getUserById(id).then(result => { return res.json(result); return })
    .catch(next)

})

module.exports = router;
