const mongoose= require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "please add a username"],
    },

    email: {
        type: String,
        required: [true, "please add an email"],
        unique: true,
        lowercase: true
    },

    avatar: {
        type : String,
        default: ""
    },

    bio: {
        type : String,
        default: ""
    },
    karma : {
        type: Number ,
        default: 0
    },

    communities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"
    }],
    password: { type: String, required: true, minlength: 6 }

});
UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password  = await bcrypt.hash(this.password, salt);
    // next();
});

UserSchema.methods.matchPassword = async function (enterPassword){
    return await bcrypt.compare(enterPassword, this.password);

};
module.exports = mongoose.model("User", UserSchema);