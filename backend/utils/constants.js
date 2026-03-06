/**
 * @file Backend constants used across config, routing, and API handling.
 * @throws {never} Module initialization does not throw.
 */
export const APP_NAME = "TaskManager";

export const VALID_NODE_ENVS = Object.freeze([
  "development",
  "staging",
  "production",
]);

export const BOOLEAN_TRUE_VALUES = new Set(["1", "true", "yes", "on"]);
export const BOOLEAN_FALSE_VALUES = new Set(["0", "false", "no", "off"]);

export const ERROR_TYPES = Object.freeze({
  UNAUTHENTICATED_ERROR: "UNAUTHENTICATED_ERROR",
  UNAUTHORIZED_ERROR: "UNAUTHORIZED_ERROR",
  NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CONFLICT_ERROR: "CONFLICT_ERROR",
  RATE_LIMITED_ERROR: "RATE_LIMITED_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
});

export const STATUS_TO_ERROR_TYPE = Object.freeze({
  400: ERROR_TYPES.VALIDATION_ERROR,
  401: ERROR_TYPES.UNAUTHENTICATED_ERROR,
  403: ERROR_TYPES.UNAUTHORIZED_ERROR,
  404: ERROR_TYPES.NOT_FOUND_ERROR,
  409: ERROR_TYPES.CONFLICT_ERROR,
  429: ERROR_TYPES.RATE_LIMITED_ERROR,
  500: ERROR_TYPES.INTERNAL_ERROR,
});

export const API_MESSAGES = Object.freeze({
  ROOT: "API is running.",
  NOT_FOUND: "Requested resource was not found.",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  ENV_VALIDATION_FAILED: "Environment validation failed during startup.",
});

export const ENV_DEFAULTS = Object.freeze({
  JWT_ACCESS_TTL_MINUTES: 15,
  JWT_REFRESH_TTL_DAYS: 7,
  EMAIL_VERIFICATION_TOKEN_TTL_MINUTES: 60,
  PASSWORD_RESET_TOKEN_TTL_MINUTES: 15,
  SET_PASSWORD_TOKEN_TTL_MINUTES: 1440,
});

export const PASSWORD_POLICY_LIMITS = Object.freeze({
  DEVELOPMENT_MIN_LENGTH: 8,
  PRODUCTION_MIN_LENGTH: 12,
  HISTORY_LIMIT: 5,
});
