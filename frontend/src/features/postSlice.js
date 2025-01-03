import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import backend_url from "../config/config";

export const createPost = createAsyncThunk(
    "post/createPost",
    async (postData, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.post(`${backend_url}/api/v1/post/upload`, postData, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (id, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.delete(`${backend_url}/api/v1/post/${id}`, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const likeAndUnlikePost = createAsyncThunk(
    "post/likeAndUnlikePost",
    async (id, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.get(`${backend_url}/api/v1/post/${id}`, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const updatePost = createAsyncThunk(
    "post/updatePost",
    async ({ id, postData }, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.put(`${backend_url}/api/v1/post/${id}`, postData, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const getPostsOfTheFollowings = createAsyncThunk(
    "post/getPostsOfTheFollowings",
    async (_, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.get(`${backend_url}/api/v1/posts`, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const createComment = createAsyncThunk(
    "post/createComment",
    async ({ id, comment }, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.put(`${backend_url}/api/v1/post/comment/${id}`, { comment }, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteComment = createAsyncThunk(
    "post/deleteComment",
    async ({ id, commentId }, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.delete(`${backend_url}/api/v1/post/comment/${id}`, { commentId }, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

let initialState = {
    isLoading: false,
    postInfo: null,
    error: null,
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            //Create post
            .addCase(createPost.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.isLoading = false
                state.postInfo = action.payload
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Update post
            .addCase(updatePost.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.isLoading = false
                state.postInfo = action.payload
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Delete post
            .addCase(deletePost.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.isLoading = false
                state.postInfo = action.payload
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Get posts of the followings
            .addCase(getPostsOfTheFollowings.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(getPostsOfTheFollowings.fulfilled, (state, action) => {
                state.isLoading = false
                state.postInfo = action.payload
            })
            .addCase(getPostsOfTheFollowings.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Like and unlike post
            .addCase(likeAndUnlikePost.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(likeAndUnlikePost.fulfilled, (state, action) => {
                state.isLoading = false
                state.postInfo = action.payload
            })
            .addCase(likeAndUnlikePost.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Comment on post
            .addCase(createComment.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.isLoading = false
                state.postInfo = action.payload
            })
            .addCase(createComment.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Delete comment
            .addCase(deleteComment.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.isLoading = false
                state.postInfo = action.payload
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export const { clearError } = postSlice.actions
export default postSlice.reducer