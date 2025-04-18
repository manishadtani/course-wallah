// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import instructorReducer from '../features/instructor/instructorSlice';
import authReducer from '../features/auth/authSlice'; // ✅ import authSlice too

export const store = configureStore({
  reducer: {
    instructor: instructorReducer,
    auth: authReducer, // ✅ now your store handles both instructor & auth
  },
});
