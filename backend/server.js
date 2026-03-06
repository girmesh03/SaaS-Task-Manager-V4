import http from "http";

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

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`${APP_NAME} API listening on port ${PORT}`);
});
