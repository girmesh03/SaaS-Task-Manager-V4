import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "../../hooks/useAuth";

/**
 * Redirects unauthenticated users away from protected dashboard routes.
 *
 * @returns {JSX.Element} Protected-route outlet or redirect.
 * @throws {never} This component does not throw.
 */
const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
