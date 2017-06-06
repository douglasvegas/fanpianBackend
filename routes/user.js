var express = require('express');
var router = express.Router();
var UserModel = require('../models/UserModel');
var Auth = require('../interceptor/auth.js');
var adminAuth = require('../interceptor/adminAuth.js');
/**
 * 查询用户 分页
 * GET /user
 * params :pageNo,pageSize 
 */
router.get('/', function(req, res, next) {
      var pageNo = parseInt(req.query.pageNo),
          pageSize = parseInt(req.query.pageSize),
          name = req.query.name;
      Promise.all([
        UserModel.getAllUsersCount(name), //获取用户数目
        UserModel.getAllUsers(pageNo,pageSize,name)
      ])
      .then( result => {
        var count = result[0];
        var users = result[1];
        return res.json({
          data: users,
          count: count,
          pageNo: pageNo,
          pageSize: pageSize
        })
      });
});

/**
 * 修改用户信息
 * post /edit
 * params :id
 */
router.post('/edit', adminAuth,function (req, res, next) {
  var id = req.body.id;
  var data = req.body.data;
  UserModel.updateUserInfoById(id,data).then( result => {
    return res.json(result);
  })
})
/**
 * 根据id删除用户
 * post /delete
 * params :id
 */
router.post('/delete', adminAuth,function (req, res, next) {
  var id = req.body.id;
  UserModel.deleteUserById(id).then( result => {
    return res.json(result)
  })
})

/**
 * 根据id获取用户信息
 * post /user
 * params :id
 */
router.post('/', Auth, function (req, res, next){
    var id = req.session.user._id;
    UserModel.getUserById(id).then(result => { return res.json(result);  })
    .catch(next)
})

module.exports = router;
