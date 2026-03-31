import {useState} from "react"
import {Link , useNavigate} from "react-router-dom"
import {useDispatch} from "react-redux"
import {setCredentials} from "../store/authSlice"
import api from "../api/axios"





const Login = () =>{
    

        const [email, setEmail] = useState("")
        const [password , setPassword] = useState("")
        const [error, setError] = useState("")
        const dispatch = useDispatch()

        const navigate = useNavigate()

        const handleSubmit = async(e)=>{
            e.preventDefault()
           try{
            const response = await api.post("/auth/login", {email , password})
            console.log(response.data)
              dispatch(setCredentials({
                  user: response.data.user,
                token: response.data.token
              }))
          navigate("/")

           }
           catch(error){
            setError(error.response.data.message)
           }
            

        }
       return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
                type="email"
                placeholder="Email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="border px-4 py-2 rounded"
            />
            <input 
                type="password"
                placeholder="Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="border px-4 py-2 rounded"
            />
            {error && <p className="text-red-500">{error}</p> }
             
            <button type="submit" className="bg-blue-500 text-white py-2 rounded">Login</button>
        </form>
        <p className="mt-4">Don't have an account? <Link to="/register" className="text-blue-500">Register</Link></p>
    </div>
)
}
export default Login