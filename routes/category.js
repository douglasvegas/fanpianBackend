var express = require('express');
var router = express.Router();
var categoryModel = require('../models/CategoryModel')

router.post('/', function (req, res, next) {
    categoryModel.getAllCategory().then(function (result) {
        return res.json({
            code: 200,
            data: result
        });
    }).catch(next)

})
router.post('/create', function (req, res, next) {
    categoryModel.createCategory({name:'音乐',categoryId:33}).then(function (result) {
        return res.json(result)
    }).catch(next)

})

module.exports = router;