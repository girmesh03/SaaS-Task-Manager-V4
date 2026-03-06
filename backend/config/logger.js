import winston from "winston";

import { getEnv } from "./env.js";
import {
  APP_NAME,
  HTTP_LOG_MESSAGES,
  LOG_LEVELS,
  LOG_REDACTION_FIELDS,
  LOG_REDACTION_PLACEHOLDER,
  REQUEST_LOG_FORMAT,
} from "../utils/constants.js";

const { IS_DEVELOPMENT, NODE_ENV } = getEnv();

const isSensitiveKey = (key) => {
  if (typeof key !== "string") {
    return false;
  }

  return LOG_REDACTION_FIELDS.some(
    (sensitiveKey) => sensitiveKey.toLowerCase() === key.toLowerCase()
  );
};

const redactValue = (key, value) => {
  if (isSensitiveKey(key)) {
    return LOG_REDACTION_PLACEHOLDER;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(key, item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([nestedKey, nestedValue]) => [
        nestedKey,
        redactValue(nestedKey, nestedValue),
      ])
    );
  }

  return value;
};

/**
 * Shared backend logger.
 *
 * @type {import("winston").Logger}
 */
export const logger = winston.createLogger({
  level: IS_DEVELOPMENT ? LOG_LEVELS.DEVELOPMENT : LOG_LEVELS.DEFAULT,
  defaultMeta: {
    service: APP_NAME,
    environment: NODE_ENV,
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

const devMorgan =
  IS_DEVELOPMENT && (await import("morgan")).default(REQUEST_LOG_FORMAT, {
    stream: {
      write: (message) => {
        logger.debug(HTTP_LOG_MESSAGES.DEV_REQUEST_COMPLETED, {
          category: "http.dev",
          summary: message.trim(),
        });
      },
    },
  });

/**
 * Request logging middleware with redaction in all environments and Morgan summaries in development.
 *
 * @param {import("express").Request} req - Express request.
 * @param {import("express").Response} res - Express response.
 * @param {import("express").NextFunction} next - Express next callback.
 * @returns {void}
 * @throws {never} This middleware does not intentionally throw.
 */
export const requestLogger = (req, res, next) => {
  const startedAt = process.hrtime.bigint();
  let hasLogged = false;

  const logRequest = () => {
    if (hasLogged) {
      return;
    }

    hasLogged = true;

    logger.info(HTTP_LOG_MESSAGES.REQUEST_COMPLETED, {
      category: "http",
      request: {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        query: redactValue("query", req.query),
        headers: redactValue("headers", req.headers),
        body: redactValue("body", req.body),
      },
      response: {
        statusCode: res.statusCode,
      },
      userAgent: req.get("user-agent") || null,
      durationMs: Number(process.hrtime.bigint() - startedAt) / 1_000_000,
    });
  };

  res.on("finish", logRequest);
  res.on("close", logRequest);

  if (devMorgan) {
    devMorgan(req, res, next);
    return;
  }

  next();
};
