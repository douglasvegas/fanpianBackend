var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.post('/', multipartMiddleware, function (req, res, next) {
    var imgData = req.body.uploadImg;
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    var path1 = path.join(__dirname,'../public/upload/');
    var date = Date.now(),
        random = String(Math.random()*100000).split('.')[1];
    var uploadImgName = date + '_' + random + '.jpeg';
    fs.writeFileSync( path1 + '' + uploadImgName, dataBuffer, function(err) {
        if(err){
          return res.send(err);
        }else{
          console.log(uploadImgName);  
          return res.json({
            msg: 501,
            msg:'上传图片出错'
          });
        }
    });
    // var imgUrl = req.files.uploadImg.path.split(path.sep).pop();
    return res.json({
        code:200,
        msg:'上传成功',
        imgUrl: '/upload/' + uploadImgName
    })
})

module.exports = router;