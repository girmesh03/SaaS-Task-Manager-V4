import { getEnv } from "../config/env.js";
import { createError } from "../utils/errorFactory.js";
import {
  API_MESSAGES,
  API_STATUS_CODES,
  AUTH_COOKIE_NAMES,
  AUTH_HEADER_NAMES,
  ERROR_TYPES,
  SECURITY_CONSTANTS,
} from "../utils/constants.js";

/**
 * Enforces double-submit CSRF validation on state-changing routes.
 *
 * @param {import("express").Request} req - Express request.
 * @param {import("express").Response} res - Express response.
 * @param {import("express").NextFunction} next - Express next callback.
 * @returns {void}
 * @throws {never} This middleware forwards validation errors.
 */
export const requireCsrf = (req, res, next) => {
  const method = String(req.method || "").toUpperCase();

  if (!SECURITY_CONSTANTS.STATE_CHANGING_METHODS.includes(method)) {
    next();
    return;
  }

  const { CORS_ALLOWED_ORIGINS, IS_PRODUCTION } = getEnv();
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAMES.CSRF_TOKEN];
  const headerToken = req.get(AUTH_HEADER_NAMES.CSRF);

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    next(
      createError({
        type: ERROR_TYPES.UNAUTHORIZED_ERROR,
        statusCode: API_STATUS_CODES.FORBIDDEN,
        message: API_MESSAGES.INVALID_CSRF_TOKEN,
        details: [],
      })
    );
    return;
  }

  if (IS_PRODUCTION) {
    const origin = req.get("origin") || req.get("referer") || "";
    const matchesAllowedOrigin = CORS_ALLOWED_ORIGINS.some((allowedOrigin) =>
      origin.startsWith(allowedOrigin)
    );

    if (!matchesAllowedOrigin) {
      next(
        createError({
          type: ERROR_TYPES.UNAUTHORIZED_ERROR,
          statusCode: API_STATUS_CODES.FORBIDDEN,
          message: API_MESSAGES.INVALID_CSRF_ORIGIN,
          details: [],
        })
      );
      return;
    }
  }

  next();
};
