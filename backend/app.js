import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import expressMongoSanitize from "express-mongo-sanitize";

import { corsMiddleware } from "./config/cors.js";
import { helmetMiddleware } from "./config/helmet.js";
import { requestLogger } from "./config/logger.js";
import { getEnv } from "./config/env.js";
import {
  SECURITY_CONSTANTS,
} from "./utils/constants.js";
import { attachRequestContext } from "./middlewares/attachRequestContext.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { rateLimitGlobal } from "./middlewares/rateLimiters.js";
import routes from "./routes/index.js";

getEnv();
const app = express();

app.use(helmetMiddleware());
app.use(compression());
app.use(corsMiddleware());
app.use(cookieParser());
app.use(express.json({ limit: SECURITY_CONSTANTS.JSON_BODY_LIMIT }));
app.use(
  express.urlencoded({
    extended: true,
    limit: SECURITY_CONSTANTS.URL_ENCODED_BODY_LIMIT,
    parameterLimit: SECURITY_CONSTANTS.URL_ENCODED_PARAMETER_LIMIT,
  })
);
app.use(expressMongoSanitize());
app.use(attachRequestContext);
app.use(requestLogger);
app.use(rateLimitGlobal);
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
