var express = require('express');
var router = express.Router();

var sha1 = require('sha1')
var path = require('path')
var UserModel = require('../models/UserModel')
router.post('/',function (req, res, next) {
    var user = {
        name: req.fields.name,
        password: sha1(req.fields.password),
        phone: req.fields.phone,
        gender: req.fields.gender,
        age: req.fields.age,
        avatar: req.files.avatar.path.split(path.sep).pop()
    }
    UserModel.createAccount(user).then(function (user) {
        //写入session
         user.password = null;
         req.session.user = user;

        var json = {
            code: 200,
            message: '新增成功',
            result: user
        }
        return res.json(json)
        
    }).catch(function (err) {
        return res.json(err)
    })
})

module.exports = router