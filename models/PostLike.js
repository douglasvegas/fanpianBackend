var Like = require('../lib/mongo').Like;

module.exports = {
    //新增喜欢
    addLike: function addLike (postId, userId) {
        return Like.create({postId: postId,userId: userId })
    },
    //移除喜欢
    removeLike: function removeLike (postId, userId) {
        return Like.remove({postId: postId, userId: userId}).exec()
    },
    //查找记录
    findIfLike: function findIfLike (postId, userId) {
        return Like.find({postId: postId, userId: userId}).exec()
    }
}