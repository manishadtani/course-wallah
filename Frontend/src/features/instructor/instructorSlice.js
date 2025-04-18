import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch instructor by username
export const fetchInstructor = createAsyncThunk(
  'instructor/fetchInstructor',
  async (username, thunkAPI) => {
    try {
      const response = await axios.get(`/api/instructors/${username}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
  }
);

const instructorSlice = createSlice({
  name: 'instructor',
  initialState: {
    instructor: null,
    courses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.instructor = action.payload.instructor;
        state.courses = action.payload.courses;
      })
      .addCase(fetchInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default instructorSlice.reducer;
