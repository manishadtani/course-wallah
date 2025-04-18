// src/features/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ STEP 1: Get data from localStorage (for persistent login)
const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const tokenFromStorage = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

// ✅ STEP 2: Set initialState using localStorage
const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage,
  loading: false,
  error: null,
};

// ✅ Async thunk for login (updated)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, endpoint }, thunkAPI) => {
    try {
      const res = await axios.post(endpoint, { email, password });

      // ✅ Save to localStorage here
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      // ✅ Clear localStorage on logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
