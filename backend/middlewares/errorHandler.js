import mongoose from "mongoose";

import { getEnv } from "../config/env.js";
import { logger } from "../config/logger.js";
import {
  API_MESSAGES,
  API_STATUS_CODES,
  ERROR_TYPES,
  STATUS_TO_ERROR_TYPE,
} from "../utils/constants.js";

/**
 * Formats all backend errors into the canonical API envelope.
 *
 * @param {unknown} err - Error value.
 * @param {import("express").Request} req - Express request.
 * @param {import("express").Response} res - Express response.
 * @param {import("express").NextFunction} next - Express next callback.
 * @returns {import("express").Response} Express response.
 * @throws {never} This middleware does not rethrow.
 */
export const errorHandler = (err, req, res, next) => {
  const { IS_DEVELOPMENT } = getEnv();
  let statusCode =
    err && typeof err === "object" && "statusCode" in err
      ? Number(err.statusCode)
      : err && typeof err === "object" && "status" in err
      ? Number(err.status)
      : API_STATUS_CODES.INTERNAL_SERVER_ERROR;
  let type =
    err && typeof err === "object" && "type" in err
      ? String(err.type)
      : STATUS_TO_ERROR_TYPE[statusCode] || ERROR_TYPES.INTERNAL_ERROR;
  let message =
    err instanceof Error && err.message
      ? err.message
      : API_MESSAGES.INTERNAL_SERVER_ERROR;
  let details =
    err && typeof err === "object" && Array.isArray(err.details) ? err.details : [];

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = API_STATUS_CODES.BAD_REQUEST;
    type = ERROR_TYPES.VALIDATION_ERROR;
    message = "Validation failed.";
    details = Object.values(err.errors).map((issue) => ({
      field: issue.path,
      message: issue.message,
      value: issue.value,
    }));
  } else if (
    err &&
    typeof err === "object" &&
    "code" in err &&
    Number(err.code) === 11000
  ) {
    statusCode = API_STATUS_CODES.CONFLICT;
    type = ERROR_TYPES.CONFLICT_ERROR;
    message = "A unique field value already exists.";
    details = Object.keys(err.keyPattern || {}).map((field) => ({
      field,
      message: `${field} must be unique.`,
    }));
  }

  logger.error("HTTP request failed", {
    requestId: req.requestContext?.requestId,
    path: req.originalUrl,
    method: req.method,
    statusCode,
    type,
    message,
    details,
  });

  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      type,
      statusCode,
    },
    details,
    ...(IS_DEVELOPMENT &&
      err instanceof Error && {
        stack: err.stack,
      }),
  });
};
