var Category = require('../lib/mongo').Category

module.exports = {
    //新增栏目
    createCategory: function createCategory (category) {
        return Category.create(category);
    }, 
    //获取栏目
    getAllCategory: function getAllCategory () {
        return Category.find({}).exec();
    },
    //下线栏目
    offlineCategory: function offlineCategory (categoryId) {
        return Category.update({_id: categoryId},{$set:{isDelete: true}}).exec() 
    },
    //上线栏目
    onlineCategory: function onlineCategory (categoryId) {
        return Category.update({_id: categoryId},{$set:{isDelete: false}}).exec() 
    }
}