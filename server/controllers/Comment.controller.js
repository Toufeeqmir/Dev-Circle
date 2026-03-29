const Comment = require("../models/Comment");
const Post = require("../models/Post");

const getComments = async (req, res) =>{
    try{
        const comments = await Comment.find({post: req.params.postId, parentComment: null}).populate("author", "username").sort({createdAt: -1});
        return res.status(200).json({success: true, comments});
    }
    catch(error){
        return res.status(500).json({message: "Failed to fetch comments", error: error.message});
    }
}

const createComment = async (req, res) =>{
    const {content , postId, parentComment} = req.body;
    
     try{
         const newComment = await Comment.create({
            content, 
            post: postId,
            author: req.user._id,
            parentComment: parentComment || null
  });
  await Post.findByIdAndUpdate(postId, {$inc: {commentCount: 1}});
            res.status(201).json({success: true, comment: newComment});
       
     }catch(error){
        res.status(500).json({message: "Faild to create the comment", error: error.message});
     }
    
}

module.exports = {
    getComments,
    createComment
}
