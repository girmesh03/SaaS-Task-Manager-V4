import { createError } from "../utils/errorFactory.js";
import {
  API_MESSAGES,
  API_STATUS_CODES,
  ERROR_TYPES,
  ROLES,
} from "../utils/constants.js";

/**
 * Restricts a route to platform SuperAdmin actors only.
 *
 * @param {import("express").Request} req - Express request.
 * @param {import("express").Response} res - Express response.
 * @param {import("express").NextFunction} next - Express next callback.
 * @returns {void}
 * @throws {never} This middleware forwards authorization errors.
 */
export const requirePlatformSuperAdmin = (req, res, next) => {
  if (req.actor?.role === ROLES.SUPER_ADMIN && req.actor?.isPlatformOrgUser) {
    next();
    return;
  }

  next(
    createError({
      type: ERROR_TYPES.UNAUTHORIZED_ERROR,
      statusCode: API_STATUS_CODES.FORBIDDEN,
      message: API_MESSAGES.UNAUTHORIZED,
      details: [],
    })
  );
};
