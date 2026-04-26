import api from "../../api/axios"

const VoteButtons = ({ postId, voteScore, onVote }) => {

    const handleVote = async (type) => {
        try {
            const response = await api.put(`/posts/${postId}/vote`, { type })
            if (onVote) onVote(postId, response.data.voteScore)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <button
                onClick={() => handleVote("up")}
                className="text-gray-400 hover:text-orange-500 font-bold"
            >up</button>
            <span className="text-xs font-bold text-gray-700">{voteScore}</span>
            <button
                onClick={() => handleVote("down")}
                className="text-gray-400 hover:text-blue-500 font-bold"
            >down</button>
        </div>
    )
}

export default VoteButtons