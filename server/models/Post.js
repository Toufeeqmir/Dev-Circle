const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Please add a title for your post"]
    },

    content:{
        type: String,
        required: [true, "Please add content for your post"]
    },

    image: {
        type: String,
        default: ""
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"

    },
    upvotes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
}],

    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    voteScore: {
        type: Number,
        default: 0
    },

    commentCount: {
        type: Number,
        default: 0
    },

    tags:[{
        type: String,
    }]



})

PostSchema.index({title: "text", content: "text"});

module.exports = mongoose.model("Post", PostSchema);