import {
  API_MESSAGES,
  API_STATUS_CODES,
  ERROR_TYPES,
} from "./constants.js";

class AppError extends Error {
  /**
   * @param {object} options - Error options.
   * @param {string} options.type - Canonical error type.
   * @param {number} options.statusCode - HTTP status code.
   * @param {string} options.message - Error message.
   * @param {Array<Record<string, unknown>>} [options.details=[]] - Field or domain details.
   */
  constructor({ type, statusCode, message, details = [] }) {
    super(message);
    this.name = "AppError";
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Creates a canonical application error instance.
 *
 * @param {object} options - Error options.
 * @param {string} options.type - Canonical error type.
 * @param {number} options.statusCode - HTTP status code.
 * @param {string} options.message - Human-readable message.
 * @param {Array<Record<string, unknown>>} [options.details=[]] - UI-ready detail items.
 * @returns {AppError} Canonical application error.
 * @throws {never} This helper does not throw.
 */
export const createError = ({ type, statusCode, message, details = [] }) =>
  new AppError({ type, statusCode, message, details });

/**
 * Throws a canonical validation error.
 *
 * @param {Array<Record<string, unknown>>} details - Validation detail items.
 * @throws {AppError} Always throws a validation error.
 */
export const throwValidationError = (details) => {
  throw createError({
    type: ERROR_TYPES.VALIDATION_ERROR,
    statusCode: API_STATUS_CODES.BAD_REQUEST,
    message: API_MESSAGES.VALIDATION_FAILED,
    details,
  });
};

/**
 * Throws a canonical unauthenticated error.
 *
 * @param {string} [message=API_MESSAGES.UNAUTHENTICATED] - Optional override message.
 * @throws {AppError} Always throws an unauthenticated error.
 */
export const throwUnauthenticatedError = (
  message = API_MESSAGES.UNAUTHENTICATED
) => {
  throw createError({
    type: ERROR_TYPES.UNAUTHENTICATED_ERROR,
    statusCode: API_STATUS_CODES.UNAUTHORIZED,
    message,
  });
};

/**
 * Throws a canonical unauthorized error.
 *
 * @param {string} [message=API_MESSAGES.UNAUTHORIZED] - Optional override message.
 * @param {Array<Record<string, unknown>>} [details=[]] - Optional details.
 * @throws {AppError} Always throws an unauthorized error.
 */
export const throwUnauthorizedError = (
  message = API_MESSAGES.UNAUTHORIZED,
  details = []
) => {
  throw createError({
    type: ERROR_TYPES.UNAUTHORIZED_ERROR,
    statusCode: API_STATUS_CODES.FORBIDDEN,
    message,
    details,
  });
};

/**
 * Throws a canonical not-found error.
 *
 * @param {string} [message=API_MESSAGES.NOT_FOUND] - Optional override message.
 * @throws {AppError} Always throws a not-found error.
 */
export const throwNotFoundError = (message = API_MESSAGES.NOT_FOUND) => {
  throw createError({
    type: ERROR_TYPES.NOT_FOUND_ERROR,
    statusCode: API_STATUS_CODES.NOT_FOUND,
    message,
  });
};

/**
 * Throws a canonical conflict error.
 *
 * @param {string} [message=API_MESSAGES.UNAUTHORIZED] - Optional override message.
 * @param {Array<Record<string, unknown>>} [details=[]] - Optional details.
 * @throws {AppError} Always throws a conflict error.
 */
export const throwConflictError = (
  message = "The requested operation conflicts with the current state.",
  details = []
) => {
  throw createError({
    type: ERROR_TYPES.CONFLICT_ERROR,
    statusCode: API_STATUS_CODES.CONFLICT,
    message,
    details,
  });
};

/**
 * Throws a canonical rate-limited error.
 *
 * @param {string} [message=API_MESSAGES.RATE_LIMITED] - Optional override message.
 * @throws {AppError} Always throws a rate-limited error.
 */
export const throwRateLimitedError = (
  message = API_MESSAGES.RATE_LIMITED
) => {
  throw createError({
    type: ERROR_TYPES.RATE_LIMITED_ERROR,
    statusCode: API_STATUS_CODES.TOO_MANY_REQUESTS,
    message,
  });
};

/**
 * Throws a canonical internal error.
 *
 * @param {string} [message=API_MESSAGES.INTERNAL_SERVER_ERROR] - Optional override message.
 * @throws {AppError} Always throws an internal error.
 */
export const throwInternalError = (
  message = API_MESSAGES.INTERNAL_SERVER_ERROR
) => {
  throw createError({
    type: ERROR_TYPES.INTERNAL_ERROR,
    statusCode: API_STATUS_CODES.INTERNAL_SERVER_ERROR,
    message,
  });
};

export { AppError };
