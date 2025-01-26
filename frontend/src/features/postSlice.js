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

export const saveAndUnsavePost = createAsyncThunk(
    "post/saveAndUnsavePost",
    async (id, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.get(`${backend_url}/api/v1/post/save/${id}`, config)
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
                data: { commentId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.delete(`${backend_url}/api/v1/post/comment/${id}`, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const replyToComment = createAsyncThunk(
    "post/replyToComment",
    async ({ id, commentId, reply }, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.post(`${backend_url}/api/v1/post/comment/reply/${id}`, { commentId, reply }, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteReply = createAsyncThunk(
    "post/deleteReply",
    async ({ id, commentId, replyId }, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                data: { commentId, replyId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.delete(`${backend_url}/api/v1/post/comment/reply/${id}`, config)
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
    posts: null,
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
                state.posts = action.payload.posts
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
            //Save and unsave post
            .addCase(saveAndUnsavePost.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(saveAndUnsavePost.fulfilled, (state, action) => {
                state.isLoading = false
                state.postInfo = action.payload
            })
            .addCase(saveAndUnsavePost.rejected, (state, action) => {
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
            //Reply to comment
            .addCase(replyToComment.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(replyToComment.fulfilled, (state, action) => {
                state.isLoading = false
                state.postInfo = action.payload
            })
            .addCase(replyToComment.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Delete reply
            .addCase(deleteReply.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteReply.fulfilled, (state, action) => {
                state.isLoading = false
                state.postInfo = action.payload
            })
            .addCase(deleteReply.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export const { clearError } = postSlice.actions
export default postSlice.reducer