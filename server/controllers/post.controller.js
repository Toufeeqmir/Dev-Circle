const mongoose = require("mongoose");
const Post = require("../models/Post");
const Community = require("../models/Community");
const Comment = require("../models/Comment");
const {uploadImage} = require("../utils/cloudinary");
const getPosts = async (req, res) => {
    try {
        const filter = {};

        if (req.query.community && mongoose.Types.ObjectId.isValid(req.query.community)) {
            filter.community = req.query.community;
        }

        const posts = await Post.find(filter)
            .populate("author","username avatar")
            .populate("community", "name")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts", error: error.message });
    }

}
const createPost = async (req, res) => {
    const { title, content } = req.body
    const communityId = typeof req.body.communityId === "string" ? req.body.communityId.trim() : ""
    try {
        if (!communityId || !mongoose.Types.ObjectId.isValid(communityId)) {
            return res.status(400).json({ message: "Please select a community" })
        }
        const community = await Community.findById(communityId)
        if (!community) {
            return res.status(400).json({ message: "Community not found" })
        }

        let imageUrl = ""

        if (req.file) {
            imageUrl = await uploadImage(req.file.buffer)
        }
        const newPost = new Post({
            title,
            content,
            author: req.user._id,
            community: communityId,
            image: imageUrl
        })

        await newPost.save()
        const populatedPost = await Post.findById(newPost._id)
            .populate("author", "username avatar")
            .populate("community", "name")
        res.status(201).json({ success: true, post: populatedPost })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const votePost = async (req, res) => {
    try {
        const { type } = req.body;

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // remove user from both  first

        post.upvotes.pull(req.user._id);
        post.downvotes.pull(req.user._id);

        if (type === "up") {
            post.upvotes.push(req.user._id);

        }
        else if (type === "down") {
            post.downvotes.push(req.user._id);
        }

        post.voteScore = post.upvotes.length - post.downvotes.length;

        await post.save();
        res.status(200).json({ success: true, voteScore: post.voteScore });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to vote on post", error: error.message });
    }
}
     const getPostById = async (req, res) =>{
         try{
            const post = await Post.findById(req.params.id)
            .populate("author", "username avatar")
            .populate("community" , "name")

            if(!post) return res.status(404).json({message:"Post not found"})
                res.json({success: true, post})
         }
         catch(error){
            res.status(500).json({message: error.message})
         }
     }

const deletePost = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid post id",
                postId: req.params.id
            });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                postId: req.params.id
            });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed to delete this post" });
        }

        await Comment.deleteMany({ post: post._id });
        await post.deleteOne();

        return res.status(200).json({ success: true, message: "Post deleted" });
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to delete post", error: error.message });
    }
}

module.exports = {
    getPosts,
    createPost,
    votePost,
    getPostById ,
    deletePost
}
