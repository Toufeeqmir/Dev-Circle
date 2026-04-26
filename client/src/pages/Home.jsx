import { useState, useEffect } from "react"
import api from "../api/axios"
import Sidebar from "../components/shared/Sidebar"
import PostCard from "../components/posts/PostCard"

const Home = () => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await api.get("/posts")
            setPosts(response.data.posts)
        }
        fetchPosts()
    }, [])

    const handleVote = (postId, voteScore) => {
        setPosts((currentPosts) =>
            currentPosts.map((post) =>
                post._id === postId ? { ...post, voteScore } : post
            )
        )
    }

    const handleDelete = (postId) => {
        setPosts((currentPosts) =>
            currentPosts.filter((post) => post._id !== postId)
        )
    }

    return (
        <div className="min-h-screen bg-[#dae0e6] pt-4">
            <div className="max-w-4xl mx-auto px-4 flex gap-4">
                <div className="flex-1 flex flex-col gap-2">
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onVote={handleVote}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                <Sidebar />
            </div>
        </div>
    )
}

export default Home
