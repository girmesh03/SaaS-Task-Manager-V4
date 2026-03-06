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
 * Validates the access-token cookie and attaches the authenticated user context.
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

    if (!claims.user?._id || !claims.organization?._id) {
      throwUnauthenticatedError();
    }

    req.user = {
      _id: String(claims.user?._id),
      organization: {
        _id: String(claims.organization?._id),
      },
      department: claims.department?._id
        ? {
            _id: String(claims.department._id),
          }
        : null,
      role: String(claims.role),
      isHod: Boolean(claims.isHod),
      isPlatformOrgUser: Boolean(claims.isPlatformOrgUser),
    };

    if (req.requestContext) {
      req.requestContext.user = req.user;
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
