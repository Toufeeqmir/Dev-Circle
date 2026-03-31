import useAuth from "../../hooks/useAuth"

const CommunityHeader = ({ community, joined, onJoin }) => {
    const { isAuthenticated } = useAuth()

    return (
        <div>
            <div className="bg-orange-500 h-20"></div>
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
                            onClick={onJoin}
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
        </div>
    )
}

export default CommunityHeader
