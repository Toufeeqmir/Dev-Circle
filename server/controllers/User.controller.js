const User = require("../models/User")
const { uploadImage } = require("../utils/cloudinary")
const Post = require("../models/Post");

const getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select("-password")
            .populate("communities", "name memberCount")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        //get user's posts
        const posts = await Post.find({author: user._id})
        .populate("community", "name")
        .sort({createdAt: -1});
        res.status(200).json({ success: true, user, posts })
    } catch (error) {
        res.status(500).json({ message: "Failed to find the user", error: error.message })
    }
}

const updateProfile = async (req, res) => {
    const { bio, avatar } = req.body
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { bio, avatar },
            { new: true }
        ).select("-password")
        return res.status(200).json({ success: true, user: updatedUser, message: "updated user" })
    } catch (error) {
        res.status(500).json({ message: "not updated" })
    }
}

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image provided" })
        }
        const imageUrl = await uploadImage(req.file.buffer)
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: imageUrl },
            { new: true }
        ).select("-password")
        res.json({ success: true, user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getProfile,
    updateProfile,
    uploadAvatar
}
