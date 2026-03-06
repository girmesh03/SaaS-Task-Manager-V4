import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { apiSlice } from "../api/apiSlice";
import { disconnectSocket } from "../api/socketClient";
import { clearUser } from "../app/slices/authSlice";

/**
 * Reads user auth state and provides a logout helper.
 *
 * @returns {{ user: Record<string, unknown> | null, isAuthenticated: boolean, logout: () => Promise<void> }} Auth state and helpers.
 * @throws {never} This hook does not throw.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const logout = async () => {
    try {
      await dispatch(apiSlice.endpoints.logout.initiate()).unwrap();
    } catch {
      // Logout still clears local state when the server session is already gone.
    }

    disconnectSocket();
    dispatch(clearUser());
    dispatch(apiSlice.util.resetApiState());
    void dispatch(
      apiSlice.endpoints.getCsrfToken.initiate(undefined, {
        forceRefetch: true,
      })
    );
    navigate("/login", { replace: true });
  };

  return {
    user,
    isAuthenticated: Boolean(user?._id),
    logout,
  };
};
