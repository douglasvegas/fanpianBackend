var User = require('../lib/mongo').User;

module.exports = {
    //新增用户
    createAccount: function createAccount (user) {
        return User.create(user,function (res) {
            console.log(res)
        })
    },
    //修改用户
    updateUserInfo: function updateUserInfo (name, data) {
        return User.update({name:name},{$set:data}).exec()
    },

    //获取用户
    getUserByName: function getUserByName (name) {
        return User.findOne({ name:name });
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
    getUserById: function getUserById (id) {
        return User.findOne({ _id: id });
    }

};