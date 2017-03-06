var Comment = require('../lib/mongo').Comment;
var marked = require('marked')

module.exports = {
    createComment: function createComment(comment) {
        comment.content = marked(comment.content)
        return Comment.create(comment, function (res){
            console.log(res)
        })
    },
    removeComment: function removeComment(id) {
        return Comment.remove({_id: id}).exec()
    }
}