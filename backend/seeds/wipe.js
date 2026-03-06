import { connectDb, disconnectDb } from "../config/db.js";
import Attachment from "../models/Attachment.js";
import Department from "../models/Department.js";
import Notification from "../models/Notification.js";
import Organization from "../models/Organization.js";
import RefreshTokenSession from "../models/RefreshTokenSession.js";
import User from "../models/User.js";
import { runInTransaction } from "../utils/mongo.js";
import { API_MESSAGES } from "../utils/constants.js";

/**
 * Wipes all non-platform data while preserving the platform tenant.
 *
 * @returns {Promise<{ message: string, deletedOrganizationCount: number }>} Wipe summary.
 * @throws {Error} Propagates persistence failures.
 */
export const wipeNonPlatformData = async () => {
  await connectDb();

  try {
    return await runInTransaction(async (session) => {
      const organizationIds = await Organization.find({
        isPlatformOrg: false,
      })
        .withDeleted()
        .select("_id")
        .session(session);
      const ids = organizationIds.map((item) => item._id);

      if (ids.length === 0) {
        return {
          message: API_MESSAGES.WIPE_COMPLETED,
          deletedOrganizationCount: 0,
        };
      }

      await Notification.deleteMany({ organizationId: { $in: ids } }).session(session);
      await Attachment.deleteMany({ organizationId: { $in: ids } }).session(session);
      await RefreshTokenSession.deleteMany({ organizationId: { $in: ids } }).session(
        session
      );
      await User.deleteMany({ organizationId: { $in: ids } }).session(session);
      await Department.deleteMany({ organizationId: { $in: ids } }).session(session);
      await Organization.deleteMany({ _id: { $in: ids } }).session(session);

      return {
        message: API_MESSAGES.WIPE_COMPLETED,
        deletedOrganizationCount: ids.length,
      };
    });
  } finally {
    await disconnectDb();
  }
};
