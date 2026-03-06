/**
 * @file HTTP server bootstrap, database lifecycle, and graceful shutdown wiring.
 */
import http from "http";

import { attachSocketServer } from "./config/socket.js";
import { connectDb, disconnectDb } from "./config/db.js";
import { getEnv, loadEnv } from "./config/env.js";
import { API_MESSAGES } from "./utils/constants.js";

try {
  loadEnv();
} catch (error) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : API_MESSAGES.ENV_VALIDATION_FAILED;

  console.error(errorMessage);
  process.exit(1);
}

const { default: app } = await import("./app.js");
const { PORT, APP_NAME } = getEnv();

try {
  await connectDb();
} catch (error) {
  const errorMessage =
    error instanceof Error ? error.message : API_MESSAGES.INTERNAL_SERVER_ERROR;

  console.error(errorMessage);
  process.exit(1);
}

const server = http.createServer(app);
attachSocketServer(server);

server.on("error", async (error) => {
  const errorMessage =
    error instanceof Error ? error.message : API_MESSAGES.INTERNAL_SERVER_ERROR;

  console.error(errorMessage);
  await disconnectDb();
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`${APP_NAME} API listening on port ${PORT}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully.`);

  server.close(async () => {
    await disconnectDb();
    process.exit(0);
  });
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
