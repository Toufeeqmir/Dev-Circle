import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"
import useAuth from "../hooks/useAuth"
import { Link } from "react-router-dom"

const CommunityPage = () => {
    const { communityName } = useParams()
    const { isAuthenticated } = useAuth()
    const [community, setCommunity] = useState(null)
    const [posts, setPosts] = useState([])
    const [joined, setJoined] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const commRes = await api.get("/communities")
                const found = commRes.data.communities.find(
                    (c) => c.name === communityName
                )
                setCommunity(found)

                const postRes = await api.get(`/posts?community=${found._id}`)
                setPosts(postRes.data.posts)
                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        fetchCommunity()
    }, [communityName])

    const handleJoin = async () => {
        try {
            await api.put(`/communities/${community._id}/join`)
            setJoined(!joined)
            setCommunity({
                ...community,
                memberCount: joined
                    ? community.memberCount - 1
                    : community.memberCount + 1
            })
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) return <div className="text-center mt-20">Loading...</div>
    if (!community) return <div className="text-center mt-20">Community not found</div>

    return (
        <div className="min-h-screen bg-[#dae0e6]">
            {/* Banner */}
            <div className="bg-orange-500 h-20"></div>

            {/* Community header */}
            <div className="bg-white border-b border-gray-300 px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-orange-500 border-4 border-white -mt-6 flex items-center justify-center text-white text-2xl font-bold">
                        {community.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">r/{community.name}</h1>
                        <p className="text-gray-500 text-sm">{community.memberCount} members</p>
                    </div>
                    {isAuthenticated && (
                        <button
                            onClick={handleJoin}
                            className={`px-6 py-1 rounded-full font-bold text-sm ${
                                joined
                                    ? "border border-gray-400 text-gray-700"
                                    : "bg-orange-500 text-white"
                            }`}
                        >
                            {joined ? "Joined" : "Join"}
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto pt-4 px-4 flex gap-4">
                {/* Posts */}
                <div className="flex-1 flex flex-col gap-2">
                    {posts.length === 0 ? (
                        <div className="bg-white border border-gray-300 rounded p-6 text-center text-gray-500">
                            No posts yet in this community
                        </div>
                    ) : (
                        posts.map((post) => (
                            <Link to={`/post/${post._id}`} key={post._id} className="no-underline">
                                <div className="bg-white border border-gray-300 rounded hover:border-gray-500 cursor-pointer flex">
                                    <div className="bg-gray-50 w-10 flex flex-col items-center py-2 gap-1 rounded-l">
                                        <button className="text-gray-400 hover:text-orange-500 font-bold">▲</button>
                                        <span className="text-xs font-bold text-gray-700">{post.voteScore}</span>
                                        <button className="text-gray-400 hover:text-blue-500 font-bold">▼</button>
                                    </div>
                                    <div className="p-3 flex-1">
                                        <div className="text-xs text-gray-500 mb-1">
                                            Posted by u/{post.author?.username}
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">{post.title}</h3>
                                        <p className="text-sm text-gray-700 mt-1">{post.content}</p>
                                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                            <span>💬 {post.commentCount} Comments</span>
                                            <span>🔗 Share</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-72 hidden md:block">
                    <div className="bg-white border border-gray-300 rounded p-4">
                        <h2 className="font-bold text-sm mb-2">About r/{community.name}</h2>
                        <p className="text-sm text-gray-600">{community.description || "No description yet"}</p>
                        <div className="border-t mt-3 pt-3">
                            <p className="text-sm"><span className="font-bold">{community.memberCount}</span> Members</p>
                        </div>
                        {isAuthenticated && (
                            <button
                                onClick={handleJoin}
                                className={`w-full mt-3 py-1 rounded-full font-bold text-sm ${
                                    joined
                                        ? "border border-gray-400 text-gray-700"
                                        : "bg-orange-500 text-white"
                                }`}
                            >
                                {joined ? "Joined" : "Join"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommunityPage