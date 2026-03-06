import { ROLES } from "../utils/constants.js";

/**
 * Predicate catalog used by authorization checks.
 */
export const predicates = Object.freeze({
  isPlatformSuperAdmin: ({ user }) =>
    Boolean(user?.isPlatformOrgUser && user?.role === ROLES.SUPER_ADMIN),
  isSameOrganization: ({ user, context }) =>
    !context?.organization?._id ||
    String(user?.organization?._id) === String(context.organization._id),
  isSameDepartment: ({ user, context }) =>
    !context?.department?._id ||
    String(user?.department?._id) === String(context.department._id),
  isSelf: ({ user, context }) =>
    !context?.user?._id || String(user?._id) === String(context.user._id),
  isHod: ({ user }) => Boolean(user?.isHod),
  canIncludeDeleted: ({ user }) =>
    [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(user?.role),
  isEligibleDepartmentManager: ({ context }) =>
    [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(context?.role) &&
    Boolean(context?.isHod),
  hasViewingContext: ({ context }) => Boolean(context?.organization?._id),
});
