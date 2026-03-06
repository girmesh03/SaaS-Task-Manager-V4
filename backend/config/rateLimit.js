import rateLimit from "express-rate-limit";

import { getEnv } from "./env.js";
import {
  API_MESSAGES_EXTENDED,
  API_STATUS_CODES,
  ERROR_TYPES,
  RATE_LIMIT_DEFAULTS,
  RATE_LIMIT_ENV_KEYS,
  RATE_LIMIT_NAMES,
} from "../utils/constants.js";

/**
 * Reads the environment-backed rate-limit settings for all middleware tiers.
 *
 * @returns {{
 *   global: { windowMs: number, limit: number },
 *   auth: { windowMs: number, limit: number },
 *   emailTokens: { windowMs: number, limit: number }
 * }} Rate-limit configuration.
 * @throws {Error} Thrown when an override env value fails integer parsing.
 */
export const getRateLimitSettings = () => ({
  [RATE_LIMIT_NAMES.GLOBAL]: {
    windowMs: getEnv(RATE_LIMIT_ENV_KEYS.GLOBAL_WINDOW_MS, {
      type: "int",
      required: false,
      defaultValue: RATE_LIMIT_DEFAULTS.GLOBAL_WINDOW_MS,
      min: 1,
    }),
    limit: getEnv(RATE_LIMIT_ENV_KEYS.GLOBAL_MAX, {
      type: "int",
      required: false,
      defaultValue: RATE_LIMIT_DEFAULTS.GLOBAL_MAX,
      min: 1,
    }),
  },
  [RATE_LIMIT_NAMES.AUTH]: {
    windowMs: getEnv(RATE_LIMIT_ENV_KEYS.AUTH_WINDOW_MS, {
      type: "int",
      required: false,
      defaultValue: RATE_LIMIT_DEFAULTS.AUTH_WINDOW_MS,
      min: 1,
    }),
    limit: getEnv(RATE_LIMIT_ENV_KEYS.AUTH_MAX, {
      type: "int",
      required: false,
      defaultValue: RATE_LIMIT_DEFAULTS.AUTH_MAX,
      min: 1,
    }),
  },
  [RATE_LIMIT_NAMES.EMAIL_TOKENS]: {
    windowMs: getEnv(RATE_LIMIT_ENV_KEYS.EMAIL_TOKENS_WINDOW_MS, {
      type: "int",
      required: false,
      defaultValue: RATE_LIMIT_DEFAULTS.EMAIL_TOKENS_WINDOW_MS,
      min: 1,
    }),
    limit: getEnv(RATE_LIMIT_ENV_KEYS.EMAIL_TOKENS_MAX, {
      type: "int",
      required: false,
      defaultValue: RATE_LIMIT_DEFAULTS.EMAIL_TOKENS_MAX,
      min: 1,
    }),
  },
});

/**
 * Builds an express-rate-limit middleware with canonical 429 responses.
 *
 * @param {{ windowMs: number, limit: number }} options - Middleware options.
 * @returns {import("express").RequestHandler} Rate-limit middleware.
 * @throws {never} This factory does not intentionally throw.
 */
export const createRateLimitMiddleware = ({ windowMs, limit }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler(req, res) {
      res.status(API_STATUS_CODES.TOO_MANY_REQUESTS).json({
        success: false,
        message: API_MESSAGES_EXTENDED.RATE_LIMITED,
        error: {
          type: ERROR_TYPES.RATE_LIMITED_ERROR,
          statusCode: API_STATUS_CODES.TOO_MANY_REQUESTS,
        },
        details: [],
      });
    },
  });
