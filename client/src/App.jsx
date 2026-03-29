
import {BrowserRouter, Routes, Route} from "react-router-dom"
import CommunityPage from "./pages/CommunityPage"
import LoginPage from "./pages/Login"
import PostPage from "./pages/PostPage"
import ProfilePage from "./pages/ProfilePages"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Navbar from "./components/shared/Navbar"

 function App() {
  return (
     <BrowserRouter>
      <Navbar/>
      <main >
      <Routes>       
  <Route path="/" element={<Home />} /> 
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<Register />} />
  <Route path="/c/:communityName" element={<CommunityPage />} />
  <Route path="/post/:postId" element={<PostPage />} />
  <Route path="/u/:username" element={<ProfilePage />} />
</Routes>
      </main>
     </BrowserRouter>
  )
}



export default App
 