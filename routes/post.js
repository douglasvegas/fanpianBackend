var express = require('express')
var path = require('path')
var fs = require('fs');
var router = express.Router()

var mongoose = require('mongoose')
var PostModel = require('../models/PostModle')
var LikeModel = require('../models/PostLike')
var KeepModel = require('../models/PostKeep')
var UserModel = require('../models/UserModel')

var CommentModel = require('../models/CommentModel')
var moment = require('moment')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
const objectAssign = require('object-assign');

//热门
router.post('/hot', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    if (pageNo*pageSize > 30) {
        return res.json({
            msg:'max exceed',
            data: [],
            pageSize: pageSize,
            pageNo: pageNo
        })
    }
    PostModel.getHotPosts(pageNo, pageSize).then(function (result) {
        return res.json({
            data: result,
            pageSize: pageSize,
            pageNo: pageNo
        })
    }).catch(next)
})

//获取相应cateId下的文章
router.post('/cate/:cateId', function (req, res, next) {
    var cateId = req.params.cateId;
    var pageNo = req.body.pageNo;
    var pageSize = req.body.pageSize;
    PostModel.getCategoryPosts(cateId,pageNo,pageSize).then(function (result) {
        return res.json(result)
    }).catch(function (err) {
        console.log(err)
    })

})

router.get('/write', function (req, res, next) {
    return res.render('post')
})

router.get('/',function (req, res, next) {
    var id = req.session.user._id;
    PostModel.getPostsByAuthor(id).then(function (result) {
        return res.json(result)
    }).catch(function (err){
        console.log(err)
    })
})

//新建一个post
router.post('/',multipartMiddleware, function (req, res, next) {
    var author = req.session.user._id;
    var title = req.body.title;
    var content = req.body.content;
    var cateId = req.body.cateId;

    var post = {};
    post.imgUrl = '';
    post.type = 1;//无图模式
    if(req.body.imgUrl){
        var imgData = req.body.imgUrl;
        //上传图片
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');
        var path1 = path.join(__dirname,'../public/upload/');
        var date = Date.now(),
            random = String(Math.random()*100000).split('.')[1];
        var uploadName = date + '_' + random + '.jpeg';
        var fullPath = path1 + '' + uploadName;
        fs.writeFileSync( fullPath, dataBuffer, function(err) {
            if(err){
                return res.send(err);
            }else{
                return res.json({
                    code: 501,
                    msg:'上传图片出错'
                });
            }
        });
        post.imgUrl = '/upload/' + uploadName;
        post.type = 0; //有图模式
    }

    var pv = 0;
    post.cateId = cateId;
    post.author = author;
    post.title = title;
    post.content = content;
    
    post.pv = 0;

    //新建一个post
    PostModel.createPost(post).then(function (result) {
        return res.json({
            code: 200,
            msg: '新增成功',
            data: result
        })
    }).catch(next)
})
//文章详情
router.post('/:postId', function (req, res, next) {
    var name = '',userId = mongoose.Types.ObjectId(0);
    if (req.session && req.session.user && req.session.user.name) {
        name = req.session.user.name;
        userId = req.session.user._id;
    }
    var postId = req.params.postId;
    Promise.all([
        LikeModel.findIfLike(postId,userId),
        KeepModel.findIfKeep(postId,userId),
        PostModel.incPv(postId),        //获得pv
        PostModel.getPostById(postId) //获取文章信息
        
    ]).then( function (result) {
        var json = {};
        json = objectAssign({},result[3][0].toObject())
        var ctime = moment(json.create_date).format().replace('T',' ').split('+')[0];
        var status = 0;
        if (!name) {
            status = 0; //游客
        }
        if (name === json.author.name) {
            status = 1; //本尊
        } 
        if(name && name != json.author.name) {
            status = 2; //登录者
        }
        json = objectAssign(json,{status: status},{ctime: ctime},{code: 200},{isLike: result[0].length},{isKeep: result[1].length})
        return res.json(json)
    }).catch(next)
})
//文章点赞
router.post('/:postId/like', function (req, res, next) {
    var postId = req.params.postId;
    var userId = req.session.user._id;
    Promise.all([
        LikeModel.addLike(postId, userId),
        PostModel.incLike(postId),
        UserModel.incLike(userId)
    ]).then( result => {
        return res.json(result[0])
    }).catch(next)
})
//文章取消点赞
router.post('/:postId/likeCancel', function (req, res, next) {
    var postId = req.params.postId;
    var userId = req.session.user._id;
    Promise.all([
        LikeModel.removeLike(postId, userId),
        PostModel.decLike(postId),
        UserModel.decLike(userId)
    ]).then( result => {
        return res.json(result[0])
    }).catch(next)
})
//文章收藏
router.post('/:postId/keep', function (req, res, next) {
    var postId = req.params.postId;
    var userId = req.session.user._id;
    Promise.all([
        KeepModel.addKeep(postId, userId),
        PostModel.incKeep(postId),
        UserModel.incKeep(userId)
    ]).then( result => {
        return res.json(result[0])
    }).catch(next)
})
//文章取消收藏
router.post('/:postId/keepCancel', function (req, res, next) {
    var postId = req.params.postId;
    var userId = req.session.user._id;
    Promise.all([
        KeepModel.removeKeep(postId, userId),
        PostModel.decKeep(postId),
        UserModel.decKeep(userId)
    ]).then( result => {
        return res.json(result[0])
    }).catch(next)
})

// router.get('/:postId/comment', function (req, res, next) {
//     return res.render('comment')
// })

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
    }).catch(next)
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
    }).catch(next)
})



module.exports = router;