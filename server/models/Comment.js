const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required:[true, "Please add content for your comment"]
    },

    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post" 
    },

    parentComment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },

    upvotes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    }],
    downvotes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    }],

    voteScore: {
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model("Comment", CommentSchema);  