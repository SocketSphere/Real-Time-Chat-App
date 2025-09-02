import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");
let user = null;
try {
  user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
} catch {
  user = null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLogin: !!token,
    token: token || null,
    user: user,
  },
  reducers: {
    login: (state, action) => {
      state.isLogin = true;
      state.token = action.payload.token;
      state.user = action.payload.user; // <-- save user object here
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    // 
    //   state.isLogin = true;
    //   state.token = action.payload.token;
    //   state.user = action.payload.user;
    //   localStorage.setItem("token", action.payload.token);
    //   localStorage.setItem("user", JSON.stringify(action.payload.user));
    // },
    logout: (state) => {
      state.isLogin = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;