var config = require('config-lite')
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(config.mongodb)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('MongoDB Opened!');
});
//用户信息
var UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    phone: Number,
    gender: String,
    age  : Number,
    avatar: String,
    create_date: {type: Date, default: Date.now}
})
var User = mongoose.model("User",UserSchema)

exports.User = User;

//文章
var PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId},
    title: String,
    content: String,
    imgUrl: String,
    pv: Number,
    create_date: { type: Date, default: Date.now }
})

var Post = mongoose.model('Post', PostSchema)

exports.Post = Post;

//评论
var CommentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId},
    content: String,
    postId: { type: mongoose.Schema.Types.ObjectId}
})
var Comment = mongoose.model('Comment',CommentSchema)

exports.Comment = Comment;
// exports.mongoose = mongoose;

//关注
var FollowSchema= new mongoose.Schema({
    user : { type: mongoose.Schema.Types.ObjectId },
    following : { type: mongoose.Schema.Types.ObjectId }
})

var Follow = mongoose.model('Follow', FollowSchema)

exports.Follow = Follow;


