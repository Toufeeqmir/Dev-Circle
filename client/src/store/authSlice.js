import { createSlice } from "@reduxjs/toolkit"

const getUserFromStorage = () => {
    try {
        const user = localStorage.getItem("user")
        return user ? JSON.parse(user) : null
    } catch {
        return null
    }
}

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: getUserFromStorage(),
        token: localStorage.getItem("token") || null
    },
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload

            if (!user || !token) {
                state.user = null
                state.token = null
                localStorage.removeItem("user")
                localStorage.removeItem("token")
                return
            }

            state.user = user
            state.token = token
            localStorage.setItem("user", JSON.stringify(user))
            localStorage.setItem("token", token)
        },
        logout: (state) => {
            state.user = null
            state.token = null
            localStorage.removeItem("user")
            localStorage.removeItem("token")
        }
    }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
