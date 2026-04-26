import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../api/axios"
import useAuth from "../hooks/useAuth"

const ProfilePage = () => {
    const { username } = useParams()
    const { user: loggedInUser } = useAuth()
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [activeTab, setActiveTab] = useState("posts")

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${username}`)
                setUser(response.data.user)
                setPosts(response.data.posts || [])
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    }, [username])

    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) {
            return
        }

        const formData = new FormData()
        formData.append("avatar", file)
        try {
            const response = await api.put("/users/profile/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            setUser((currentUser) => ({
                ...response.data.user,
                communities: currentUser?.communities || []
            }))
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeletePost = async (postId) => {
        try {
            await api.delete(`/posts/${postId}`)
            setPosts((currentPosts) =>
                currentPosts.filter((post) => post._id !== postId)
            )
        } catch (error) {
            console.log(error)
            if (error.response?.status === 404) {
                setPosts((currentPosts) =>
                    currentPosts.filter((post) => post._id !== postId)
                )
            }
        }
    }

    if (!user) return <div className="text-center mt-20">Loading...</div>

    const isOwnProfile = loggedInUser?.username === username

    return (
        <div className="min-h-screen bg-[#dae0e6] pt-6">
            <div className="max-w-4xl mx-auto px-4 flex gap-4">
                <div className="flex-1">
                    <div className="bg-white border border-gray-300 rounded mb-4">
                        <div className="flex border-b border-gray-300">
                            <button
                                onClick={() => setActiveTab("posts")}
                                className={`px-6 py-3 text-sm font-bold ${activeTab === "posts" ? "border-b-2 border-orange-500 text-orange-500" : "text-gray-500"}`}
                            >
                                Posts
                            </button>
                            <button
                                onClick={() => setActiveTab("communities")}
                                className={`px-6 py-3 text-sm font-bold ${activeTab === "communities" ? "border-b-2 border-orange-500 text-orange-500" : "text-gray-500"}`}
                            >
                                Communities
                            </button>
                        </div>

                        {activeTab === "posts" && (
                            <div className="flex flex-col">
                                {posts.length === 0 ? (
                                    <div className="p-6 text-center text-gray-500 text-sm">
                                        No posts yet
                                    </div>
                                ) : (
                                    posts.map((post) => (
                                        <div
                                            key={post._id}
                                            className="border-b border-gray-200 p-4 hover:bg-gray-50"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <Link
                                                    to={`/post/${post._id}`}
                                                    className="no-underline flex-1"
                                                >
                                                    <div className="text-xs text-gray-500 mb-1">
                                                        {post.community && (
                                                            <span className="font-bold text-black">
                                                                r/{post.community.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {post.content?.slice(0, 100)}
                                                    </p>
                                                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                                                        <span>{post.voteScore} votes</span>
                                                        <span>{post.commentCount} comments</span>
                                                    </div>
                                                </Link>
                                                {isOwnProfile && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeletePost(post._id)}
                                                        className="text-xs text-red-500 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === "communities" && (
                            <div className="flex flex-col">
                                {user.communities?.length === 0 ? (
                                    <div className="p-6 text-center text-gray-500 text-sm">
                                        No communities joined yet
                                    </div>
                                ) : (
                                    user.communities?.map((community) => (
                                        <Link
                                            to={`/c/${community.name}`}
                                            key={community._id}
                                            className="border-b border-gray-200 p-4 hover:bg-gray-50 no-underline flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                                                {community.name?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">r/{community.name}</p>
                                                <p className="text-xs text-gray-500">{community.memberCount} members</p>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-72">
                    <div className="bg-white border border-gray-300 rounded p-4">
                        <div className="flex flex-col items-center mb-4">
                            <label className={isOwnProfile ? "cursor-pointer" : ""}>
                                <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                                    {user.avatar
                                        ? <img src={user.avatar} className="w-20 h-20 rounded-full object-cover" alt="avatar" />
                                        : user.username?.[0]?.toUpperCase()
                                    }
                                </div>
                                {isOwnProfile && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                    />
                                )}
                            </label>
                            {isOwnProfile && (
                                <p className="text-xs text-gray-400 mt-1">Click to change photo</p>
                            )}
                        </div>

                        <h2 className="text-lg font-bold text-center">u/{user.username}</h2>
                        <p className="text-sm text-gray-500 text-center mt-1">{user.bio || "No bio yet"}</p>

                        <div className="border-t border-gray-200 mt-4 pt-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Karma</span>
                                <span className="font-bold text-orange-500">{user.karma}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Posts</span>
                                <span className="font-bold">{posts.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Communities</span>
                                <span className="font-bold">{user.communities?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
