import { useState, useEffect } from "react"
import api from "../api/axios"
import { Link } from "react-router-dom"
import Sidebar from "../components/shared/Sidebar"

const Home = () => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await api.get("/posts")
            setPosts(response.data.posts)
        }
        fetchPosts()
    }, [])

    const handleVote = async (postId, type) => {
        try {
            const response = await api.put(`/posts/${postId}/vote`, { type })
            setPosts(posts.map((post) =>
                post._id === postId
                    ? { ...post, voteScore: response.data.voteScore }
                    : post
            ))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-h-screen bg-[#dae0e6] pt-4">
            <div className="max-w-4xl mx-auto px-4 flex gap-4">
                
                {/* Posts feed */}
                <div className="flex-1 flex flex-col gap-2">
                    {posts.map((post) => (
                        <Link to={`/post/${post._id}`} key={post._id} className="no-underline">
                            <div className="bg-white border border-gray-300 rounded hover:border-gray-500 cursor-pointer flex">

                                {/* Vote column */}
                                <div className="bg-gray-50 w-10 flex flex-col items-center py-2 gap-1 rounded-l">
                                    <button onClick={(e) => { e.preventDefault(); handleVote(post._id, "up") }}>▲</button>
                                    <span className="text-xs font-bold text-gray-700">{post.voteScore}</span>
                                    <button onClick={(e) => { e.preventDefault(); handleVote(post._id, "down") }}>▼</button>
                                </div>

                                {/* Content */}
                                <div className="p-2 flex-1">
                                    <div className="text-xs text-gray-500 mb-1">
                                        {post.community && <span className="font-bold text-black">r/{post.community.name} • </span>}
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
                    ))}
                </div>

                {/* Sidebar */}
                <Sidebar />
            </div>
        </div>
    )
}

export default Home