var Comment = require('../lib/mongo').Comment;

module.exports = {
    //新增评论
    createComment: function createComment(comment) {
        return Comment.create(comment);
    },
    //删除评论
    removeComment: function removeComment(id) {
        return Comment.remove({_id: id}).exec()
    },
    //获取评论
    getCommentsById: function getCommentsById (postId,pageNo,pageSize) {
        return Comment.find({postId: postId})
            .limit(pageSize)
            .skip(pageSize * (pageNo -1) )
            .populate({ path:'author', model: 'User', select: {'name':1, 'avatar':1 ,_id:0}})
            .populate({path: 'quoteId', model: 'Comment', select: {'content':1, _id:0}})
            .exec(); 
    }
}