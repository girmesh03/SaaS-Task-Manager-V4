import mongoose from "mongoose";

import { getEnv } from "./env.js";
import { logger } from "./logger.js";

/**
 * Connects Mongoose to MongoDB using validated env configuration.
 *
 * @returns {Promise<typeof mongoose>} Connected mongoose instance.
 * @throws {Error} Propagates connection failures with sanitized logging.
 */
export const connectDb = async () => {
  const { MONGODB_URI, NODE_ENV } = getEnv();

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: NODE_ENV !== "production",
    });

    logger.info("MongoDB connected successfully", {
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    });

    return mongoose;
  } catch (error) {
    logger.error("MongoDB connection failed", {
      message: error instanceof Error ? error.message : "Unknown database error",
    });
    throw error;
  }
};

/**
 * Gracefully disconnects Mongoose from MongoDB.
 *
 * @returns {Promise<void>} Disconnect completion.
 * @throws {Error} Propagates disconnect failures.
 */
export const disconnectDb = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
};
