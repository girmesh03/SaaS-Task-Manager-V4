import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { RouterProvider } from "react-router";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "./theme/AppTheme";

import routes from "./router/routes";
import { ErrorBoundary } from "./components/common";
import { persistor, store } from "./app/store";
import { MuiLoading } from "./components/reusable";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<MuiLoading fullScreen message="Loading workspace..." />} persistor={persistor}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AppTheme>
            <CssBaseline enableColorScheme />
            <ErrorBoundary>
              <RouterProvider router={routes} />
            </ErrorBoundary>
          </AppTheme>
        </LocalizationProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
