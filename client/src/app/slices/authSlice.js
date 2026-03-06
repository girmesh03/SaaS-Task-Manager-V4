import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  actor: null,
  status: "anonymous",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setActor(state, action) {
      state.actor = action.payload;
      state.status = action.payload ? "authenticated" : "anonymous";
    },
    clearActor(state) {
      state.actor = null;
      state.status = "anonymous";
    },
  },
});

export const { setActor, clearActor } = authSlice.actions;
export default authSlice.reducer;
