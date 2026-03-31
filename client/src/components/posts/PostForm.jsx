import { useState } from "react"
import api from "../../api/axios"

const PostForm = ({ communityId, onPostCreated }) => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post("/posts", {
                title,
                content,
                communityId
            })
            setTitle("")
            setContent("")
            if (onPostCreated) onPostCreated(response.data.post)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <div className="bg-white border border-gray-300 rounded p-4 mb-4">
            <h3 className="font-bold text-sm mb-3">Create Post</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
                    className="border rounded px-3 py-2 text-sm resize-none h-24"
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                    type="submit"
                    className="self-end bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold"
                >
                    Post
                </button>
            </form>
        </div>
    )
}

export default PostForm