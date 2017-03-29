var Keep = require('../lib/mongo').Keep;

module.exports = {
    //新增喜欢
    addKeep: function addKeep (postId, userId) {
        return Keep.create({postId: postId,userId: userId })
    },
    //移除喜欢
    removeKeep: function removeKeep (postId, userId) {
        return Keep.remove({postId: postId, userId: userId}).exec()
    },
    //查找记录
    findIfKeep: function findIfKeep (postId, userId) {
        return Keep.find({postId: postId, userId: userId}).exec()
    }
}