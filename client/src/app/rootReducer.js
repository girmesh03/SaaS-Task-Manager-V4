/**
 * @file Root reducer assembly.
 */
import { combineReducers } from "@reduxjs/toolkit";

import { apiSlice } from "../api/apiSlice";
import authReducer from "./slices/authSlice";
import preferencesReducer from "./slices/preferencesSlice";
import uiReducer from "./slices/uiSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  preferences: preferencesReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;
