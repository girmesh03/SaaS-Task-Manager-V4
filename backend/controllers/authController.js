import asyncHandler from "express-async-handler";

import { sendSuccess } from "../utils/apiResponse.js";
import {
  API_MESSAGES,
  AUTH_COOKIE_NAMES,
} from "../utils/constants.js";
import {
  refreshSession as refreshSessionService,
  logout as logoutService,
} from "../services/authService.js";
import {
  createCsrfToken,
  clearAuthCookies,
  setAuthCookies,
} from "../services/tokenService.js";

/**
 * Issues a fresh CSRF cookie for a browser session.
 *
 * @returns {Promise<void>} Async controller completion.
 * @throws {Error} Propagates cookie-writing failures.
 */
export const getCsrfToken = asyncHandler(async (req, res) => {
  setAuthCookies(res, {
    csrfToken: createCsrfToken(),
  });

  sendSuccess(res, {
    message: API_MESSAGES.CSRF_ISSUED,
    dataKey: "csrf",
    data: {
      issued: true,
    },
  });
});

/**
 * Rotates the refresh session and returns the current actor snapshot.
 *
 * @returns {Promise<void>} Async controller completion.
 * @throws {Error} Propagates refresh-session failures.
 */
export const refreshSession = asyncHandler(async (req, res) => {
  const payload = await refreshSessionService({
    refreshToken: req.cookies?.[AUTH_COOKIE_NAMES.REFRESH_TOKEN],
    actorIp: req.ip,
    actorUserAgent: req.get("user-agent") || null,
  });

  setAuthCookies(res, payload);

  sendSuccess(res, {
    message: API_MESSAGES.REFRESHED,
    dataKey: "user",
    data: payload.user,
    meta: {
      refreshed: true,
    },
  });
});

/**
 * Revokes the current refresh session and clears auth cookies.
 *
 * @returns {Promise<void>} Async controller completion.
 * @throws {Error} Propagates logout failures.
 */
export const logout = asyncHandler(async (req, res) => {
  await logoutService({
    refreshToken: req.cookies?.[AUTH_COOKIE_NAMES.REFRESH_TOKEN],
  });
  clearAuthCookies(res);

  sendSuccess(res, {
    message: API_MESSAGES.LOGGED_OUT,
  });
});
