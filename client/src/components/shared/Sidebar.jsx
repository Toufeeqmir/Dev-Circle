import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../../api/axios"

const Sidebar = () => {
    const [communities, setCommunities] = useState([])

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const response = await api.get("/communities")
                setCommunities(response.data.communities)
            } catch (error) {
                console.log(error)
            }
        }
        fetchCommunities()
    }, [])

    return (
        <div className="w-72 hidden md:block">
            <div className="bg-white border border-gray-300 rounded p-4">
                <h2 className="font-bold text-sm mb-3">Top Communities</h2>
                <div className="flex flex-col gap-2">
                    {communities.map((community) => (
                        <Link
                            key={community._id}
                            to={`/c/${community.name}`}
                            className="flex items-center gap-2 text-sm hover:bg-gray-50 p-1 rounded"
                        >
                            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                                {community.name?.[0]?.toUpperCase()}
                            </div>
                            <span>r/{community.name}</span>
                            <span className="text-gray-400 text-xs ml-auto">{community.memberCount} members</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Sidebar