import { PAGINATION_DEFAULTS } from "./constants.js";

/**
 * Sends a canonical success envelope.
 *
 * @param {import("express").Response} res - Express response.
 * @param {object} options - Success options.
 * @param {string} options.message - Success message.
 * @param {string} [options.dataKey] - Resource payload key.
 * @param {unknown} [options.data] - Resource payload.
 * @param {object} [options.meta] - Optional metadata block.
 * @param {number} [options.statusCode=200] - HTTP status code.
 * @returns {import("express").Response} Express response.
 * @throws {never} This helper does not throw.
 */
export const sendSuccess = (
  res,
  { message, dataKey, data, meta, statusCode = 200 }
) => {
  const payload = {
    success: true,
    message,
  };

  if (dataKey) {
    payload[dataKey] = data;
  }

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

/**
 * Builds canonical pagination metadata.
 *
 * @param {object} options - Pagination options.
 * @param {number} [options.page=1] - Current page.
 * @param {number} [options.pageSize=10] - Current page size.
 * @param {number} [options.totalItems=0] - Total items.
 * @returns {{ pagination: { page: number, pageSize: number, totalItems: number, totalPages: number, hasNextPage: boolean, hasPreviousPage: boolean } }} Pagination metadata.
 * @throws {never} This helper does not throw.
 */
export const createPaginationMeta = ({
  page = PAGINATION_DEFAULTS.PAGE,
  pageSize = PAGINATION_DEFAULTS.PAGE_SIZE,
  totalItems = 0,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize) || 1);

  return {
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};
