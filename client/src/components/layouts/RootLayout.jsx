/**
 * @file Root layout that mounts shared providers and toast container.
 */
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import Container from "@mui/material/Box";
import { ToastContainer } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";
import { useGetCsrfTokenQuery } from "../../api/apiSlice";
import { connectSocket, disconnectSocket } from "../../api/socketClient";

/**
 * Root route layout.
 *
 * @returns {JSX.Element} Root layout element.
 * @throws {never} This component does not throw.
 */
const RootLayout = () => {
  const theme = useTheme();
  const actor = useSelector((state) => state.auth.actor);

  useGetCsrfTokenQuery();

  useEffect(() => {
    if (actor?.id || actor?.userId) {
      connectSocket();

      return () => {
        disconnectSocket();
      };
    }

    disconnectSocket();
    return undefined;
  }, [actor]);

  return (
    <Container sx={{ minHeight: "100vh" }}>
      <Outlet />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme.palette.mode === "dark" ? "dark" : "light"}
      />
    </Container>
  );
};

export default RootLayout;
