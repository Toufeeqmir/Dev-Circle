import { Link } from "react-router-dom"
import api from "../../api/axios"

const PostCard = ({ post, onVote }) => {

    const handleVote = async (type) => {
        try {
            const response = await api.put(`/posts/${post._id}/vote`, { type })
            if (onVote) onVote(post._id, response.data.voteScore)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Link to={`/post/${post._id}`} className="no-underline">
            <div className="bg-white border border-gray-300 rounded hover:border-gray-500 cursor-pointer flex">
                {/* Vote column */}
                <div className="bg-gray-50 w-10 flex flex-col items-center py-2 gap-1 rounded-l">
                    <button
                        onClick={(e) => { e.preventDefault(); handleVote("up") }}
                        className="text-gray-400 hover:text-orange-500 font-bold"
                    >▲</button>
                    <span className="text-xs font-bold text-gray-700">{post.voteScore}</span>
                    <button
                        onClick={(e) => { e.preventDefault(); handleVote("down") }}
                        className="text-gray-400 hover:text-blue-500 font-bold"
                    >▼</button>
                </div>

                {/* Content */}
                <div className="p-3 flex-1">
                    <div className="text-xs text-gray-500 mb-1">
                        {post.community && (
                            <span className="font-bold text-black">r/{post.community.name} • </span>
                        )}
                        <span>Posted by u/{post.author?.username}</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-700 mt-1">{post.content}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>💬 {post.commentCount} Comments</span>
                        <span>🔗 Share</span>
                        <span>⭐ Save</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PostCard