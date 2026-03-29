const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
    name: {
        type:String,
        unique: true,
        required: [true, "Please add your community name"]
    },

    description: {
        type: String,
        default: ""
    },

    icon: {
        type: String,
        default: ""
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
      banner: {
        type: String,
        default: ""
      },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    memberCount: {
        type: Number,
        default: 0
    },
    tags:[{
        type: String,
       
    }],
})

module.exports = mongoose.model("Community", communitySchema);