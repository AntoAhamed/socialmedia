import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import backend_url from "../config/config";

export const signup = createAsyncThunk(
    "user/signup",
    async (userData, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } }
            const { data } = await axios.post(`${backend_url}/api/v1/register`, userData, config)
            localStorage.setItem("token", JSON.stringify(data.token))
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const login = createAsyncThunk(
    "user/login",
    async (userData, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } }
            const { data } = await axios.post(`${backend_url}/api/v1/login`, userData, config)
            localStorage.setItem("token", JSON.stringify(data.token))
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const loadUser = createAsyncThunk(
    "user/loadUser",
    async (_, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const { data } = await axios.get(`${backend_url}/api/v1/me`, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const getMyPosts = createAsyncThunk(
    "user/getMyPosts",
    async (_, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const { data } = await axios.get(`${backend_url}/api/v1/my/posts`, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const logout = createAsyncThunk(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            localStorage.removeItem('token')
            const data = {
                success: true,
                message: "Logged Out"
            }
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const forgotPassword = createAsyncThunk(
    "user/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } }

            const { data } = await axios.post(`${backend_url}/api/v1/forgot/password`, {email}, config)

            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const resetPassword = createAsyncThunk(
    "user/resetPassword",
    async ({ token, passwords }, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } }

            const { data } = await axios.put(`${backend_url}/api/v1/password/reset/${token}`, passwords, config)

            localStorage.setItem("token", JSON.stringify(data.token))

            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const updatePassword = createAsyncThunk(
    "user/updatePassword",
    async (passwords, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.put(
                `${backend_url}/api/v1/update/password`,
                passwords, config
            )
            localStorage.setItem("token", JSON.stringify(data.token))
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const updateProfile = createAsyncThunk(
    "user/updateProfile",
    async (userData, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.put(
                `${backend_url}/api/v1/update/profile`,
                userData, config
            )
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (name, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const { data } = await axios.get(`${backend_url}/api/v1/users?name=${name}`, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const getUserProfile = createAsyncThunk(
    "user/getUserProfile",
    async (id, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const { data } = await axios.get(`${backend_url}/api/v1/user/${id}`, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const getUserPosts = createAsyncThunk(
    "user/getUserPosts",
    async (id, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const { data } = await axios.get(`${backend_url}/api/v1/userposts/${id}`, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const followUser = createAsyncThunk(
    "user/followUser",
    async (id, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const { data } = await axios.get(`${backend_url}/api/v1/follow/${id}`, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const deleteMyAccount = createAsyncThunk(
    "user/deleteMyAccount",
    async (_, { rejectWithValue }) => {
        try {
            const token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const { data } = await axios.delete(`${backend_url}/api/v1/delete/me`, config)
            return data
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

let initialState = {
    success: false,
    isLoading: false,
    user: null,
    error: null,
    message: null,
    users: null,
    posts: null,
    isAuth: false,
    userInfo: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearErrorAndMessage: (state) => {
            state.success = false;
            state.message = null;
            state.error = null;
        },
        tempLogout: (state) => {
            state.isAuth = false
            state.user = null
        },
    },
    extraReducers: (builder) => {
        builder
            //Signup
            .addCase(signup.pending, (state) => {
                state.isLoading = true
                state.error = null
                state.isAuth = false
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload.user
                state.isAuth = true
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
                state.isAuth = false
            })
            //Login
            .addCase(login.pending, (state) => {
                state.isLoading = true
                state.error = null
                state.isAuth = false
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload.user
                state.isAuth = true
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
                state.isAuth = false
            })
            //Load User
            .addCase(loadUser.pending, (state) => {
                state.isLoading = true
                state.error = null
                state.isAuth = false
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload.user
                state.isAuth = true
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
                state.isAuth = false
            })
            //Get my posts
            .addCase(getMyPosts.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(getMyPosts.fulfilled, (state, action) => {
                state.isLoading = false
                state.success = action.payload.success
                state.posts = action.payload.posts
            })
            .addCase(getMyPosts.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Logout (dummy)
            .addCase(logout.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoading = false
                state.userInfo = action.payload
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.success = action.payload.success
                state.message = action.payload.message
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Update Password
            .addCase(updatePassword.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.isLoading = false
                state.success = action.payload.success
                state.message = action.payload.message
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.isLoading = false
                state.success = action.payload.success
                state.message = action.payload.message
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isLoading = false
                state.success = action.payload.success
                state.message = action.payload.message
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Get all users
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false
                state.success = action.payload.success
                state.users = action.payload.users
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Get user profile (userInfo contains success, user)
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.userInfo = action.payload
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Get user posts
            .addCase(getUserPosts.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(getUserPosts.fulfilled, (state, action) => {
                state.isLoading = false
                state.success = action.payload.success
                state.posts = action.payload.posts
            })
            .addCase(getUserPosts.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Follow user
            .addCase(followUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(followUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.success = action.payload.success
                state.message = action.payload.message
            })
            .addCase(followUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            //Delete my account
            .addCase(deleteMyAccount.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteMyAccount.fulfilled, (state, action) => {
                state.isLoading = false
                state.success = action.payload.success
                state.message = action.payload.message
            })
            .addCase(deleteMyAccount.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export const { clearErrorAndMessage, tempLogout } = userSlice.actions
export default userSlice.reducer