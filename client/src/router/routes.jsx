/**
 * @file Application route map for public and dashboard placeholders.
 */
import { createBrowserRouter } from "react-router";
import {
  RootLayout,
  PublicLayout,
  DashboardLayout,
} from "../components/layouts";
import { ErrorBoundary } from "../components/common";
import { MuiLoading } from "../components/reusable";

/**
 * Wraps a lazy module loader in React Router `lazy` contract.
 *
 * @template TModule
 * @param {() => Promise<TModule & { default: React.ComponentType }>} loader - Dynamic import loader.
 * @returns {() => Promise<{ Component: React.ComponentType }>} Lazy route resolver.
 * @throws {Error} Propagates module-loading failures.
 */
const lazyPage = (loader) => {
  return async () => {
    const module = await loader();
    return { Component: module.default };
  };
};

const routes = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorBoundary,
    HydrateFallback: MuiLoading,
    children: [
      {
        Component: PublicLayout,
        children: [
          {
            index: true,
            lazy: lazyPage(() => import("../pages/public/LandingPage")),
          },
          {
            path: "login",
            lazy: lazyPage(() => import("../pages/public/LoginPage")),
          },
          {
            path: "register",
            lazy: lazyPage(() => import("../pages/public/RegisterPage")),
          },
          {
            path: "verify-email",
            lazy: lazyPage(() => import("../pages/public/VerifyEmailPage")),
          },
          {
            path: "forgot-password",
            lazy: lazyPage(() => import("../pages/public/ForgotPasswordPage")),
          },
          {
            path: "reset-password",
            lazy: lazyPage(() => import("../pages/public/ResetPasswordPage")),
          },
        ],
      },
      {
        path: "dashboard",
        Component: DashboardLayout,
        children: [
          {
            index: true,
            lazy: lazyPage(() => import("../pages/protected/DashboardPage")),
          },
          {
            path: "tasks",
            lazy: lazyPage(() => import("../pages/protected/TasksPage")),
          },
          {
            path: "tasks/:taskId",
            lazy: lazyPage(() => import("../pages/protected/TaskDetailsPage")),
          },
          {
            path: "users",
            lazy: lazyPage(() => import("../pages/protected/UsersPage")),
          },
          {
            path: "users/:userId",
            lazy: lazyPage(() => import("../pages/protected/UserDetailsPage")),
          },
          {
            path: "users/:userId",
            lazy: lazyPage(() => import("../pages/protected/UserDetailsPage")),
          },
          {
            path: "users/:userId/settings",
            lazy: lazyPage(() => import("../pages/protected/UserSettingsPage")),
          },
          {
            path: "departments",
            lazy: lazyPage(() => import("../pages/protected/DepartmentsPage")),
          },
          {
            path: "departments/:departmentId",
            lazy: lazyPage(() =>
              import("../pages/protected/DepartmentDetailsPage")
            ),
          },
          {
            path: "materials",
            lazy: lazyPage(() => import("../pages/protected/MaterialsPage")),
          },
          {
            path: "materials/:materialId",
            lazy: lazyPage(() =>
              import("../pages/protected/MaterialDetailsPage")
            ),
          },
          {
            path: "vendors",
            lazy: lazyPage(() => import("../pages/protected/VendorsPage")),
          },
          {
            path: "vendors/:vendorId",
            lazy: lazyPage(() =>
              import("../pages/protected/VendorDetailsPage")
            ),
          },
          {
            path: "settings",
            lazy: lazyPage(() => import("../pages/protected/OrgSettingsPage")),
          },
        ],
      },
      {
        path: "*",
        lazy: lazyPage(() => import("../pages/public/NotFound")),
      },
    ],
  },
]);

export default routes;
