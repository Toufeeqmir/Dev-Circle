import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import api from "../api/axios"
import useAuth from "../hooks/useAuth"


const PostPage = () =>{
     const {postId} = useParams()
     const {isAuthenticated} = useAuth()
     const [post, setPost] = useState(null)
     const [comments, setComments] = useState([])
     const [newComment , setNewComment] = useState("")


     useEffect(() =>{
        const fetchPost = async () =>{
            const postRes = await api.get(`/post/${postId}`)
             setPost(postRes.data.post)
             const commentRes = await api.get(`/comments/${postId}`)
             setComments(commentRes.data.comments)

        }
        fetchPost()

     }, [postId])

     const handleComment = async (e) =>{
        e.preventDefault() 
        try{
            const response = await api.post ("/comments", {
                content: newComment,
                postId
            })
            setComments([response.data.comment, ...comments])
            setNewComment("")

        }catch(error){
            console.log(error)
        }
     }
     if(!post) 
        return  <div className="text-cener mt-20">Loading...</div>


    return (
        <div className="min-h-screen bg-[#dae0e6] pt-4">
            <div className="max-w-2xl mx-auto">
                {/* Post */}
                <div className="bg-white border border-gray-300 rounded mb-4 flex">
                    <div className="bg-gray-50 w-10 flex flex-col items-center py-2 gap-1 rounded-l">
                        <button className="text-gray-400 hover:text-orange-500 font-bold">▲</button>
                        <span className="text-xs font-bold">{post.voteScore}</span>
                        <button className="text-gray-400 hover:text-blue-500 font-bold">▼</button>
                    </div>
                    <div className="p-4 flex-1">
                        <div className="text-xs text-gray-500 mb-2">
                            Posted by u/{post.author?.username}
                        </div>
                        <h2 className="text-xl font-bold">{post.title}</h2>
                        <p className="text-gray-700 mt-2">{post.content}</p>
                    </div>
                </div>

                {/* Comment form */}
                {isAuthenticated && (
                    <div className="bg-white border border-gray-300 rounded p-4 mb-4">
                        <form onSubmit={handleComment} className="flex flex-col gap-2">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="border rounded p-2 text-sm resize-none h-20"
                            />
                            <button type="submit" className="self-end bg-orange-500 text-white px-4 py-1 rounded text-sm">
                                Comment
                            </button>
                        </form>
                    </div>
                )}

                {/* Comments */}
                <div className="flex flex-col gap-2">
                    {comments.map((comment) => (
                        <div key={comment._id} className="bg-white border border-gray-300 rounded p-4">
                            <div className="text-xs text-gray-500 mb-1">
                                u/{comment.author?.username}
                            </div>
                            <p className="text-sm text-gray-800">{comment.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}
export default PostPage