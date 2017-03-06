var express = require('express')
var router = express.Router()
var mongoose = require('mongoose');

var FollowModel = require('../models/FollowModel')
router.post('/getCount', function (req, res, next) {
    var id = req.session.user._id;
    var user = mongoose.Types.ObjectId(id);
    // var following = req.fields.following;

    // FollowModel.getFollowCount(user).then(function (result) {
    //     console.log(result);
    // })

    // FollowModel.getFansCount(user).then(function (result) {
    //     console.log(result);
    // })

    Promise.all([
        FollowModel.getFollowCount(user), //获取关注数
        FollowModel.getFansCount(user), //获取粉丝数
    ])
    .then(function (result) {
        console.log(result)
        var follows = result[0]
        var fans    = result[1]
        res.json({
            follows: follows,
            fans: fans
        })
    })
    .catch(next)

})

module.exports = router;