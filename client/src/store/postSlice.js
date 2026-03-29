import { createSlice } from "@reduxjs/toolkit"
 const setPost = createSlice({
       name: "post",
       initialState:{
             posts: [],
             isLoading: false,
             error: null

       },
          reducers : {
             addPost: (state, action) =>{
                            state.posts.unshift(action.payload)

                  },
                    setPosts: (state, action) =>{
                         state.posts = action.payload

                    },
                    updateVotes: (state , action) =>{
                         const {postId , voteScore} = action.payload
                         const post = state.posts.find((p)=>p._id ===postId)
                         if(post){
                            post.voteScore = voteScore
                         }
                    }
            }

 })
 export const {addPost, setPosts, updateVotes} = setPost.actions
 export default setPost.reducer