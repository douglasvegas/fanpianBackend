var express = require('express')
var router = express.Router();

router.post('/',function (req, res, next) {
    //清空session中用户信息
    req.session.user = null;
    req.session.cookie.maxAge = 0;
    return res.json({
        code: 200,
        message: '退出成功'
    })
})

module.exports = router;