import { useMemo } from "react";

import { useAuth } from "./useAuth";
import {
  authorizationPredicates,
  permissionMatrix,
} from "../utils/authorization";

const scopeChecks = Object.freeze({
  organization: ({ actor, context }) =>
    authorizationPredicates.isSameOrganization({ actor, context }),
  department: ({ actor, context }) =>
    authorizationPredicates.isSameOrganization({ actor, context }) &&
    authorizationPredicates.isSameDepartment({ actor, context }),
});

const ownershipChecks = Object.freeze({
  self: ({ actor, context }) =>
    authorizationPredicates.isSelf({ actor, context }),
});

/**
 * Evaluates the mirrored frontend authorization matrix for UI gating.
 *
 * @returns {{ can: (resource: string, action: string, context?: Record<string, unknown>) => boolean, whyNot: (resource: string, action: string, context?: Record<string, unknown>) => string | null }} UI authorization helpers.
 * @throws {never} This hook does not throw.
 */
export const useAuthorization = () => {
  const { actor } = useAuth();

  return useMemo(
    () => ({
      can(resource, action, context = {}) {
        const rules = permissionMatrix[resource]?.[action] || [];

        return rules.some((rule) => {
          if (!rule.roles?.includes(actor?.role)) {
            return false;
          }

          if (
            (rule.predicates || []).some((predicateName) => {
              const predicate = authorizationPredicates[predicateName];
              return typeof predicate !== "function" || !predicate({ actor, context });
            })
          ) {
            return false;
          }

          if (
            rule.scope &&
            typeof scopeChecks[rule.scope] === "function" &&
            !scopeChecks[rule.scope]({ actor, context })
          ) {
            return false;
          }

          if (
            rule.ownership &&
            typeof ownershipChecks[rule.ownership] === "function" &&
            !ownershipChecks[rule.ownership]({ actor, context })
          ) {
            return false;
          }

          return true;
        });
      },
      whyNot(resource, action, context = {}) {
        const rules = permissionMatrix[resource]?.[action] || [];
        const allowed = rules.some((rule) => {
          if (!rule.roles?.includes(actor?.role)) {
            return false;
          }

          if (
            (rule.predicates || []).some((predicateName) => {
              const predicate = authorizationPredicates[predicateName];
              return typeof predicate !== "function" || !predicate({ actor, context });
            })
          ) {
            return false;
          }

          if (
            rule.scope &&
            typeof scopeChecks[rule.scope] === "function" &&
            !scopeChecks[rule.scope]({ actor, context })
          ) {
            return false;
          }

          if (
            rule.ownership &&
            typeof ownershipChecks[rule.ownership] === "function" &&
            !ownershipChecks[rule.ownership]({ actor, context })
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
    [actor]
  );
};
