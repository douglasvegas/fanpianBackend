var express = require('express')
var router = express.Router()

var PostModel = require('../models/PostModle')
var CommentModel = require('../models/CommentModel')


router.get('/write', function (req, res, next) {
    res.render('post')
})

router.get('/',function (req, res, next) {
    var id = req.session.user._id;
    PostModel.getPostsByAuthor(id).then(function (result) {
        return res.json(result)
    }).catch(function (err){
        console.log(err)
    })
})

router.post('/',function (req, res, next) {
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;
    var imgUrl = req.fields.imgUrl
    // var title = req.body.title;
    // var content = req.body.content;
    // var imgUrl = req.body.imgUrl
    var pv = 0;
    var post = {
        author: author,
        title : title,
        content: content,
        imgUrl:imgUrl,
        pv: pv
    }

    //新建一个post
    PostModel.createPost(post).then(function (result) {
        return res.json({
            code: 200,
            msg: '新增成功',
            data: result
        })
    }).catch(function (err) {
        return res.json({
            msg: 'fail'
        })
    })
})

router.get('/:postId/comment', function (req, res, next) {
    res.render('comment')
})

router.post('/:postId/comment',function (req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;
    var content = req.fields.content;

    var comment = {
        postId: postId,
        content: content,
        author: author
    }
    CommentModel.createComment(comment).then(function (result) {
        return res.json(result)
    }).catch(function (err) {
        console.log(err)
    })
})

router.post('/:postId/comment/:commentId/remove', function (req, res, next) {
    var commentId = req.params.commentId;
    CommentModel.removeComment(commentId).then(function (result) {
        if (result.ok && result.n > 0) {
            return res.json({
                message:'删除成功',
                code : 200
            })
        } 
    }).catch(function (err) {
        console.log(err)
    })
})

module.exports = router;