/**
 * @file Backend constants used across config, auth, routing, sockets, and scripts.
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

export const ROLE_VALUES = Object.freeze([
  "SuperAdmin",
  "Admin",
  "Manager",
  "User",
]);

export const ROLES = Object.freeze({
  SUPER_ADMIN: "SuperAdmin",
  ADMIN: "Admin",
  MANAGER: "Manager",
  USER: "User",
});

export const ORGANIZATION_SIZE_VALUES = Object.freeze([
  "Small",
  "Medium",
  "Large",
]);

export const TASK_STATUS_VALUES = Object.freeze([
  "TODO",
  "IN_PROGRESS",
  "PENDING_REVIEW",
  "COMPLETED",
]);

export const TASK_PRIORITY_VALUES = Object.freeze([
  "URGENT",
  "HIGH",
  "MEDIUM",
  "LOW",
]);

export const TASK_TYPE_VALUES = Object.freeze([
  "PROJECT",
  "ASSIGNED",
  "ROUTINE",
]);

export const ERROR_TYPES = Object.freeze({
  UNAUTHENTICATED_ERROR: "UNAUTHENTICATED_ERROR",
  UNAUTHORIZED_ERROR: "UNAUTHORIZED_ERROR",
  NOT_FOUND_ERROR: "NOT_FOUND_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CONFLICT_ERROR: "CONFLICT_ERROR",
  RATE_LIMITED_ERROR: "RATE_LIMITED_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
});

export const API_STATUS_CODES = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
});

export const STATUS_TO_ERROR_TYPE = Object.freeze({
  [API_STATUS_CODES.BAD_REQUEST]: ERROR_TYPES.VALIDATION_ERROR,
  [API_STATUS_CODES.UNAUTHORIZED]: ERROR_TYPES.UNAUTHENTICATED_ERROR,
  [API_STATUS_CODES.FORBIDDEN]: ERROR_TYPES.UNAUTHORIZED_ERROR,
  [API_STATUS_CODES.NOT_FOUND]: ERROR_TYPES.NOT_FOUND_ERROR,
  [API_STATUS_CODES.CONFLICT]: ERROR_TYPES.CONFLICT_ERROR,
  [API_STATUS_CODES.TOO_MANY_REQUESTS]: ERROR_TYPES.RATE_LIMITED_ERROR,
  [API_STATUS_CODES.INTERNAL_SERVER_ERROR]: ERROR_TYPES.INTERNAL_ERROR,
});

export const API_MESSAGES = Object.freeze({
  ROOT: "API is running.",
  CREATED: "Resource created successfully.",
  UPDATED: "Resource updated successfully.",
  DELETED: "Resource deleted successfully.",
  RESTORED: "Resource restored successfully.",
  VALIDATION_FAILED: "Validation failed.",
  LOGGED_OUT: "Session ended successfully.",
  REFRESHED: "Session refreshed successfully.",
  CSRF_ISSUED: "CSRF token issued successfully.",
  ENV_VALIDATION_FAILED: "Environment validation failed during startup.",
  INVALID_CSRF_TOKEN: "CSRF validation failed.",
  INVALID_CSRF_ORIGIN: "Request origin is not allowed.",
  INVALID_CREDENTIALS: "Invalid credentials.",
  UNAUTHENTICATED: "Authentication is required.",
  UNAUTHORIZED: "You do not have permission to perform this action.",
  NOT_FOUND: "Requested resource was not found.",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  RATE_LIMITED: "Too many requests. Please try again later.",
  CORS_ORIGIN_NOT_ALLOWED: "Origin is not allowed.",
  REFRESH_TOKEN_REUSED: "Refresh session is no longer valid.",
  REFRESH_TOKEN_EXPIRED: "Refresh session has expired.",
  SOCKET_NOT_INITIALIZED: "Socket server has not been attached.",
  PLATFORM_SEED_COMPLETED: "Platform seed completed successfully.",
  DEMO_SEED_COMPLETED: "Demo seed completed successfully.",
  WIPE_COMPLETED: "Non-platform data wipe completed successfully.",
  PURGE_COMPLETED: "Expired records purge completed successfully.",
});

export const ENV_DEFAULTS = Object.freeze({
  JWT_ACCESS_TTL_MINUTES: 15,
  JWT_REFRESH_TTL_DAYS: 7,
  EMAIL_VERIFICATION_TOKEN_TTL_MINUTES: 60,
  PASSWORD_RESET_TOKEN_TTL_MINUTES: 15,
  SET_PASSWORD_TOKEN_TTL_MINUTES: 1440,
  SOFT_DELETE_RETENTION_DAYS: 90,
});

export const PASSWORD_HISTORY_LIMIT = 5;

export const PASSWORD_POLICY_LIMITS = Object.freeze({
  DEVELOPMENT_MIN_LENGTH: 8,
  PRODUCTION_MIN_LENGTH: 12,
  HISTORY_LIMIT: PASSWORD_HISTORY_LIMIT,
});

export const COMMON_PASSWORD_BLOCKLIST = Object.freeze([
  "password",
  "password123",
  "admin123",
  "qwerty123",
  "letmein123",
  "123456789",
]);

export const BCRYPT_SALT_ROUNDS = 12;

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
  SOCKET_CONNECTED: "Socket client connected",
  SOCKET_DISCONNECTED: "Socket client disconnected",
  SOCKET_AUTH_FAILED: "Socket client authentication failed",
});

export const REQUEST_LOG_FORMAT = ":method :url :status :response-time ms";

export const AUTH_COOKIE_NAMES = Object.freeze({
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  CSRF_TOKEN: "csrfToken",
});

export const AUTH_HEADER_NAMES = Object.freeze({
  CSRF: "x-csrf-token",
});

export const SECURITY_CONSTANTS = Object.freeze({
  REQUEST_ID_HEADER: "x-request-id",
  JSON_BODY_LIMIT: "1mb",
  URL_ENCODED_BODY_LIMIT: "1mb",
  URL_ENCODED_PARAMETER_LIMIT: 1000,
  STATE_CHANGING_METHODS: Object.freeze(["POST", "PUT", "PATCH", "DELETE"]),
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
  CORS_MAX_AGE_SECONDS: 86400,
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

export const PAGINATION_DEFAULTS = Object.freeze({
  PAGE: 1,
  PAGE_SIZE: 10,
});

export const SOCKET_ROOM_PREFIXES = Object.freeze({
  USER: "user",
  ORGANIZATION: "org",
  DEPARTMENT: "dept",
});

export const SOCKET_EVENT_NAMES = Object.freeze({
  TASK_CREATED: "task.created",
  TASK_UPDATED: "task.updated",
  TASK_DELETED: "task.deleted",
  TASK_RESTORED: "task.restored",
  TASK_STATUS_CHANGED: "task.statusChanged",
  TASK_ASSIGNEES_UPDATED: "task.assigneesUpdated",
  TASK_WATCHERS_UPDATED: "task.watchersUpdated",
  TASK_ACTIVITY_CREATED: "taskActivity.created",
  TASK_ACTIVITY_DELETED: "taskActivity.deleted",
  TASK_ACTIVITY_RESTORED: "taskActivity.restored",
  COMMENT_CREATED: "comment.created",
  COMMENT_UPDATED: "comment.updated",
  COMMENT_DELETED: "comment.deleted",
  COMMENT_RESTORED: "comment.restored",
  ATTACHMENT_CREATED: "attachment.created",
  ATTACHMENT_DELETED: "attachment.deleted",
  ATTACHMENT_RESTORED: "attachment.restored",
  MATERIAL_UPDATED: "material.updated",
  MATERIAL_RESTOCKED: "material.restocked",
  VENDOR_UPDATED: "vendor.updated",
  NOTIFICATION_CREATED: "notification.created",
  NOTIFICATION_READ: "notification.read",
  NOTIFICATION_READ_ALL: "notification.readAll",
  PRESENCE_UPDATED: "presence.updated",
});

export const PERMISSION_RESOURCES = Object.freeze({
  AUTH: "Auth",
  ORG: "Org",
  DEPARTMENT: "Department",
  USER: "User",
  TASK: "Task",
  TASK_ACTIVITY: "TaskActivity",
  COMMENT: "Comment",
  ATTACHMENT: "Attachment",
  MATERIAL: "Material",
  VENDOR: "Vendor",
  NOTIFICATION: "Notification",
  DASHBOARD: "Dashboard",
  SETTINGS: "Settings",
  PLATFORM: "Platform",
  SEARCH: "Search",
});

export const PERMISSION_ACTIONS = Object.freeze({
  CREATE: "C",
  READ: "R",
  UPDATE: "U",
  DELETE: "D",
  RESTORE: "RS",
  EXPORT: "X",
});

export const FILE_UPLOAD_CONSTRAINTS = Object.freeze({
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_EXTENSIONS: Object.freeze([
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".txt",
    ".mp4",
    ".mp3",
  ]),
});

export const MODEL_NAMES = Object.freeze({
  ORGANIZATION: "Organization",
  DEPARTMENT: "Department",
  USER: "User",
  REFRESH_TOKEN_SESSION: "RefreshTokenSession",
  ATTACHMENT: "Attachment",
  NOTIFICATION: "Notification",
});

export const SOFT_DELETE_MODEL_RETENTION = Object.freeze({
  CORE_MODELS: Object.freeze([
    MODEL_NAMES.ORGANIZATION,
    MODEL_NAMES.DEPARTMENT,
    MODEL_NAMES.USER,
  ]),
});

export const DEMO_SEED_DEFAULTS = Object.freeze({
  ORGANIZATION_NAME: "Demo Organization",
  ORGANIZATION_EMAIL: "demo-org@example.com",
  ORGANIZATION_PHONE: "+251900000000",
  ORGANIZATION_ADDRESS: "Demo Address, Addis Ababa",
  ORGANIZATION_DESCRIPTION: "Demo tenant for TaskManager foundation verification.",
  ORGANIZATION_INDUSTRY: "Technology",
  ORGANIZATION_SIZE: "Small",
  DEPARTMENT_NAME: "Operations",
  DEPARTMENT_DESCRIPTION: "Demo operations department",
  ADMIN_FIRST_NAME: "Demo",
  ADMIN_LAST_NAME: "Admin",
  ADMIN_POSITION: "Operations Lead",
  ADMIN_EMAIL: "demo-admin@example.com",
  ADMIN_PASSWORD: "12345678",
});
