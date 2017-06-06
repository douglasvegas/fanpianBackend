var User = require('../lib/mongo').User;
module.exports = {
    //新增用户
    createAccount: function createAccount (user) {
        return User.create(user);
    },
    //修改用户
    updateUserInfoById: function updateUserInfoById (id, data) {
        return User.update({_id: id},{$set:data}).exec()
    },

    //获取用户
    getUserByName: function getUserByName (name) {
        return User.findOne({ name:name }).exec();
    },

    //获取所有用户 分页 模糊搜索
    getAllUsers: function getAllUsers (pageNo,pageSize = 15,name) {
        var qs = new RegExp(/.*/);
        if (name) {
            qs = new RegExp(name)
        }
        return User.find({name: { $regex: qs, $options: "si" }},{_v:0,password:0})
                    .limit(pageSize)
                    .skip(pageSize * (pageNo -1))
                    .exec();    
        
    },
    //获取所有用户数
    getAllUsersCount: function getAllUsersCount (name) {
        var qs = new RegExp(/.*/);
        if (name) {
            qs = new RegExp(name)
        }
        return User.count({name: { $regex: qs, $options: "si" }}).exec();
        
    },
    //删除用户
    deleteUser: function deleteUser (name) {
        return User.remove({name:name}).exec()
    },

    //根据ID删除用户
    deleteUserById: function deleteUserById (id) {
        return User.remove({_id: id}).exec();
    },

    //根据id获取用户
    getUserById: function getUserById (id,cb) {
        return User.findOne({ _id: id },{_v:0,_id:0,password:0}).exec();
    },
    //模糊搜索用户
    searchUserByName: function searchUserByName (name) {
        var qs = new RegExp(name);
        return User.find({name: { $regex: qs } }).exec();
    },
    searchUserCountByName: function searchUserByName (name) {
        var qs = new RegExp(name);
        return User.count({name: { $regex: qs } }).exec();
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