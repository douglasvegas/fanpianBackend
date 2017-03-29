var Follow = require('../lib/mongo').Follow;

module.exports = {
    //新增关注
    addFollow: function addFollow (user, following) {
        return Follow.create({user: user,following: following })
    },
    //移除关注
    removeFollow: function removeFollow (user, following) {
        return Follow.remove({user: user,following: following }).exec()
    },
    //获取关注count
    getFollowCount: function getCount (user) {
        return Follow.count({user: user}).exec()
    },
    //获取粉丝count
    getFansCount: function getFansCount (user) {
        return Follow.count({following: user}).exec()
    }
}