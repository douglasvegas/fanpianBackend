var Follow = require('../lib/mongo').Follow;

module.exports = {
    //新增关注
    addFollow: function addFollow (user, following) {
        return Follow.create({user: user,following: following }, function (res) {
            console.log(res)
        })
    },
    //移除关注
    removeFollow: function removeFollow (user, following) {
        return Follow.remove({user: user,following: following }).exec()
    },
    //获取关注count
    getFollowCount: function getCount (user) {
        console.log(typeof user)
        return Follow.count({user: user}, function (res) {
            console.log(res)
        })
    },
    //获取粉丝count
    getFansCount: function getFansCount (user) {
        return Follow.count({following: user}, function (res) {
            console.log(res)
        })
    }
}