import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient'

// Register Thunk
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/register', userData);
      // The backend sets the cookie here, so we don't need to handle a token in the response data
      console.log('Register successful, cookie set by backend.');
      return response.data.user;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Registration failed',
        status: error.response?.status
      });
    }
  }
);

// Login Thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/login', credentials);
      
      // The backend sets the cookie here.
      // We DO NOT need to store a token in localStorage.
      console.log('Login successful, cookie set by backend.');
      
      // The response.data.user should be returned for the Redux state
      return response.data.user;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Login failed',
        status: error.response?.status
      });
    }
  }
);

// Check Auth Thunk
export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      // Axios will automatically send the cookie here because withCredentials is true
      const { data } = await axiosClient.get('/user/check');
      return data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue(null); // Special case for no session
      }
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Auth check failed',
        status: error.response?.status
      });
    }
  }
);

// Logout Thunk
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Backend will clear the cookie on its end
      await axiosClient.post('/user/logout');
      console.log('Logout successful, backend cleared cookie.');
      
      // We don't need to clear localStorage anymore
      
      return null;
    } catch (error) {
      // Even if logout fails, the cookie might still be invalid.
      console.error('Logout failed:', error);
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Logout failed',
        status: error.response?.status
      });
    }
  }
);

// authSlice remains the same from here
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    // ... all addCase statements remain the same
    // They will now handle the user object returned directly from the fulfilled actions
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })
 
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })
 
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })
 
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      });
  }
});

export default authSlice.reducer;