import crypto from "crypto";

import { SECURITY_CONSTANTS } from "../utils/constants.js";

/**
 * Attaches a per-request context used by logging, authorization, and responses.
 *
 * @param {import("express").Request} req - Express request.
 * @param {import("express").Response} res - Express response.
 * @param {import("express").NextFunction} next - Express next callback.
 * @returns {void}
 * @throws {never} This middleware does not throw.
 */
export const attachRequestContext = (req, res, next) => {
  const requestId = crypto.randomUUID();

  req.requestContext = {
    requestId,
    startedAt: new Date().toISOString(),
  };

  res.setHeader(SECURITY_CONSTANTS.REQUEST_ID_HEADER, requestId);
  next();
};
