import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios"
import useAuth from "../hooks/useAuth"
import PostCard from "../components/posts/PostCard"

const CommunityPage = () => {
    const { communityName } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated, user } = useAuth()
    const [community, setCommunity] = useState(null)
    const [posts, setPosts] = useState([])
    const [joined, setJoined] = useState(false)
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const commRes = await api.get("/communities")
                const found = commRes.data.communities.find(
                    (currentCommunity) => currentCommunity.name === communityName
                )

                setCommunity(found)
                setJoined(
                    Boolean(
                        found?.members?.some(
                            (memberId) => String(memberId) === String(user?._id)
                        )
                    )
                )

                if (found?._id) {
                    const postRes = await api.get(`/posts?community=${found._id}`)
                    setPosts(postRes.data.posts)
                } else {
                    setPosts([])
                }

                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        fetchCommunity()
    }, [communityName, user?._id])

    const handleJoin = async () => {
        if (!isAuthenticated) {
            navigate("/login")
            return
        }

        try {
            setErrorMessage("")
            const response = await api.put(`/communities/${community._id}/join`)
            setJoined(response.data.joined)
            setCommunity((currentCommunity) => ({
                ...currentCommunity,
                memberCount: response.data.memberCount,
                members: response.data.community.members
            }))
        } catch (error) {
            console.log(error)
            setErrorMessage(
                error.response?.status === 401
                    ? "Please log in again to join this community."
                    : error.response?.data?.message || "Could not update community membership."
            )
        }
    }

    if (loading) return <div className="text-center mt-20">Loading...</div>
    if (!community) return <div className="text-center mt-20">Community not found</div>

    return (
        <div className="min-h-screen bg-[#dae0e6]">
            <div className="bg-orange-500 h-20"></div>

            <div className="bg-white border-b border-gray-300 px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-orange-500 border-4 border-white -mt-6 flex items-center justify-center text-white text-2xl font-bold">
                        {community.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">r/{community.name}</h1>
                        <p className="text-gray-500 text-sm">{community.memberCount} members</p>
                        {errorMessage && (
                            <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                        )}
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

            <div className="max-w-4xl mx-auto pt-4 px-4 flex gap-4">
                <div className="flex-1 flex flex-col gap-2">
                    {posts.length === 0 ? (
                        <div className="bg-white border border-gray-300 rounded p-6 text-center text-gray-500">
                            No posts yet in this community
                        </div>
                    ) : (
                        posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onVote={(postId, voteScore) => {
                                    setPosts((currentPosts) =>
                                        currentPosts.map((currentPost) =>
                                            currentPost._id === postId
                                                ? { ...currentPost, voteScore }
                                                : currentPost
                                        )
                                    )
                                }}
                                onDelete={(postId) => {
                                    setPosts((currentPosts) =>
                                        currentPosts.filter((post) => post._id !== postId)
                                    )
                                }}
                            />
                        ))
                    )}
                </div>

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
