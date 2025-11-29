//store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import notificationReducer from './notificationSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,

  },
});
