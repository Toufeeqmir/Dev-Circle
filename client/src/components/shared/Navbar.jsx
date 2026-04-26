import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const Navbar = () => {
    const { user, isAuthenticated, handleLogout } = useAuth()

    return (
        <nav className="bg-black border-b border-gray-800 text-white px-6 py-3 flex justify-between items-center w-full">
            <Link to="/" className="text-orange-500 font-bold text-xl">DevCircle</Link>

            {isAuthenticated ? (
                          <div className="flex items-center gap-4">
    <Link to="/create-post" className="bg-orange-500 text-white text-sm px-4 py-1 rounded-full font-bold">+ Create Post</Link>
    <Link to={`/u/${user?.username}`} className="text-sm text-gray-300 hover:text-white">
        Welcome, {user?.username}
    </Link>
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">Logout</button>
</div>
            ) : (
                <div className="flex items-center gap-3">
                    <Link to="/login" className="text-white text-sm border border-orange-500 px-4 py-1 rounded-full">Login</Link>
                    <Link to="/register" className="bg-orange-500 text-white text-sm px-4 py-1 rounded-full font-bold">Register</Link>
                </div>
              
         
            )}

                 
    
        </nav>
    )
}

export default Navbar
