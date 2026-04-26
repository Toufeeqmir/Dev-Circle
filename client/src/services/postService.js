import axios from "../api/axios";

export const deletePost = (id, token) =>{
    return axios.delete(`/posts/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
    });
};
