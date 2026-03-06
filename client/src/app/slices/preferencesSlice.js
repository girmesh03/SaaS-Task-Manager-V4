import { createSlice } from "@reduxjs/toolkit";

const getDefaultTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const initialState = {
  themeMode: "system",
  language: "en",
  timezone: getDefaultTimezone(),
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    updatePreferences(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setThemeMode(state, action) {
      state.themeMode = action.payload;
    },
    setTimezone(state, action) {
      state.timezone = action.payload;
    },
  },
});

export const { updatePreferences, setThemeMode, setTimezone } =
  preferencesSlice.actions;
export default preferencesSlice.reducer;
