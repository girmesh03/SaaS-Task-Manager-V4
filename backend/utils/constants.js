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

export const LOG_LEVELS = Object.freeze({
  DEVELOPMENT: "debug",
  DEFAULT: "info",
});

export const LOG_REDACTION_PLACEHOLDER = "[REDACTED]";

export const LOG_REDACTION_FIELDS = Object.freeze([
  "authorization",
  "cookie",
  "set-cookie",
  "x-csrf-token",
  "csrfToken",
  "email",
  "firstName",
  "lastName",
  "fullName",
  "phone",
  "phoneNumber",
  "password",
  "confirmPassword",
  "currentPassword",
  "newPassword",
  "passwordHash",
  "passwordHistoryHashes",
  "token",
  "refreshToken",
  "accessToken",
  "secret",
  "smtp_pass",
  "jwt_access_secret",
  "jwt_refresh_secret",
  "cloudinary_api_secret",
]);

export const HTTP_LOG_MESSAGES = Object.freeze({
  REQUEST_COMPLETED: "HTTP request completed",
  DEV_REQUEST_COMPLETED: "HTTP development request completed",
});

export const REQUEST_LOG_FORMAT = ":method :url :status :response-time ms";

export const SECURITY_CONSTANTS = Object.freeze({
  JSON_BODY_LIMIT: "1mb",
  URL_ENCODED_BODY_LIMIT: "1mb",
  URL_ENCODED_PARAMETER_LIMIT: 1000,
  CORS_ALLOWED_METHODS: Object.freeze([
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ]),
  CORS_ALLOWED_HEADERS: Object.freeze([
    "Content-Type",
    "X-CSRF-Token",
    "x-csrf-token",
    "X-Requested-With",
  ]),
  CLOUDINARY_ASSET_ORIGINS: Object.freeze(["https://res.cloudinary.com"]),
  CLOUDINARY_API_ORIGINS: Object.freeze(["https://api.cloudinary.com"]),
  CSP_SELF: "'self'",
  CSP_NONE: "'none'",
  CSP_UNSAFE_INLINE: "'unsafe-inline'",
  CSP_DATA: "data:",
  CSP_BLOB: "blob:",
});

export const RATE_LIMIT_DEFAULTS = Object.freeze({
  GLOBAL_WINDOW_MS: 15 * 60 * 1000,
  GLOBAL_MAX: 300,
  AUTH_WINDOW_MS: 15 * 60 * 1000,
  AUTH_MAX: 10,
  EMAIL_TOKENS_WINDOW_MS: 60 * 60 * 1000,
  EMAIL_TOKENS_MAX: 5,
});

export const RATE_LIMIT_ENV_KEYS = Object.freeze({
  GLOBAL_WINDOW_MS: "RATE_LIMIT_GLOBAL_WINDOW_MS",
  GLOBAL_MAX: "RATE_LIMIT_GLOBAL_MAX",
  AUTH_WINDOW_MS: "RATE_LIMIT_AUTH_WINDOW_MS",
  AUTH_MAX: "RATE_LIMIT_AUTH_MAX",
  EMAIL_TOKENS_WINDOW_MS: "RATE_LIMIT_EMAIL_TOKENS_WINDOW_MS",
  EMAIL_TOKENS_MAX: "RATE_LIMIT_EMAIL_TOKENS_MAX",
});

export const RATE_LIMIT_NAMES = Object.freeze({
  GLOBAL: "global",
  AUTH: "auth",
  EMAIL_TOKENS: "emailTokens",
});

export const API_STATUS_CODES = Object.freeze({
  TOO_MANY_REQUESTS: 429,
});

export const API_MESSAGES_EXTENDED = Object.freeze({
  RATE_LIMITED: "Too many requests. Please try again later.",
  CORS_ORIGIN_NOT_ALLOWED: "Origin is not allowed.",
});
