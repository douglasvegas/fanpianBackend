var Post = require('../lib/mongo').Post;
var marked = require('marked')
module.exports = {
    //获取用户所有post
    getPostsByAuthor: function getPostsByAuthor (id) {
        return Post.find({ author: id}).exec()
    },
    //生成一篇post
    createPost: function createPost (post) {
        post.content = marked(post.content)
        return Post.create(post, function (res) {
            console.log('res:'+res)
        })
    }
}