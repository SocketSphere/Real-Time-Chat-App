// src/features/notifications/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  count: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotificationCount: (state, action) => {
      state.count = action.payload;
    },
    incrementNotificationCount: (state) => {
      state.count += 1;
    },
    decrementNotificationCount: (state) => {
      state.count = Math.max(0, state.count - 1);
    },
  },
});

export const { setNotificationCount, incrementNotificationCount, decrementNotificationCount } = notificationSlice.actions;

export default notificationSlice.reducer;