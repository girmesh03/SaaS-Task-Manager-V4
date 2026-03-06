import {
  createRateLimitMiddleware,
  getRateLimitSettings,
} from "../config/rateLimit.js";
import { RATE_LIMIT_NAMES } from "../utils/constants.js";

const rateLimitSettings = getRateLimitSettings();

/**
 * Global API rate limiter.
 *
 * @type {import("express").RequestHandler}
 */
export const rateLimitGlobal = createRateLimitMiddleware({
  ...rateLimitSettings[RATE_LIMIT_NAMES.GLOBAL],
});

/**
 * Auth route rate limiter.
 *
 * @type {import("express").RequestHandler}
 */
export const rateLimitAuth = createRateLimitMiddleware({
  ...rateLimitSettings[RATE_LIMIT_NAMES.AUTH],
});

/**
 * Email token route rate limiter.
 *
 * @type {import("express").RequestHandler}
 */
export const rateLimitEmailTokens = createRateLimitMiddleware({
  ...rateLimitSettings[RATE_LIMIT_NAMES.EMAIL_TOKENS],
});
