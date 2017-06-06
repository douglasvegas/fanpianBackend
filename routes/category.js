var express = require('express');
var router = express.Router();
var categoryModel = require('../models/CategoryModel')
var adminAuth = require('../interceptor/adminAuth.js');
//获取栏目列表
router.post('/', function (req, res, next) {
    categoryModel.getAllCategory().then(function (result) {
        return res.json({
            code: 200,
            data: result
        });
    }).catch(next)

})
//新增栏目

router.post('/create', adminAuth,function (req, res, next) {
    const categoryName = req.body.categoryName;

    categoryModel.createCategory({name:categoryName}).then(function (result) {
        console.log(result)
        return res.json(result)
    }).catch( e => {
        var detailInfo = e.toJSON();
        if (e.message.match('E11000 duplicate key')) {
            if (e.message.match('name')) {
                return res.json({
                    code: 501,
                    msg: '类目名' + detailInfo.op.name + '已被占用😭'
                })
            }
        }
        next(e)
    })

})

// 下线栏目
router.post('/offline', adminAuth,function (req, res, next) {
    const categoryId = req.body.categoryId;

    categoryModel.offlineCategory(categoryId).then(function (result) {
        console.log(result);
        return res.json(result);
    }).catch(next);
});

// 上线栏目
router.post('/online', adminAuth,function (req, res, next) {
    const categoryId = req.body.categoryId;

    categoryModel.onlineCategory(categoryId).then(function (result) {
        console.log(result);
        return res.json(result);
    }).catch(next);
});
module.exports = router;