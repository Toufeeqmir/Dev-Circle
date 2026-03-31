import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

const CreatePost = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [communityId, setCommunityId] = useState("")
    const [communities, setCommunities] = useState([])
    const [error, setError] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCommunities = async () => {
            const response = await api.get("/communities")
            setCommunities(response.data.communities)
        }
        fetchCommunities()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post("/posts", { title, content, communityId })
            navigate(`/post/${response.data.post._id}`)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <div className="min-h-screen bg-[#dae0e6] pt-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white border border-gray-300 rounded p-6">
                    <h2 className="text-lg font-bold mb-4">Create a Post</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <select
                            value={communityId}
                            onChange={(e) => setCommunityId(e.target.value)}
                            className="border rounded px-3 py-2 text-sm"
                        >
                            <option value="">Choose a community</option>
                            {communities.map((c) => (
                                <option key={c._id} value={c._id}>r/{c.name}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border rounded px-3 py-2 text-sm"
                        />
                        <textarea
                            placeholder="What are your thoughts?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="border rounded px-3 py-2 text-sm resize-none h-32"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="self-end bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold"
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