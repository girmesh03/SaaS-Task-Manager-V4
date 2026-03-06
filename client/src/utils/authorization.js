/**
 * @file Frontend authorization matrix and predicate helpers.
 */
import {
  PERMISSION_ACTIONS,
  PERMISSION_RESOURCES,
  ROLES,
} from "./constants";

export const permissionMatrix = Object.freeze({
  [PERMISSION_RESOURCES.ORG]: {
    [PERMISSION_ACTIONS.READ]: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.UPDATE]: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN], scope: "organization" },
    ],
  },
  [PERMISSION_RESOURCES.DEPARTMENT]: {
    [PERMISSION_ACTIONS.CREATE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.READ]: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.UPDATE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.DELETE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.RESTORE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" },
    ],
  },
  [PERMISSION_RESOURCES.USER]: {
    [PERMISSION_ACTIONS.CREATE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.READ]: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN, ROLES.MANAGER], scope: "organization" },
      { roles: [ROLES.USER], ownership: "self" },
    ],
    [PERMISSION_ACTIONS.UPDATE]: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN], scope: "organization" },
      { roles: [ROLES.USER], ownership: "self" },
    ],
    [PERMISSION_ACTIONS.DELETE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.RESTORE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" },
    ],
  },
  [PERMISSION_RESOURCES.TASK]: {
    [PERMISSION_ACTIONS.CREATE]: [
      {
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        scope: "organization",
      },
    ],
    [PERMISSION_ACTIONS.READ]: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.UPDATE]: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN, ROLES.MANAGER], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.DELETE]: [
      {
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        scope: "organization",
      },
    ],
    [PERMISSION_ACTIONS.RESTORE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.EXPORT]: [
      {
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        scope: "organization",
      },
    ],
  },
  [PERMISSION_RESOURCES.COMMENT]: {
    [PERMISSION_ACTIONS.CREATE]: [
      {
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
        scope: "organization",
      },
    ],
    [PERMISSION_ACTIONS.READ]: [
      {
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
        scope: "organization",
      },
    ],
    [PERMISSION_ACTIONS.UPDATE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER], scope: "organization" },
      { roles: [ROLES.USER], ownership: "self" },
    ],
    [PERMISSION_ACTIONS.DELETE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER], scope: "organization" },
      { roles: [ROLES.USER], ownership: "self" },
    ],
    [PERMISSION_ACTIONS.RESTORE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER], scope: "organization" },
    ],
  },
  [PERMISSION_RESOURCES.ATTACHMENT]: {
    [PERMISSION_ACTIONS.CREATE]: [
      {
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
        scope: "organization",
      },
    ],
    [PERMISSION_ACTIONS.READ]: [
      {
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
        scope: "organization",
      },
    ],
    [PERMISSION_ACTIONS.DELETE]: [
      {
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
        scope: "organization",
      },
    ],
    [PERMISSION_ACTIONS.RESTORE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER], scope: "organization" },
    ],
  },
  [PERMISSION_RESOURCES.MATERIAL]: {
    [PERMISSION_ACTIONS.CREATE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.READ]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.UPDATE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.DELETE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.RESTORE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" },
    ],
  },
  [PERMISSION_RESOURCES.VENDOR]: {
    [PERMISSION_ACTIONS.CREATE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.READ]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.UPDATE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.DELETE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.RESTORE]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" },
    ],
  },
  [PERMISSION_RESOURCES.NOTIFICATION]: {
    [PERMISSION_ACTIONS.READ]: [
      {
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
        ownership: "self",
      },
    ],
    [PERMISSION_ACTIONS.UPDATE]: [
      {
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
        ownership: "self",
      },
    ],
  },
  [PERMISSION_RESOURCES.DASHBOARD]: {
    [PERMISSION_ACTIONS.READ]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER], scope: "organization" },
    ],
    [PERMISSION_ACTIONS.EXPORT]: [
      { roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER], scope: "organization" },
    ],
  },
  [PERMISSION_RESOURCES.SETTINGS]: {
    [PERMISSION_ACTIONS.READ]: [
      {
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
        ownership: "self",
      },
    ],
    [PERMISSION_ACTIONS.UPDATE]: [
      {
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
        ownership: "self",
      },
    ],
  },
  [PERMISSION_RESOURCES.PLATFORM]: {
    [PERMISSION_ACTIONS.READ]: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["isPlatformSuperAdmin"] },
    ],
    [PERMISSION_ACTIONS.UPDATE]: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["isPlatformSuperAdmin"] },
    ],
  },
  [PERMISSION_RESOURCES.SEARCH]: {
    [PERMISSION_ACTIONS.READ]: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER], scope: "organization" },
    ],
  },
});

export const authorizationPredicates = Object.freeze({
  isPlatformSuperAdmin: ({ user }) =>
    Boolean(user?.isPlatformOrgUser && user?.role === ROLES.SUPER_ADMIN),
  hasViewingContext: ({ context }) => Boolean(context?.organization?._id),
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
});
