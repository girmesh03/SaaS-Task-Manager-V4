import { createSlice } from "@reduxjs/toolkit";

import { LIST_VIEW_MODES } from "../../utils/constants";

const initialState = {
  listViewModes: {
    tasks: LIST_VIEW_MODES.GRID,
    departments: LIST_VIEW_MODES.GRID,
    users: LIST_VIEW_MODES.GRID,
    materials: LIST_VIEW_MODES.GRID,
    vendors: LIST_VIEW_MODES.GRID,
  },
  globalSearchOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setListViewMode(state, action) {
      const { resource, mode } = action.payload;
      state.listViewModes[resource] = mode;
    },
    setGlobalSearchOpen(state, action) {
      state.globalSearchOpen = Boolean(action.payload);
    },
  },
});

export const { setListViewMode, setGlobalSearchOpen } = uiSlice.actions;
export default uiSlice.reducer;
