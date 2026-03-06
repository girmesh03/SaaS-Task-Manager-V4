import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { apiSlice } from "../api/apiSlice";
import { disconnectSocket } from "../api/socketClient";
import { clearActor } from "../app/slices/authSlice";

/**
 * Reads actor auth state and provides a logout helper.
 *
 * @returns {{ actor: Record<string, unknown> | null, isAuthenticated: boolean, logout: () => void }} Auth state and helpers.
 * @throws {never} This hook does not throw.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const actor = useSelector((state) => state.auth.actor);

  const logout = () => {
    dispatch(clearActor());
    dispatch(apiSlice.util.resetApiState());
    disconnectSocket();
    navigate("/login");
  };

  return {
    actor,
    isAuthenticated: Boolean(actor?.id || actor?.userId),
    logout,
  };
};
