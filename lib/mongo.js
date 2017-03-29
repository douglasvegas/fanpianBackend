var config = require('config-lite')
var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = global.Promise
mongoose.connect(config.mongodb)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('MongoDB Opened!');
});

//栏目
var categorySchema = new mongoose.Schema({
    name: String,
    categoryId: Number
},{
    versionKey: false
})

var Category = mongoose.model('Category',categorySchema);

exports.Category = Category;

//用户信息
var UserSchema = new mongoose.Schema({
    name: { type: String, index: {unique: true, dropDups: true}},
    password: String,
    email: { type: String, index: {unique: true, dropDups: true}},
    gender: String,
    age  : Number,
    avatar: String,
    follower: { type:Number, default:0}, 
    following: { type:Number, default:0}, 
    keep:{ type:Number, default:0}, 
    like:{ type:Number, default:0}, 
    create_date: {type: Date, default: Date.now}
},{
    versionKey: false 
});
// UserSchema.index({name: 1,unique: true, index: true})
var User = mongoose.model("User",UserSchema)

exports.User = User;

//文章
var PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId},
    title: String,
    content: String,
    imgUrl: String,
    pv: { type:Number, default:0}, 
    like: { type:Number, default:0}, 
    keep:  { type:Number, default:0}, 
    comments: { type:Number, default:0}, 
    cateId: { type:Number, ref:'Category'},
    type:  Number,
    create_date: { type: Date, default: Date.now }
},{
    versionKey: false 
})

var Post = mongoose.model('Post', PostSchema)

exports.Post = Post;

//评论
var CommentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId},
    content: String,
    postId: { type: mongoose.Schema.Types.ObjectId}
},
{
    versionKey: false 
})
var Comment = mongoose.model('Comment',CommentSchema)

exports.Comment = Comment;
// exports.mongoose = mongoose;

//关注
var FollowSchema= new mongoose.Schema({
    user : { type: mongoose.Schema.Types.ObjectId },
    following : { type: mongoose.Schema.Types.ObjectId }
},
{
    versionKey: false 
})

var Follow = mongoose.model('Follow', FollowSchema);
exports.Follow = Follow;

//点赞
var LikeSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId },
    userId: { type: mongoose.Schema.Types.ObjectId },
},
{
    versionKey: false 
})

var Like = mongoose.model('Like', LikeSchema);
exports.Like = Like;

//收藏
var KeepSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId },
    userId: { type: mongoose.Schema.Types.ObjectId },
})

var Keep = mongoose.model('Keep', KeepSchema)
exports.Keep = Keep;




