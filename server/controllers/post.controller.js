const Post = require("../models/Post");

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "username").populate("community", "name").sort({ createdAt: -1 });
        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts", error: error.message });
    }

}
const createPost = async (req, res) => {
    const { title, content, communityId } = req.body;
    try {
        const newPost = new Post({
            title,
            content,
            author: req.user._id,
            community: communityId
        });
        await newPost.save();
        res.status(201).json({ success: true, post: newPost });
    } catch (error) {
        res.status(500).json({ message: "Failed to create post", error: error.message });
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


module.exports = {
    getPosts,
    createPost,
    votePost,
    getPostById 
}
