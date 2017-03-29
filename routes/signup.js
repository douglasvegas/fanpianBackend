var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var sha1 = require('sha1')
var path = require('path')
var UserModel = require('../models/UserModel')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
router.post('/',multipartMiddleware,function (req, res, next) {
    var imgData = req.body.avatar;
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    var path1 = path.join(__dirname,'../public/avatar/');
    var date = Date.now(),
        random = String(Math.random()*100000).split('.')[1];
    var avatarName = date + '_' + random + '.jpeg';
    var fullPath = path1 + '' + avatarName;
    fs.writeFileSync( fullPath, dataBuffer, function(err) {
        if(err){
          return res.send(err);
        }else{
          console.log(avatarName);  
          return res.json({
            code: 501,
            msg:'上传图片出错'
          });
        }
    });
    var user = {
        name: req.body.name,
        password: sha1(req.body.password),
        email: req.body.email,
        gender: req.body.gender,
        age: req.body.age,
        avatar: '/avatar/' + avatarName
        // avatar: req.files.avatar.path.split(path.sep).pop()
    }
    UserModel.createAccount(user).then(function (user) {
        //写入session
        user.password = null;
        req.session.user = user;

        return res.json({
            code: 200,
            msg: '新增成功',
            result: user
        })
        
    }).catch( e => {
        console.log(e.toJSON())
        var detailInfo = e.toJSON();
        fs.unlink(fullPath);
        if (e.message.match('E11000 duplicate key')) {
            if(e.message.match('email')) {
                return res.json({
                    code: 501,
                    msg: '邮箱' + detailInfo.op.email + '已被占用😭'
                })
            }else if (e.message.match('name')) {
                return res.json({
                    code: 501,
                    msg: '用户名' + detailInfo.op.name + '已被占用😭'
                })
            }
            
        }
        next(e)
    })
})

module.exports = router