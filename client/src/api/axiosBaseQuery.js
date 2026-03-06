import axios from "axios";
import { toast } from "react-toastify";

import {
  AUTH_COOKIE_NAMES,
  AUTH_HEADER_NAMES,
  ERROR_TYPES,
} from "../utils/constants";
import {
  clearUser,
  setUser,
} from "../app/slices/authSlice";
import { disconnectSocket } from "./socketClient";

const readCookie = (name) => {
  if (typeof document === "undefined") {
    return "";
  }

  return document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.split("=")[1] || "";
};

/**
 * Creates an RTK Query axios base-query with cookie auth and refresh-once behavior.
 *
 * @param {{ baseUrl?: string }} [options] - Base-query options.
 * @returns {import("@reduxjs/toolkit/query").BaseQueryFn} RTK Query base query.
 * @throws {never} This factory does not throw.
 */
export const axiosBaseQuery =
  ({ baseUrl = "" } = {}) =>
  async (args, api) => {
    const config = typeof args === "string" ? { url: args } : { ...args };
    const request = {
      baseURL: baseUrl,
      url: config.url,
      method: config.method || "GET",
      data: config.data,
      params: config.params,
      headers: {
        ...(config.headers || {}),
      },
      responseType: config.responseType,
      withCredentials: true,
    };
    const csrfToken = readCookie(AUTH_COOKIE_NAMES.CSRF_TOKEN);

    if (csrfToken && !request.headers[AUTH_HEADER_NAMES.CSRF]) {
      request.headers[AUTH_HEADER_NAMES.CSRF] = csrfToken;
    }

    try {
      const result = await axios(request);

      return {
        data: {
          success: Boolean(result.data?.success),
          message: result.data?.message || "",
          payload: result.data,
        },
      };
    } catch (error) {
      const status = error.response?.status;
      const errorData = error.response?.data || {
        success: false,
        message: error.message || "Request failed.",
        error: {
          type: ERROR_TYPES.INTERNAL_ERROR,
          statusCode: status || 500,
        },
        details: [],
      };

      if (status === 401 && !config._retried && request.url !== "/auth/refresh") {
        try {
          const refreshResult = await axios({
            baseURL: baseUrl,
            url: "/auth/refresh",
            method: "POST",
              headers: csrfToken
                ? {
                  [AUTH_HEADER_NAMES.CSRF]: csrfToken,
                }
              : undefined,
            withCredentials: true,
          });
          api.dispatch(setUser(refreshResult.data?.user || null));

          return axiosBaseQuery({ baseUrl })(
            {
              ...config,
              _retried: true,
            },
            api
          );
        } catch {
          api.dispatch(clearUser());
          disconnectSocket();
          try {
            await axios({
              baseURL: baseUrl,
              url: "/auth/csrf",
              method: "GET",
              withCredentials: true,
            });
          } catch {
            // Best effort only; root layout also bootstraps CSRF on mount.
          }

          if (typeof window !== "undefined" && window.location.pathname !== "/login") {
            window.location.assign("/login");
          }
        }
      }

      if (status === 403) {
        toast.error(errorData.message || "You are not allowed to do that.");
      }

      return {
        error: {
          status: status || 500,
          data: errorData,
        },
      };
    }
  };
