const CommentList = ({ comments }) => {
    return (
        <div className="flex flex-col gap-2">
            {comments.length === 0 ? (
                <div className="bg-white border border-gray-300 rounded p-4 text-center text-gray-500 text-sm">
                    No comments yet — be the first to comment!
                </div>
            ) : (
                comments.map((comment) => (
                    <div key={comment._id} className="bg-white border border-gray-300 rounded p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">
                                {comment.author?.username?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-xs font-bold">u/{comment.author?.username}</span>
                        </div>
                        <p className="text-sm text-gray-800">{comment.content}</p>
                    </div>
                ))
            )}
        </div>
    )
}

export default CommentList