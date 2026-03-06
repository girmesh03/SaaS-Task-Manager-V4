import helmet from "helmet";

import { getEnv } from "./env.js";
import { SECURITY_CONSTANTS } from "../utils/constants.js";

/**
 * Helmet middleware configured with a CSP that allows required Cloudinary origins.
 *
 * @returns {import("express").RequestHandler} Helmet middleware.
 * @throws {never} This factory does not intentionally throw after env validation succeeds.
 */
export const helmetMiddleware = () => {
  const { CORS_ALLOWED_ORIGINS, IS_PRODUCTION } = getEnv();
  const directives = {
    defaultSrc: [SECURITY_CONSTANTS.CSP_SELF],
    baseUri: [SECURITY_CONSTANTS.CSP_SELF],
    connectSrc: [
      SECURITY_CONSTANTS.CSP_SELF,
      ...CORS_ALLOWED_ORIGINS,
      ...SECURITY_CONSTANTS.CLOUDINARY_API_ORIGINS,
      ...SECURITY_CONSTANTS.CLOUDINARY_ASSET_ORIGINS,
    ],
    imgSrc: [
      SECURITY_CONSTANTS.CSP_SELF,
      SECURITY_CONSTANTS.CSP_DATA,
      SECURITY_CONSTANTS.CSP_BLOB,
      ...SECURITY_CONSTANTS.CLOUDINARY_ASSET_ORIGINS,
    ],
    mediaSrc: [
      SECURITY_CONSTANTS.CSP_SELF,
      SECURITY_CONSTANTS.CSP_BLOB,
      ...SECURITY_CONSTANTS.CLOUDINARY_ASSET_ORIGINS,
    ],
    objectSrc: [SECURITY_CONSTANTS.CSP_NONE],
    scriptSrc: [SECURITY_CONSTANTS.CSP_SELF],
    styleSrc: [
      SECURITY_CONSTANTS.CSP_SELF,
      SECURITY_CONSTANTS.CSP_UNSAFE_INLINE,
    ],
    frameAncestors: [SECURITY_CONSTANTS.CSP_NONE],
    formAction: [
      SECURITY_CONSTANTS.CSP_SELF,
      ...SECURITY_CONSTANTS.CLOUDINARY_API_ORIGINS,
    ],
  };

  if (IS_PRODUCTION) {
    directives.upgradeInsecureRequests = [];
  }

  return helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives,
    },
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  });
};
