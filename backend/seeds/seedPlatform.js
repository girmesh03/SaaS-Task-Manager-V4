import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

import { connectDb, disconnectDb } from "../config/db.js";
import { getEnv } from "../config/env.js";
import Department from "../models/Department.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import { runInTransaction } from "../utils/mongo.js";
import {
  API_MESSAGES,
  APP_NAME,
  BCRYPT_SALT_ROUNDS,
  ORGANIZATION_SIZE_VALUES,
  ROLES,
} from "../utils/constants.js";

/**
 * Idempotently seeds the platform organization, its initial department, and SuperAdmin.
 *
 * @returns {Promise<{ message: string, organization: { _id: string }, department: { _id: string }, user: { _id: string } }>} Seed summary.
 * @throws {Error} Propagates database and hashing failures.
 */
export const seedPlatform = async () => {
  const { PLATFORM_SEED } = getEnv();

  await connectDb();

  try {
    return await runInTransaction(async (session) => {
      let organization = await Organization.findOne({
        isPlatformOrg: true,
      })
        .withDeleted()
        .session(session);

      if (!organization) {
        organization = await Organization.create(
          [
            {
              name: PLATFORM_SEED.organizationName || APP_NAME,
              description: PLATFORM_SEED.organizationDescription || "",
              email: PLATFORM_SEED.organizationEmail || "",
              phone: PLATFORM_SEED.organizationPhone || "",
              address: PLATFORM_SEED.organizationAddress || "",
              size:
                PLATFORM_SEED.organizationSize || ORGANIZATION_SIZE_VALUES[0],
              industry: PLATFORM_SEED.organizationIndustry || "",
              isPlatformOrg: true,
              isActive: true,
            },
          ],
          { session }
        ).then((docs) => docs[0]);
      }

      let department = await Department.findOne({
        organization: organization._id,
        name: PLATFORM_SEED.departmentName || "Platform Administration",
      })
        .withDeleted()
        .session(session);

      if (!department) {
        department = await Department.create(
          [
            {
              organization: organization._id,
              name: PLATFORM_SEED.departmentName || "Platform Administration",
              description: PLATFORM_SEED.departmentDescription || "",
              isActive: true,
            },
          ],
          { session }
        ).then((docs) => docs[0]);
      }

      const passwordHash = await bcrypt.hash(
        PLATFORM_SEED.adminPassword || "12345678",
        BCRYPT_SALT_ROUNDS
      );
      let user = await User.findOne({
        email: PLATFORM_SEED.adminEmail || "platform-admin@example.com",
      })
        .withDeleted()
        .session(session);

      if (!user) {
        user = await User.create(
          [
            {
              organization: organization._id,
              department: department._id,
              firstName: PLATFORM_SEED.adminFirstName || "Platform",
              lastName: PLATFORM_SEED.adminLastName || "Admin",
              position: PLATFORM_SEED.adminPosition || "System Owner",
              email: PLATFORM_SEED.adminEmail || "platform-admin@example.com",
              role: PLATFORM_SEED.adminRole || ROLES.SUPER_ADMIN,
              isHod: true,
              isPlatformOrgUser: true,
              isVerified: true,
              isActive: true,
              passwordHash,
            },
          ],
          { session }
        ).then((docs) => docs[0]);
      }

      return {
        message: API_MESSAGES.PLATFORM_SEED_COMPLETED,
        organization: { _id: String(organization._id) },
        department: { _id: String(department._id) },
        user: { _id: String(user._id) },
      };
    });
  } finally {
    await disconnectDb();
  }
};

const currentFilePath = fileURLToPath(import.meta.url);
const isDirectExecution =
  Boolean(process.argv[1]) && path.resolve(process.argv[1]) === currentFilePath;

if (isDirectExecution) {
  seedPlatform()
    .then((result) => {
      console.info(JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : API_MESSAGES.INTERNAL_SERVER_ERROR);
      process.exit(1);
    });
}
