import {
  ROLES,
} from "./constants";

export const permissionMatrix = Object.freeze({
  Org: {
    R: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER], scope: "organization" },
    ],
    U: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN], scope: "organization" },
    ],
  },
  Department: {
    C: [{ roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" }],
    R: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER], scope: "organization" },
    ],
    U: [{ roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" }],
    D: [{ roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" }],
    RS: [{ roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" }],
  },
  User: {
    C: [{ roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" }],
    R: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN, ROLES.MANAGER], scope: "organization" },
      { roles: [ROLES.USER], ownership: "self" },
    ],
    U: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN], scope: "organization" },
      { roles: [ROLES.USER], ownership: "self" },
    ],
    D: [{ roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" }],
    RS: [{ roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" }],
  },
  Task: {
    C: [{ roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER], scope: "organization" }],
    R: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER], scope: "organization" },
    ],
    U: [
      { roles: [ROLES.SUPER_ADMIN], predicates: ["hasViewingContext"] },
      { roles: [ROLES.ADMIN, ROLES.MANAGER], scope: "organization" },
    ],
    D: [{ roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER], scope: "organization" }],
    RS: [{ roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN], scope: "organization" }],
    X: [{ roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER], scope: "organization" }],
  },
  Settings: {
    R: [{ roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER], ownership: "self" }],
    U: [{ roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.USER], ownership: "self" }],
  },
  Platform: {
    R: [{ roles: [ROLES.SUPER_ADMIN], predicates: ["isPlatformSuperAdmin"] }],
    U: [{ roles: [ROLES.SUPER_ADMIN], predicates: ["isPlatformSuperAdmin"] }],
  },
});

export const authorizationPredicates = Object.freeze({
  isPlatformSuperAdmin: ({ actor }) =>
    Boolean(actor?.isPlatformOrgUser && actor?.role === ROLES.SUPER_ADMIN),
  hasViewingContext: ({ context }) => Boolean(context?.organizationId),
  isSameOrganization: ({ actor, context }) =>
    !context?.organizationId ||
    String(actor?.organizationId) === String(context.organizationId),
  isSameDepartment: ({ actor, context }) =>
    !context?.departmentId ||
    String(actor?.departmentId) === String(context.departmentId),
  isSelf: ({ actor, context }) =>
    !context?.userId || String(actor?.userId) === String(context.userId),
});
