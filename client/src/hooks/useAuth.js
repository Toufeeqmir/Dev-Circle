import { useEffect } from "react"
import { useSelector, useDispatch} from "react-redux"
import { logout } from "../store/authSlice"



 const useAuth = () =>{
    const dispatch = useDispatch()
    const {user , token} = useSelector((state) => state.auth)

    useEffect(() => {
        const handleUnauthorized = () => {
            dispatch(logout())
        }

        window.addEventListener("auth:logout", handleUnauthorized)
        return () => window.removeEventListener("auth:logout", handleUnauthorized)
    }, [dispatch])

    const handleLogout = () =>{
          dispatch(logout())
    }

    return {user, token , isAuthenticated: !!token , handleLogout}

}

export default useAuth
