import { ROLES } from "../utils/constants.js";

/**
 * Predicate catalog used by authorization checks.
 */
export const predicates = Object.freeze({
  isPlatformSuperAdmin: ({ actor }) =>
    Boolean(actor?.isPlatformOrgUser && actor?.role === ROLES.SUPER_ADMIN),
  isSameOrganization: ({ actor, context }) =>
    !context?.organizationId ||
    String(actor?.organizationId) === String(context.organizationId),
  isSameDepartment: ({ actor, context }) =>
    !context?.departmentId ||
    String(actor?.departmentId) === String(context.departmentId),
  isSelf: ({ actor, context }) =>
    !context?.userId || String(actor?.userId) === String(context.userId),
  isHod: ({ actor }) => Boolean(actor?.isHod),
  canIncludeDeleted: ({ actor }) =>
    [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(actor?.role),
  isEligibleDepartmentManager: ({ context }) =>
    [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(context?.role) &&
    Boolean(context?.isHod),
  hasViewingContext: ({ context }) => Boolean(context?.organizationId),
});
