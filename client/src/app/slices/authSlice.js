/**
 * @file Authentication state slice.
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: "anonymous",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.status = action.payload ? "authenticated" : "anonymous";
    },
    clearUser(state) {
      state.user = null;
      state.status = "anonymous";
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
