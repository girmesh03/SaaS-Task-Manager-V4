import {
  createError,
  throwUnauthenticatedError,
} from "../utils/errorFactory.js";
import {
  API_MESSAGES,
  API_STATUS_CODES,
  AUTH_COOKIE_NAMES,
  ERROR_TYPES,
} from "../utils/constants.js";
import { verifyAccessToken } from "../services/tokenService.js";

/**
 * Validates the access-token cookie and attaches the authenticated actor context.
 *
 * @param {import("express").Request} req - Express request.
 * @param {import("express").Response} res - Express response.
 * @param {import("express").NextFunction} next - Express next callback.
 * @returns {void}
 * @throws {never} This middleware forwards auth errors to the error handler.
 */
export const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAMES.ACCESS_TOKEN];

    if (!token) {
      throwUnauthenticatedError();
    }

    const claims = verifyAccessToken(token);

    req.actor = {
      userId: String(claims.userId),
      organizationId: String(claims.organizationId),
      departmentId: claims.departmentId ? String(claims.departmentId) : null,
      role: String(claims.role),
      isHod: Boolean(claims.isHod),
      isPlatformOrgUser: Boolean(claims.isPlatformOrgUser),
    };

    if (req.requestContext) {
      req.requestContext.actor = req.actor;
    }

    next();
  } catch {
    next(
      createError({
        type: ERROR_TYPES.UNAUTHENTICATED_ERROR,
        statusCode: API_STATUS_CODES.UNAUTHORIZED,
        message: API_MESSAGES.UNAUTHENTICATED,
        details: [],
      })
    );
  }
};
