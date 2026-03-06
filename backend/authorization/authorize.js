import { createError } from "../utils/errorFactory.js";
import {
  API_MESSAGES,
  API_STATUS_CODES,
  ERROR_TYPES,
} from "../utils/constants.js";
import { predicates } from "./predicates.js";
import { PERMISSION_MATRIX } from "./permissions.js";

const SCOPE_CHECKS = Object.freeze({
  organization: ({ user, context }) =>
    predicates.isSameOrganization({ user, context }),
  department: ({ user, context }) =>
    predicates.isSameOrganization({ user, context }) &&
    predicates.isSameDepartment({ user, context }),
});

const OWNERSHIP_CHECKS = Object.freeze({
  self: ({ user, context }) => predicates.isSelf({ user, context }),
});

/**
 * Evaluates the centralized authorization matrix using OR semantics.
 *
 * @param {{ user: Record<string, unknown>, resource: string, action: string, context?: Record<string, unknown> }} options - Authorization inputs.
 * @returns {boolean} Whether any rule grants access.
 * @throws {never} This helper does not throw.
 */
export const evaluateAuthorization = ({
  user,
  resource,
  action,
  context = {},
}) => {
  const rules = PERMISSION_MATRIX[resource]?.[action] || [];

  return rules.some((rule) => {
    if (!rule.roles?.includes(user?.role)) {
      return false;
    }

    const predicateNames = rule.predicates || [];

    if (
      predicateNames.some((predicateName) => {
        const predicate = predicates[predicateName];
        return typeof predicate !== "function" || !predicate({ user, context });
      })
    ) {
      return false;
    }

    if (rule.scope) {
      const scopeCheck = SCOPE_CHECKS[rule.scope];

      if (typeof scopeCheck === "function" && !scopeCheck({ user, context })) {
        return false;
      }
    }

    if (rule.ownership) {
      const ownershipCheck = OWNERSHIP_CHECKS[rule.ownership];

      if (
        typeof ownershipCheck === "function" &&
        !ownershipCheck({ user, context })
      ) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Express middleware wrapper around the centralized authorization evaluator.
 *
 * @param {string} resource - Permission resource.
 * @param {string} action - Permission action.
 * @param {(req: import("express").Request) => Record<string, unknown>} [getContext] - Optional context resolver.
 * @returns {import("express").RequestHandler} Authorization middleware.
 * @throws {never} This helper does not throw.
 */
export const authorize = (resource, action, getContext) => (req, res, next) => {
  const context =
    typeof getContext === "function" ? getContext(req) : req.permissionContext || {};

  const allowed = evaluateAuthorization({
    user: req.user,
    resource,
    action,
    context,
  });

  if (!allowed) {
    next(
      createError({
        type: ERROR_TYPES.UNAUTHORIZED_ERROR,
        statusCode: API_STATUS_CODES.FORBIDDEN,
        message: API_MESSAGES.UNAUTHORIZED,
        details: [],
      })
    );
    return;
  }

  next();
};
