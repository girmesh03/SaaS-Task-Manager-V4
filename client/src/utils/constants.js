/**
 * @file Frontend constants used across the client runtime.
 * @throws {never} Module initialization does not throw.
 */
export const APP_NAME = "TaskManager";

export const ROLE_VALUES = Object.freeze([
  "SuperAdmin",
  "Admin",
  "Manager",
  "User",
]);

export const ROLES = Object.freeze({
  SUPER_ADMIN: "SuperAdmin",
  ADMIN: "Admin",
  MANAGER: "Manager",
  USER: "User",
});

export const ORGANIZATION_SIZE_VALUES = Object.freeze([
  "Small",
  "Medium",
  "Large",
]);

export const TASK_STATUS_VALUES = Object.freeze([
  "TODO",
  "IN_PROGRESS",
  "PENDING_REVIEW",
  "COMPLETED",
]);

export const TASK_PRIORITY_VALUES = Object.freeze([
  "URGENT",
  "HIGH",
  "MEDIUM",
  "LOW",
]);

export const TASK_TYPE_VALUES = Object.freeze([
  "PROJECT",
  "ASSIGNED",
  "ROUTINE",
]);

export const PAGE_SIZE = 10;

export const LAYOUT_DIMENSIONS = Object.freeze({
  APP_BAR_HEIGHT_REM: 4,
  APP_BAR_HEIGHT_PX: 64,
  DASHBOARD_DRAWER_WIDTH_PX: 280,
  PUBLIC_DRAWER_WIDTH_PX: 260,
  MOBILE_BOTTOM_NAV_HEIGHT_PX: 64,
  MOBILE_FAB_SIZE_PX: 56,
});

export const LIST_VIEW_MODES = Object.freeze({
  GRID: "grid",
  CARDS: "cards",
});

export const THEME_MODE_VALUES = Object.freeze(["system", "light", "dark"]);

export const SOCKET_EVENT_NAMES = Object.freeze({
  TASK_CREATED: "task.created",
  TASK_UPDATED: "task.updated",
  TASK_DELETED: "task.deleted",
  TASK_RESTORED: "task.restored",
  TASK_STATUS_CHANGED: "task.statusChanged",
  TASK_ASSIGNEES_UPDATED: "task.assigneesUpdated",
  TASK_WATCHERS_UPDATED: "task.watchersUpdated",
  TASK_ACTIVITY_CREATED: "taskActivity.created",
  TASK_ACTIVITY_DELETED: "taskActivity.deleted",
  TASK_ACTIVITY_RESTORED: "taskActivity.restored",
  COMMENT_CREATED: "comment.created",
  COMMENT_UPDATED: "comment.updated",
  COMMENT_DELETED: "comment.deleted",
  COMMENT_RESTORED: "comment.restored",
  ATTACHMENT_CREATED: "attachment.created",
  ATTACHMENT_DELETED: "attachment.deleted",
  ATTACHMENT_RESTORED: "attachment.restored",
  MATERIAL_UPDATED: "material.updated",
  MATERIAL_RESTOCKED: "material.restocked",
  VENDOR_UPDATED: "vendor.updated",
  NOTIFICATION_CREATED: "notification.created",
  NOTIFICATION_READ: "notification.read",
  NOTIFICATION_READ_ALL: "notification.readAll",
  PRESENCE_UPDATED: "presence.updated",
});

export const FILE_UPLOAD_CONSTRAINTS = Object.freeze({
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_EXTENSIONS: Object.freeze([
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".txt",
    ".mp4",
    ".mp3",
  ]),
});

export const STATUS_LABELS = Object.freeze({
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  PENDING_REVIEW: "Pending Review",
  COMPLETED: "Completed",
});

export const PRIORITY_LABELS = Object.freeze({
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
});

export const TASK_TYPE_LABELS = Object.freeze({
  PROJECT: "Project Task",
  ASSIGNED: "Assigned Task",
  ROUTINE: "Routine Task",
});

export const ROLE_LABELS = Object.freeze({
  SuperAdmin: "SuperAdmin",
  Admin: "Admin",
  Manager: "Manager",
  User: "User",
});

export const STATUS_UI_TO_STORED = Object.freeze({
  "To Do": "TODO",
  "In Progress": "IN_PROGRESS",
  Review: "PENDING_REVIEW",
  Pending: "PENDING_REVIEW",
  Done: "COMPLETED",
  Completed: "COMPLETED",
});

export const PRIORITY_UI_TO_STORED = Object.freeze({
  Critical: "URGENT",
  Urgent: "URGENT",
  High: "HIGH",
  Medium: "MEDIUM",
  Low: "LOW",
});

export const BOTTOM_NAV_ITEMS = Object.freeze([
  {
    label: "Dashboard",
    value: "/dashboard",
  },
  {
    label: "Tasks",
    value: "/dashboard/tasks",
  },
  {
    label: "Users",
    value: "/dashboard/users",
  },
  {
    label: "Profile",
    value: "/dashboard/settings",
  },
]);

export const FOOTER_LINK_GROUPS = Object.freeze([
  {
    title: "Product",
    links: ["Features", "Integrations", "Pricing", "Changelog", "Docs"],
  },
  {
    title: "Company",
    links: ["Careers", "Blog", "Contact", "Partners"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"],
  },
]);

export const UI_PLACEHOLDERS = Object.freeze({
  TASK_BADGE_COUNT: 12,
  NOTIFICATION_BADGE_COUNT: 3,
  ORGANIZATION_SWITCHER_PAGE_SIZE: 5,
  GLOBAL_SEARCH_GROUPS: ["Departments", "Users", "Tasks", "Materials", "Vendors"],
  GLOBAL_SEARCH_RESULTS: Object.freeze([
    {
      group: "Tasks",
      items: [
        { id: "task-1", label: "Finish Phase 1 foundations", secondaryLabel: "TODO" },
        { id: "task-2", label: "Wire dashboard search", secondaryLabel: "IN_PROGRESS" },
      ],
    },
    {
      group: "Users",
      items: [{ id: "user-1", label: "Platform Admin", secondaryLabel: "SuperAdmin" }],
    },
  ]),
  NOTIFICATIONS: Object.freeze([
    {
      id: "notification-1",
      title: "Task updated",
      message: "Phase 1 foundations moved to review.",
      createdAt: "Today",
      unread: true,
    },
    {
      id: "notification-2",
      title: "Search placeholder ready",
      message: "Global search shell is available for later API wiring.",
      createdAt: "Yesterday",
      unread: false,
    },
  ]),
});
