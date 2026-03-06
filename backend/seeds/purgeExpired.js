import { connectDb, disconnectDb } from "../config/db.js";
import { getEnv } from "../config/env.js";
import Attachment from "../models/Attachment.js";
import Department from "../models/Department.js";
import Notification from "../models/Notification.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import { deleteCloudinaryAsset } from "../services/cloudinaryService.js";
import {
  API_MESSAGES,
  SOFT_DELETE_MODEL_RETENTION,
} from "../utils/constants.js";

/**
 * Purges expired notifications, expired attachments, and aged soft-deleted core records.
 *
 * @returns {Promise<{ message: string, notificationsPurged: number, attachmentsPurged: number, coreRecordsPurged: number, purgedModels: readonly string[] }>} Purge summary.
 * @throws {Error} Propagates purge failures.
 */
export const purgeExpired = async () => {
  const { SOFT_DELETE_RETENTION_DAYS } = getEnv();
  const now = new Date();
  const softDeleteCutoff = new Date(
    now.getTime() - SOFT_DELETE_RETENTION_DAYS * 24 * 60 * 60 * 1000
  );

  await connectDb();

  try {
    const expiredAttachments = await Attachment.find({
      expiresAt: { $lte: now },
    })
      .withDeleted()
      .exec();

    for (const attachment of expiredAttachments) {
      await deleteCloudinaryAsset({
        publicId: attachment.publicId,
        resourceType: attachment.resourceType,
      });
    }

    const attachmentResult = await Attachment.deleteMany({
      expiresAt: { $lte: now },
    });
    const notificationResult = await Notification.deleteMany({
      expiresAt: { $lte: now },
    });

    const organizationResult = await Organization.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: softDeleteCutoff },
    });
    const departmentResult = await Department.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: softDeleteCutoff },
    });
    const userResult = await User.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: softDeleteCutoff },
    });

    return {
      message: API_MESSAGES.PURGE_COMPLETED,
      notificationsPurged: notificationResult.deletedCount || 0,
      attachmentsPurged: attachmentResult.deletedCount || 0,
      coreRecordsPurged:
        (organizationResult.deletedCount || 0) +
        (departmentResult.deletedCount || 0) +
        (userResult.deletedCount || 0),
      purgedModels: SOFT_DELETE_MODEL_RETENTION.CORE_MODELS,
    };
  } finally {
    await disconnectDb();
  }
};
