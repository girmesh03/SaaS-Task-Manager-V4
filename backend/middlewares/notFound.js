import { createError } from "../utils/errorFactory.js";
import {
  API_MESSAGES,
  API_STATUS_CODES,
  ERROR_TYPES,
} from "../utils/constants.js";

/**
 * Generates a canonical not-found error for unknown routes.
 *
 * @param {import("express").Request} req - Express request.
 * @param {import("express").Response} res - Express response.
 * @param {import("express").NextFunction} next - Express next callback.
 * @returns {void}
 * @throws {never} This middleware does not throw.
 */
export const notFound = (req, res, next) => {
  next(
    createError({
      type: ERROR_TYPES.NOT_FOUND_ERROR,
      statusCode: API_STATUS_CODES.NOT_FOUND,
      message: API_MESSAGES.NOT_FOUND,
      details: [],
    })
  );
};
