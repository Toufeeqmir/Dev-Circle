import { Link } from "react-router-dom"

const CommunityCard = ({ community }) => {
    return (
        <Link to={`/c/${community.name}`} className="no-underline">
            <div className="bg-white border border-gray-300 rounded p-3 hover:border-gray-500 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                    {community.name?.[0]?.toUpperCase()}
                </div>
                <div>
                    <p className="font-bold text-sm">r/{community.name}</p>
                    <p className="text-xs text-gray-500">{community.memberCount} members</p>
                </div>
            </div>
        </Link>
    )
}

export default CommunityCard