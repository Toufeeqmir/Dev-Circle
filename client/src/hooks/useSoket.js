import { useEffect , useRef} from "react"
import io from "socket.io-client"

import useAuth from "./useAuth"

//stores the socket connection withou causing re-renders.
 const useSocket =  () =>{
    const socketRef = useRef(null)
    const { user } = useAuth()


//  'useEffect runs when component mounts or when 'user' changes
    useEffect(() =>{
        socketRef.current = io("http://localhost:3000")

        if(user?._id){
            socketRef.current.emit("join", user._id)
        }
        return () =>{
            socketRef.current?.disconnect()
        }

    }, [user])

    return socketRef.current
}

export default useSocket