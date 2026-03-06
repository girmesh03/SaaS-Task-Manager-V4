import { useMemo } from "react";

import { useAuth } from "./useAuth";
import {
  authorizationPredicates,
  permissionMatrix,
} from "../utils/authorization";

const scopeChecks = Object.freeze({
  organization: ({ user, context }) =>
    authorizationPredicates.isSameOrganization({ user, context }),
  department: ({ user, context }) =>
    authorizationPredicates.isSameOrganization({ user, context }) &&
    authorizationPredicates.isSameDepartment({ user, context }),
});

const ownershipChecks = Object.freeze({
  self: ({ user, context }) =>
    authorizationPredicates.isSelf({ user, context }),
});

/**
 * Evaluates the mirrored frontend authorization matrix for UI gating.
 *
 * @returns {{ can: (resource: string, action: string, context?: Record<string, unknown>) => boolean, whyNot: (resource: string, action: string, context?: Record<string, unknown>) => string | null }} UI authorization helpers.
 * @throws {never} This hook does not throw.
 */
export const useAuthorization = () => {
  const { user } = useAuth();

  return useMemo(
    () => ({
      can(resource, action, context = {}) {
        const rules = permissionMatrix[resource]?.[action] || [];

        return rules.some((rule) => {
          if (!rule.roles?.includes(user?.role)) {
            return false;
          }

          if (
            (rule.predicates || []).some((predicateName) => {
              const predicate = authorizationPredicates[predicateName];
              return typeof predicate !== "function" || !predicate({ user, context });
            })
          ) {
            return false;
          }

          if (
            rule.scope &&
            typeof scopeChecks[rule.scope] === "function" &&
            !scopeChecks[rule.scope]({ user, context })
          ) {
            return false;
          }

          if (
            rule.ownership &&
            typeof ownershipChecks[rule.ownership] === "function" &&
            !ownershipChecks[rule.ownership]({ user, context })
          ) {
            return false;
          }

          return true;
        });
      },
      whyNot(resource, action, context = {}) {
        const rules = permissionMatrix[resource]?.[action] || [];
        const allowed = rules.some((rule) => {
          if (!rule.roles?.includes(user?.role)) {
            return false;
          }

          if (
            (rule.predicates || []).some((predicateName) => {
              const predicate = authorizationPredicates[predicateName];
              return typeof predicate !== "function" || !predicate({ user, context });
            })
          ) {
            return false;
          }

          if (
            rule.scope &&
            typeof scopeChecks[rule.scope] === "function" &&
            !scopeChecks[rule.scope]({ user, context })
          ) {
            return false;
          }

          if (
            rule.ownership &&
            typeof ownershipChecks[rule.ownership] === "function" &&
            !ownershipChecks[rule.ownership]({ user, context })
          ) {
            return false;
          }

          return true;
        });

        return allowed
          ? null
          : "You do not have permission to do that.";
      },
    }),
    [user]
  );
};
