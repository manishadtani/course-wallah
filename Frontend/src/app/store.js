// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import instructorReducer from '../features/instructor/instructorSlice';

export const store = configureStore({
  reducer: {
    instructor: instructorReducer,
  },
});
