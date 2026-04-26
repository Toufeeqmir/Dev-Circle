import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import useAuth from "../hooks/useAuth"

const CreatePost = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [communityId, setCommunityId] = useState("")
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)

    const [communities, setCommunities] = useState([])
    const [communitiesLoading, setCommunitiesLoading] = useState(true)
    const [newCommunityName, setNewCommunityName] = useState("")
    const [newCommunityDesc, setNewCommunityDesc] = useState("")
    const [creatingCommunity, setCreatingCommunity] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { token } = useAuth()

    const loadCommunities = async () => {
        setCommunitiesLoading(true)
        setError("")
        try {
            const response = await api.get("/communities")
            const raw = response.data?.communities
            setCommunities(Array.isArray(raw) ? raw : [])
        } catch (err) {
            setCommunities([])
            setError(
                err.response?.data?.message ||
                    "Could not load communities. Is the server running?"
            )
        } finally {
            setCommunitiesLoading(false)
        }
    }

    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true, state: { from: "/create-post" } })
        }
    }, [token, navigate])

    useEffect(() => {
        if (!token) return
        loadCommunities()
    }, [token])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleCreateCommunity = async (e) => {
        e.preventDefault()
        const name = newCommunityName.trim()
        if (!name) {
            setError("Enter a community name")
            return
        }
        setCreatingCommunity(true)
        setError("")
        try {
            const res = await api.post("/communities", {
                name,
                description: newCommunityDesc.trim(),
            })
            setNewCommunityName("")
            setNewCommunityDesc("")
            await loadCommunities()
            const created = res.data?.community
            if (created?._id) {
                setCommunityId(String(created._id))
            }
        } catch (err) {
            setError(err.response?.data?.message || "Could not create community")
        } finally {
            setCreatingCommunity(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!token) {
            navigate("/login", { replace: true, state: { from: "/create-post" } })
            return
        }
        const id = communityId.trim()
        if (!id) {
            setError("Choose a community before posting.")
            return
        }
        try {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("content", content)
            formData.append("communityId", id)
            if (image) formData.append("image", image)
            const response = await api.post("/posts", formData)
            navigate(`/post/${response.data.post._id}`)
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                (err.response?.status === 401
                    ? "You must be logged in to post."
                    : "Something went wrong")
            setError(msg)
        }
    }

    if (!token) {
        return null
    }

    return (
        <div className="min-h-screen bg-[#dae0e6] pt-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white border border-gray-300 rounded p-6">
                    <h2 className="text-lg font-bold mb-4">Create a Post</h2>

                    {!communitiesLoading && communities.length === 0 && (
                        <div className="border rounded px-3 py-3 bg-gray-50 space-y-3 mb-6">
                            <p className="text-sm text-gray-600">
                                There are no communities yet. Create one to post:
                            </p>
                            <form
                                onSubmit={handleCreateCommunity}
                                className="flex flex-col gap-2"
                            >
                                <input
                                    type="text"
                                    placeholder="Community name (e.g. webdev)"
                                    value={newCommunityName}
                                    onChange={(e) => setNewCommunityName(e.target.value)}
                                    className="border rounded px-3 py-2 text-sm"
                                />
                                <textarea
                                    placeholder="Description (optional)"
                                    value={newCommunityDesc}
                                    onChange={(e) => setNewCommunityDesc(e.target.value)}
                                    className="border rounded px-3 py-2 text-sm resize-none h-20"
                                />
                                <button
                                    type="submit"
                                    disabled={creatingCommunity}
                                    className="self-start bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
                                >
                                    {creatingCommunity ? "Creating…" : "Create community"}
                                </button>
                            </form>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Community
                            </label>
                            {communitiesLoading ? (
                                <p className="text-sm text-gray-500">Loading communities…</p>
                            ) : communities.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    Create a community above, then choose it here.
                                </p>
                            ) : (
                                <select
                                    value={communityId}
                                    onChange={(e) => {
                                        setCommunityId(e.target.value)
                                        setError("")
                                    }}
                                    required
                                    className="border rounded px-3 py-2 text-sm w-full"
                                >
                                    <option value="">Choose a community</option>
                                    {communities.map((c) => (
                                        <option key={String(c._id)} value={String(c._id)}>
                                            r/{c.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border rounded px-3 py-2 text-sm"
                            required
                        />

                        <textarea
                            placeholder="What are your thoughts?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="border rounded px-3 py-2 text-sm resize-none h-32"
                            required
                        />

                        <div className="border rounded px-3 py-2">
                            <label className="text-sm text-gray-500 cursor-pointer">
                                + Add Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {preview && (
                            <img
                                src={preview}
                                alt="preview"
                                className="w-full h-48 object-cover rounded"
                            />
                        )}

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={communitiesLoading || communities.length === 0}
                            className="self-end bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Post
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreatePost
