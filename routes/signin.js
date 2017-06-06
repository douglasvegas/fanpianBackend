var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var moment = require('moment');
var sha1 = require('sha1');
var User = require('../lib/mongo').User;
var UserModel = require('../models/UserModel');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var adminAuth = require('../interceptor/adminAuth')

router.get('/', function (req, res, next) {
    return res.render('signin');
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
        .catch(next);
});

router.post('/admin', function (req, res, next) {
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
             if (name != 'admin') {
                 return res.json({
                     code: 400,
                     message: '非管理员禁止入内'
                 })
             }
             var expires = moment().add(7, 'days').valueOf();
             user.password = null;
             var token = jwt.encode({
                 iss: user._id,
                 exp: expires
             }, 'recordAdmin');

             return res.json({
                 token: token,
                 code: 200,
                 message: '登录成功',
                 expires: expires,
                 user: user
             });
        })
        .catch(next);
})

router.post('/auth', function (req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        try {
            var decoded = jwt.decode(token,'recordAdmin');
            if (decoded.exp <= Date.now()) {
                return res.json({
                    code: 400,
                    msg: 'Access token has expires'
                })
            }
            User.findOne({ _id: decoded.iss}, (err, user) => {
                if (err) {
                    return res.json({
                        code: 401,
                        msg: '身份验证失败'
                    })
                }
                return res.json({
                        code: 200,
                        msg: '身份验证成功'
                    })
            })

        } catch (err) {
            return next();
        }
    } else {
        next();
    }
})

module.exports = router;