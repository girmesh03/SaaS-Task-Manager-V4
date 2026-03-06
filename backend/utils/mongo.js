import mongoose from "mongoose";

/**
 * Runs work inside a MongoDB transaction.
 *
 * @template TResult
 * @param {(session: import("mongoose").ClientSession) => Promise<TResult>} fn - Transaction callback.
 * @param {{ session?: import("mongoose").ClientSession }} [options] - Transaction options.
 * @returns {Promise<TResult>} Transaction result.
 * @throws {Error} Propagates transaction failures.
 */
export const runInTransaction = async (fn, { session } = {}) => {
  if (session) {
    return fn(session);
  }

  const ownedSession = await mongoose.startSession();

  try {
    let result;

    await ownedSession.withTransaction(async () => {
      result = await fn(ownedSession);
    });

    return result;
  } finally {
    await ownedSession.endSession();
  }
};
