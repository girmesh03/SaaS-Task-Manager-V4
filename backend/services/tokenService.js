import crypto from "crypto";

import jwt from "jsonwebtoken";

import { getEnv } from "../config/env.js";
import { throwUnauthenticatedError } from "../utils/errorFactory.js";
import { AUTH_COOKIE_NAMES } from "../utils/constants.js";

/**
 * Creates a signed access token for the authenticated actor.
 *
 * @param {{ userId: string, organizationId: string, departmentId?: string | null, role: string, isHod: boolean, isPlatformOrgUser: boolean }} payload - Actor claims.
 * @returns {string} Signed JWT access token.
 * @throws {Error} Propagates signing failures.
 */
export const createAccessToken = (payload) => {
  const { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN } = getEnv();

  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });
};

/**
 * Creates a signed refresh token tied to a refresh session id.
 *
 * @param {{ sessionId: string, userId: string }} payload - Refresh claims.
 * @returns {string} Signed JWT refresh token.
 * @throws {Error} Propagates signing failures.
 */
export const createRefreshToken = (payload) => {
  const { JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } = getEnv();

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
};

/**
 * Verifies a signed access token and returns claims.
 *
 * @param {string} token - Raw access token.
 * @returns {jwt.JwtPayload & Record<string, unknown>} Verified token claims.
 * @throws {Error} Propagates JWT verification failures.
 */
export const verifyAccessToken = (token) => {
  const { JWT_ACCESS_SECRET } = getEnv();
  return /** @type {jwt.JwtPayload & Record<string, unknown>} */ (
    jwt.verify(token, JWT_ACCESS_SECRET)
  );
};

/**
 * Verifies a signed refresh token and returns claims.
 *
 * @param {string} token - Raw refresh token.
 * @returns {jwt.JwtPayload & Record<string, unknown>} Verified token claims.
 * @throws {Error} Propagates JWT verification failures.
 */
export const verifyRefreshToken = (token) => {
  const { JWT_REFRESH_SECRET } = getEnv();
  return /** @type {jwt.JwtPayload & Record<string, unknown>} */ (
    jwt.verify(token, JWT_REFRESH_SECRET)
  );
};

/**
 * Hashes a token using sha256 before persistence.
 *
 * @param {string} token - Raw token value.
 * @returns {string} Sha256 token hash.
 * @throws {never} This helper does not throw.
 */
export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

/**
 * Creates a random CSRF token value.
 *
 * @returns {string} Random CSRF token.
 * @throws {never} This helper does not throw.
 */
export const createCsrfToken = () => crypto.randomBytes(24).toString("hex");

/**
 * Writes auth-related cookies onto the response.
 *
 * @param {import("express").Response} res - Express response.
 * @param {{ accessToken?: string, refreshToken?: string, csrfToken?: string }} cookies - Cookie values to set.
 * @returns {void}
 * @throws {never} This helper does not throw.
 */
export const setAuthCookies = (res, { accessToken, refreshToken, csrfToken }) => {
  const {
    AUTH_COOKIE_OPTIONS,
    CSRF_COOKIE_OPTIONS,
    JWT_ACCESS_TTL_MINUTES,
    JWT_REFRESH_TTL_DAYS,
  } = getEnv();

  if (accessToken) {
    res.cookie(AUTH_COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: JWT_ACCESS_TTL_MINUTES * 60 * 1000,
    });
  }

  if (refreshToken) {
    res.cookie(AUTH_COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
    });
  }

  if (csrfToken) {
    res.cookie(AUTH_COOKIE_NAMES.CSRF_TOKEN, csrfToken, {
      ...CSRF_COOKIE_OPTIONS,
      maxAge: JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
    });
  }
};

/**
 * Clears all auth cookies from the response.
 *
 * @param {import("express").Response} res - Express response.
 * @returns {void}
 * @throws {never} This helper does not throw.
 */
export const clearAuthCookies = (res) => {
  const { AUTH_COOKIE_OPTIONS, CSRF_COOKIE_OPTIONS } = getEnv();

  res.clearCookie(AUTH_COOKIE_NAMES.ACCESS_TOKEN, AUTH_COOKIE_OPTIONS);
  res.clearCookie(AUTH_COOKIE_NAMES.REFRESH_TOKEN, AUTH_COOKIE_OPTIONS);
  res.clearCookie(AUTH_COOKIE_NAMES.CSRF_TOKEN, CSRF_COOKIE_OPTIONS);
};

/**
 * Reads a required cookie value or throws an unauthenticated error.
 *
 * @param {import("express").Request} req - Express request.
 * @param {string} cookieName - Cookie name.
 * @returns {string} Cookie value.
 * @throws {Error} Throws when the cookie is missing.
 */
export const requireCookieValue = (req, cookieName) => {
  const value = req.cookies?.[cookieName];

  if (!value) {
    throwUnauthenticatedError();
  }

  return value;
};
