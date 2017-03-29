var User = require('../lib/mongo').User;
module.exports = {
    //新增用户
    createAccount: function createAccount (user) {
        return User.create(user);
    },
    //修改用户
    updateUserInfo: function updateUserInfo (name, data) {
        return User.update({name:name},{$set:data}).exec()
    },

    //获取用户
    getUserByName: function getUserByName (name) {
        return User.findOne({ name:name }).exec();
    },

    //获取所有用户
    getAllUsers: function getAllUsers () {
        return User.find({}).exec();
    },
    //删除用户
    deleteUser: function deleteUser (name) {
        return User.remove({name:name}).exec()
    },

    //根据id获取用户
    getUserById: function getUserById (id,cb) {
        return User.findOne({ _id: id },{_v:0,_id:0,password:0}).exec();
    },


    incLike: function (userId) {
        return User
            .update({_id: userId}, { $inc: {like: 1} })
            .exec()
    },
    decLike: function (userId) {
        return User
            .update({_id: userId}, { $inc: {like: -1} })
            .exec()
    },
    incKeep: function (userId) {
        return User
            .update({_id: userId}, { $inc: {keep: 1} })
            .exec()
    },
    decKeep: function (userId) {
        return User
            .update({_id: userId}, { $inc: {keep: -1} })
            .exec()
    }


};