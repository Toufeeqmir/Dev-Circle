import { useState } from "react"
import api from "../../api/axios"

const CommentForm = ({ postId, onCommentAdded }) => {
    const [content, setContent] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post("/comments", { content, postId })
            setContent("")
            if (onCommentAdded) onCommentAdded(response.data.comment)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="bg-white border border-gray-300 rounded p-4 mb-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="border rounded p-2 text-sm resize-none h-20"
                />
                <button
                    type="submit"
                    className="self-end bg-orange-500 text-white px-4 py-1 rounded text-sm font-bold"
                >
                    Comment
                </button>
            </form>
        </div>
    )
}

export default CommentForm