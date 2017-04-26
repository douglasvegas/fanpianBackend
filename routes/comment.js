var express = require('express');
var router = express.Router();
var geoip = require('geoip-lite');

var CommentModel = require('../models/CommentModel');
var PostModel = require('../models/PostModle')

//获取留言
router.post('/:postId', (req, res, next) => {
    var postId = req.params.postId; 
    var pageNo = 1;
    var pageSize = 99;
    CommentModel.getCommentsById(postId,pageNo,pageSize)
        .then( comments => {
            return res.json(comments)
        })
        .catch(next)
})
//创建留言
router.post('/:postId/create', function (req, res, next) {
    
    if (!req.session.user) {
        return res.json({
            code: 501,
            msg:'请先登录'
        })
    }
    var ua = req.headers['user-agent'];
    const ip = (req.headers['x-forwarded-for'] || 
            req.headers['x-real-ip'] || 
            req.connection.remoteAddress || 
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress ||
            req.ip ||
            req.ips[0]).replace('::ffff:', '');
    const location = geoip.lookup(ip);
    var comment = {};
    if (location) {
        comment.location = {
            city: ip_location.city,
            range: ip_location.range,
            country: ip_location.country
        };
    };
    var author = req.session.user._id;
    var content = req.body.content;
    var postId = req.params.postId;
    var quoteId = req.body.quoteId;
    var quoteName = req.body.quoteName;

    
    comment.ua = ua;
    comment.ip = ip;
    comment.author = author;
    comment.content = content;
    comment.postId = postId;
    comment.quoteId = quoteId;
    comment.quoteName = quoteName;
    
    Promise.all([
        CommentModel.createComment(comment),
        PostModel.incComment(postId)
    ]).then( result => {
        return res.json({
            code: 200,
            msg: '新增成功',
            data: result[0]
        })
    }).catch(next)
    return;
})

module.exports = router;