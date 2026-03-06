import cors from "cors";

import { getEnv } from "./env.js";
import {
  API_MESSAGES,
  ERROR_TYPES,
  SECURITY_CONSTANTS,
} from "../utils/constants.js";

/**
 * Credentialed CORS middleware restricted to configured origins.
 *
 * @returns {import("express").RequestHandler} CORS middleware.
 * @throws {never} This factory does not intentionally throw after env validation succeeds.
 */
export const corsMiddleware = () => {
  const { CORS_ALLOWED_ORIGINS, IS_PRODUCTION } = getEnv();

  return cors({
    credentials: true,
    methods: SECURITY_CONSTANTS.CORS_ALLOWED_METHODS,
    allowedHeaders: SECURITY_CONSTANTS.CORS_ALLOWED_HEADERS,
    maxAge: IS_PRODUCTION ? SECURITY_CONSTANTS.CORS_MAX_AGE_SECONDS : undefined,
    origin(origin, callback) {
      if (!origin || CORS_ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }

      const error = new Error(API_MESSAGES.CORS_ORIGIN_NOT_ALLOWED);
      error.status = 403;
      error.statusCode = 403;
      error.type = ERROR_TYPES.UNAUTHORIZED_ERROR;
      error.details = [
        {
          field: "origin",
          message: API_MESSAGES.CORS_ORIGIN_NOT_ALLOWED,
        },
      ];
      callback(error);
    },
    optionsSuccessStatus: 204,
  });
};
