/**
 * @file Frontend constants used by the client runtime.
 * @throws {never} Module initialization does not throw.
 */
export const APP_NAME = "TaskManager";

/**
 * Shared layout dimensions used by dashboard/public shells.
 */
export const LAYOUT_DIMENSIONS = {
  APP_BAR_HEIGHT_REM: 4,
  APP_BAR_HEIGHT_PX: 64,
  DASHBOARD_DRAWER_WIDTH_PX: 280,
  PUBLIC_DRAWER_WIDTH_PX: 260,
  MOBILE_BOTTOM_NAV_HEIGHT_PX: 56,
  MOBILE_FAB_SIZE_PX: 56,
};

/**
 * Placeholder values for pre-final-phase UI scaffolds.
 */
export const UI_PLACEHOLDERS = {
  TASK_BADGE_COUNT: 12,
  NOTIFICATION_BADGE_COUNT: 3,
  ORGANIZATION_SWITCHER_PAGE_SIZE: 5,
  GLOBAL_SEARCH_GROUPS: [
    "Departments",
    "Users",
    "Tasks",
    "Materials",
    "Vendors",
  ],
};
