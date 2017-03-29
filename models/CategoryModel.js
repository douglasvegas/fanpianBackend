var Category = require('../lib/mongo').Category

module.exports = {

    //新增栏目
    createCategory: function createCategory (category) {
        return Category.create(category,function (res) {
            console.log(res)
        })
    }, 
    //获取栏目
    getAllCategory: function getAllCategory () {
        return Category.find({}).exec();
    }
}