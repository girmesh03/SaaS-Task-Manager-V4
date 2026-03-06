import { validationResult } from "express-validator";

import { createError } from "../utils/errorFactory.js";
import {
  API_MESSAGES,
  API_STATUS_CODES,
  ERROR_TYPES,
} from "../utils/constants.js";

/**
 * Runs a validator chain and returns canonical validation envelopes on failure.
 *
 * @param {import("express-validator").ValidationChain[] | import("express").RequestHandler | import("express").RequestHandler[]} validations - Validation handlers.
 * @returns {import("express").RequestHandler[]} Express middleware chain.
 * @throws {never} This helper does not throw.
 */
export const validateRequest = (validations = []) => {
  const validationChain = Array.isArray(validations) ? validations : [validations];

  return [
    ...validationChain,
    (req, res, next) => {
      const result = validationResult(req);

      if (result.isEmpty()) {
        next();
        return;
      }

      next(
        createError({
          type: ERROR_TYPES.VALIDATION_ERROR,
          statusCode: API_STATUS_CODES.BAD_REQUEST,
          message: API_MESSAGES.VALIDATION_FAILED,
          details: result.array().map((issue) => ({
            field: issue.type === "field" ? issue.path : "request",
            message: issue.msg,
            value: issue.value,
          })),
        })
      );
    },
  ];
};
