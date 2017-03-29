var express = require('express')
var router = express.Router();


var sha1 = require('sha1')
var UserModel = require('../models/UserModel')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.get('/', function (req, res, next) {
    return res.render('signin')
})

router.post('/',multipartMiddleware,function (req, res, next) {
    //清空session中用户信息
    var name = req.body.name;
    var password = req.body.password;
    UserModel.getUserByName(name)
        .then(function (user) {

            //检查用户名是否存在
            if (!user) {
                return res.json({
                    code: 404,
                    message: '没有此用户！'
                })
            }
            //检查密码是否匹配
             if (sha1(password) !== user.password) {
                 return res.json({
                     code: 405,
                     message: '用户名或密码错误'
                 })
             } 

             user.password = null;
             req.session.user = user;

             return res.json({
                 code: 200,
                 message: '登录成功',
                 user: user
             })
        })
        .catch(next)
})

module.exports = router;