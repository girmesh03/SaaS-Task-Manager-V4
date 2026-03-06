import express from "express";

import { getEnv } from "./config/env.js";
import {
  API_MESSAGES,
  ERROR_TYPES,
  STATUS_TO_ERROR_TYPE,
} from "./utils/constants.js";
import routes from "./routes/index.js";

const { IS_DEVELOPMENT } = getEnv();
const app = express();

app.use("/api", routes);

app.use((req, res, next) => {
  const error = new Error(API_MESSAGES.NOT_FOUND);
  error.status = 404;
  error.statusCode = 404;
  error.type = ERROR_TYPES.NOT_FOUND_ERROR;
  error.details = [];
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || API_MESSAGES.INTERNAL_SERVER_ERROR;
  const errorType =
    err.type || STATUS_TO_ERROR_TYPE[statusCode] || ERROR_TYPES.INTERNAL_ERROR;
  const details = Array.isArray(err.details) ? err.details : [];

  res.status(statusCode).json({
    success: false,
    message: message,
    error: {
      type: errorType,
      statusCode,
    },
    details,
    ...(IS_DEVELOPMENT && { stack: err.stack }),
  });
});

export default app;
