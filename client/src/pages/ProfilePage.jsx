import {useState, useEffect} from "react"
 import {useParams} from "react-router-dom"
 import api from "../api/axios"


const ProfilePage = () =>{
    const {username} = userParams()
    const [user, setUser] = useState(null)

    useEffect(() =>{
        const fetchUser = async() =>{
            try{
            const response = await api.get(`/users/${username}`)
            setUser(response.data.user)
            }catch(error){
                console.log(error)
            }

        }
        fetchUser()

        
    }, [username])
    if(!user) 
      return <div className="text-center mt-20">Loading</div>



 return (
        <div className="min-h-screen bg-[#dae0e6] pt-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white border border-gray-300 rounded p-6 mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                            {user.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">u/{user.username}</h2>
                            <p className="text-gray-500 text-sm">{user.bio || "No bio yet"}</p>
                            <p className="text-orange-500 text-sm font-bold">{user.karma} karma</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProfilePage