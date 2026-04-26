const Comment = require("../models/Comment");
const Post = require("../models/Post");

const getComments = async (req, res) =>{
    try{
        const comments = await Comment.find({post: req.params.postId, parentComment: null}).populate("author", "username avatar").sort({createdAt: -1});
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
            const populatedComment = await Comment.findById(newComment._id).populate("author", "username avatar");
            res.status(201).json({success: true, comment: populatedComment});
       
     }catch(error){
        res.status(500).json({message: "Faild to create the comment", error: error.message});
     }
    
}

const deleteComment = async (req, res) =>{
    try{
        if (!req.params.id) {
            return res.status(400).json({message: "Comment id is required"});
        }

        const comment = await Comment.findById(req.params.id);
        if(!comment){
            return res.status(404).json({
                message: "Comment not found",
                commentId: req.params.id
            });
        }

        if(comment.author.toString() !== req.user._id.toString()){
            return res.status(403).json({message: "Not allowed to delete this comment"});
        }

        const deleteResult = await Comment.deleteMany({
            $or: [
                { _id: comment._id },
                { parentComment: comment._id }
            ]
        });
        await Post.findByIdAndUpdate(comment.post, {
            $inc: { commentCount: -Math.max(deleteResult.deletedCount || 1, 1) }
        });

        return res.status(200).json({
            success: true,
            message: "Comment deleted",
            deletedCount: deleteResult.deletedCount || 1
        });
    }
    catch(error){
        return res.status(500).json({message: "Failed to delete comment", error: error.message});
    }
}

module.exports = {
    getComments,
    createComment,
    deleteComment
}
