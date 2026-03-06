import { getEnv } from "../config/env.js";
import { logger } from "../config/logger.js";

/**
 * Deletes a Cloudinary asset by public id using the Admin API.
 *
 * @param {{ publicId: string, resourceType: "image" | "video" | "raw" }} options - Asset identity.
 * @returns {Promise<{ deleted: boolean, skipped?: boolean }>} Deletion result.
 * @throws {Error} Propagates remote API failures.
 */
export const deleteCloudinaryAsset = async ({ publicId, resourceType }) => {
  const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } =
    getEnv();

  if (
    [CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME].some(
      (value) => !value || value === "changeme"
    )
  ) {
    logger.warn("Skipping Cloudinary deletion because credentials are placeholders", {
      publicId,
      resourceType,
    });
    return { deleted: false, skipped: true };
  }

  const url = new URL(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/${resourceType}/upload`
  );
  url.searchParams.append("public_ids[]", publicId);

  const authHeader = Buffer.from(
    `${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`
  ).toString("base64");
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Basic ${authHeader}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Cloudinary delete failed: ${text}`);
  }

  return { deleted: true };
};
