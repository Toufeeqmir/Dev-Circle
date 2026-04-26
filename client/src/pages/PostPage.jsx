import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import api from "../api/axios"
import useAuth from "../hooks/useAuth"

const PostPage = () =>{
     const { postId } = useParams()
     const navigate = useNavigate()
     const { isAuthenticated, user } = useAuth()
     const [post, setPost] = useState(null)
     const [comments, setComments] = useState([])
     const [newComment, setNewComment] = useState("")

     useEffect(() =>{
        const fetchPost = async () =>{
            const postRes = await api.get(`/posts/${postId}`)
            setPost(postRes.data.post)
            const commentRes = await api.get(`/comments/${postId}`)
            setComments(commentRes.data.comments)
        }
        fetchPost()
     }, [postId])

     const refreshComments = async () => {
        const commentRes = await api.get(`/comments/${postId}`)
        setComments(commentRes.data.comments)
     }

     const handleComment = async (event) =>{
        event.preventDefault()
        if (!newComment.trim()) {
            return
        }

        try{
            const response = await api.post("/comments", {
                content: newComment,
                postId
            })
            setComments((currentComments) => [response.data.comment, ...currentComments])
            setPost((currentPost) => ({
                ...currentPost,
                commentCount: (currentPost?.commentCount || 0) + 1
            }))
            setNewComment("")
        }catch(error){
            console.log(error)
        }
     }

     const handleDeleteComment = async (commentId) => {
        try {
            const response = await api.delete(`/comments/${commentId}`)
            const deletedCount = response.data.deletedCount || 1
            setComments((currentComments) =>
                currentComments.filter((comment) => comment._id !== commentId)
            )
            setPost((currentPost) => ({
                ...currentPost,
                commentCount: Math.max((currentPost?.commentCount || deletedCount) - deletedCount, 0)
            }))
        } catch (error) {
            console.log(error)
            if (error.response?.status === 404) {
                await refreshComments()
            }
        }
     }

     const handleDeletePost = async () => {
        try {
            await api.delete(`/posts/${postId}`)
            navigate("/")
        } catch (error) {
            console.log(error)
            if (error.response?.status === 404) {
                navigate("/")
            }
        }
     }

     const handleVote = async (type) => {
        try {
            const response = await api.put(`/posts/${postId}/vote`, { type })
            setPost((currentPost) => ({
                ...currentPost,
                voteScore: response.data.voteScore
            }))
        } catch (error) {
            console.log(error)
        }
     }

     const handleShare = async () => {
        const shareUrl = window.location.href

        try {
            if (navigator.share) {
                await navigator.share({
                    title: post.title,
                    text: post.content,
                    url: shareUrl
                })
                return
            }

            await navigator.clipboard.writeText(shareUrl)
            window.alert("Post link copied")
        } catch (error) {
            console.log(error)
        }
     }

     if(!post) {
        return <div className="text-center mt-20">Loading...</div>
     }

     const isOwner = String(user?._id) === String(post.author?._id || post.author)

    return (
        <div className="min-h-screen bg-[#dae0e6] pt-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white border border-gray-300 rounded mb-4 flex">
                    <div className="bg-gray-50 w-10 flex flex-col items-center py-2 gap-1 rounded-l">
                        <button
                            className="text-gray-400 hover:text-orange-500 font-bold"
                            type="button"
                            onClick={() => handleVote("up")}
                        >
                            up
                        </button>
                        <span className="text-xs font-bold">{post.voteScore}</span>
                        <button
                            className="text-gray-400 hover:text-blue-500 font-bold"
                            type="button"
                            onClick={() => handleVote("down")}
                        >
                            down
                        </button>
                    </div>
                    <div className="p-4 flex-1">
                        <div className="text-xs text-gray-500 mb-2 flex flex-wrap gap-1">
                            <span>Posted by</span>
                            <Link to={`/u/${post.author?.username}`} className="font-semibold text-gray-700 no-underline hover:underline">
                                u/{post.author?.username}
                            </Link>
                            {post.community && (
                                <>
                                    <span>in</span>
                                    <Link to={`/c/${post.community.name}`} className="font-semibold text-gray-700 no-underline hover:underline">
                                        r/{post.community.name}
                                    </Link>
                                </>
                            )}
                        </div>
                        <h2 className="text-xl font-bold">{post.title}</h2>
                        {post.image && (
                            <img
                                src={post.image}
                                alt="post"
                                className="w-full h-64 object-cover mt-3 rounded"
                            />
                        )}
                        <p className="text-gray-700 mt-2">{post.content}</p>

                        <div className="flex gap-4 mt-4 text-sm text-gray-500 flex-wrap">
                            <span>{post.commentCount} comments</span>
                            <button type="button" onClick={handleShare} className="hover:underline">
                                Share
                            </button>
                            {isOwner && (
                                <button type="button" onClick={handleDeletePost} className="text-red-500 hover:underline">
                                    Delete post
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {isAuthenticated && (
                    <div className="bg-white border border-gray-300 rounded p-4 mb-4">
                        <form onSubmit={handleComment} className="flex flex-col gap-2">
                            <textarea
                                value={newComment}
                                onChange={(event) => setNewComment(event.target.value)}
                                placeholder="Write a comment..."
                                className="border rounded p-2 text-sm resize-none h-20"
                            />
                            <button type="submit" className="self-end bg-orange-500 text-white px-4 py-1 rounded text-sm">
                                Comment
                            </button>
                        </form>
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    {comments.map((comment) => {
                        const isCommentOwner = String(user?._id) === String(comment.author?._id || comment.author)

                        return (
                            <div key={comment._id} className="bg-white border border-gray-300 rounded p-4">
                                <div className="flex items-center justify-between gap-3 mb-1">
                                    <Link to={`/u/${comment.author?.username}`} className="text-xs font-semibold text-gray-700 no-underline hover:underline">
                                        u/{comment.author?.username}
                                    </Link>
                                    {isCommentOwner && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="text-xs text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm text-gray-800">{comment.content}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default PostPage
