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
  BCRYPT_SALT_ROUNDS,
  DEMO_SEED_DEFAULTS,
  ROLES,
} from "../utils/constants.js";

/**
 * Idempotently seeds a demo tenant in non-production environments.
 *
 * @returns {Promise<{ message: string, organization: { _id: string }, department: { _id: string }, user: { _id: string } }>} Seed summary.
 * @throws {Error} Propagates environment and persistence failures.
 */
export const seedDemo = async () => {
  const { IS_PRODUCTION } = getEnv();

  if (IS_PRODUCTION) {
    throw new Error("Demo seed is disabled in production.");
  }

  await connectDb();

  try {
    return await runInTransaction(async (session) => {
      let organization = await Organization.findOne({
        email: DEMO_SEED_DEFAULTS.ORGANIZATION_EMAIL,
      })
        .withDeleted()
        .session(session);

      if (!organization) {
        organization = await Organization.create(
          [
            {
              name: DEMO_SEED_DEFAULTS.ORGANIZATION_NAME,
              description: DEMO_SEED_DEFAULTS.ORGANIZATION_DESCRIPTION,
              email: DEMO_SEED_DEFAULTS.ORGANIZATION_EMAIL,
              phone: DEMO_SEED_DEFAULTS.ORGANIZATION_PHONE,
              address: DEMO_SEED_DEFAULTS.ORGANIZATION_ADDRESS,
              size: DEMO_SEED_DEFAULTS.ORGANIZATION_SIZE,
              industry: DEMO_SEED_DEFAULTS.ORGANIZATION_INDUSTRY,
              isPlatformOrg: false,
            },
          ],
          { session }
        ).then((docs) => docs[0]);
      }

      let department = await Department.findOne({
        organization: organization._id,
        name: DEMO_SEED_DEFAULTS.DEPARTMENT_NAME,
      })
        .withDeleted()
        .session(session);

      if (!department) {
        department = await Department.create(
          [
            {
              organization: organization._id,
              name: DEMO_SEED_DEFAULTS.DEPARTMENT_NAME,
              description: DEMO_SEED_DEFAULTS.DEPARTMENT_DESCRIPTION,
              isActive: true,
            },
          ],
          { session }
        ).then((docs) => docs[0]);
      }

      let user = await User.findOne({
        email: DEMO_SEED_DEFAULTS.ADMIN_EMAIL,
      })
        .withDeleted()
        .session(session);

      if (!user) {
        user = await User.create(
          [
            {
              organization: organization._id,
              department: department._id,
              firstName: DEMO_SEED_DEFAULTS.ADMIN_FIRST_NAME,
              lastName: DEMO_SEED_DEFAULTS.ADMIN_LAST_NAME,
              position: DEMO_SEED_DEFAULTS.ADMIN_POSITION,
              email: DEMO_SEED_DEFAULTS.ADMIN_EMAIL,
              role: ROLES.ADMIN,
              isHod: true,
              isPlatformOrgUser: false,
              isVerified: true,
              isActive: true,
              passwordHash: await bcrypt.hash(
                DEMO_SEED_DEFAULTS.ADMIN_PASSWORD,
                BCRYPT_SALT_ROUNDS
              ),
            },
          ],
          { session }
        ).then((docs) => docs[0]);
      }

      return {
        message: API_MESSAGES.DEMO_SEED_COMPLETED,
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
  seedDemo()
    .then((result) => {
      console.info(JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : API_MESSAGES.INTERNAL_SERVER_ERROR);
      process.exit(1);
    });
}
