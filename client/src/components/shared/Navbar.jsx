import {Link} from "react-router-dom"
import useAuth from "../../hooks/useAuth"
const Navbar = () =>{
    const {user, isAuthenticated, handleLogout} = useAuth()
     
    return <div >
<nav className="bg-black border-b border-gray-800 text-white px-6 py-4 flex justify-between items-center w-full">
            <Link to = "/">DevCircle</Link>
             
             {isAuthenticated ? (
                <div>
   <span>Welcome{user?.username}</span>
                <button onClick= {handleLogout}>Logout</button>

                </div>
             ):(
                <div>
                    <Link to = "/login">Login</Link>
                    <Link to = "/register">Register</Link>
                </div>
             )}
             
             
        </nav>
    </div>
}
export default Navbar