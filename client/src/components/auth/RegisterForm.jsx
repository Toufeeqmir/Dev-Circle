import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setCredentials } from "../../store/authSlice"
import api from "../../api/axios"

const RegisterForm = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post("/auth/register", { username, email, password })
            const { _id, username: u, email: em, token } = response.data
            dispatch(setCredentials({
                user: { _id, username: u, email: em },
                token,
            }))
            navigate("/")
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-6">Register</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border px-4 py-2 rounded"
                />
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
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="bg-orange-500 text-white py-2 rounded font-bold"
                >
                    Register
                </button>
            </form>
            <p className="mt-4 text-sm text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-orange-500 font-bold">Login</Link>
            </p>
        </div>
    )
}

export default RegisterForm