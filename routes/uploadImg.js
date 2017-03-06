var express = require('express')
var router = express.Router()
var path = require('path')

router.post('/', function (req, res, next) {
    var imgUrl = req.files.uploadImg.path.split(path.sep).pop();
    console.log('imgUrl是'+imgUrl)
    return res.json({
        code:200,
        msg:'上传成功',
        imgUrl:imgUrl
    })
})

module.exports = router;