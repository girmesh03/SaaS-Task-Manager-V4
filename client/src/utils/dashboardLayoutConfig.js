/**
 * @file Dashboard navigation configuration.
 */
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import StoreIcon from "@mui/icons-material/Store";
import SettingsIcon from "@mui/icons-material/Settings";

/**
 * Dashboard navigation sections with grouped menu items.
 */
export const DASHBOARD_NAV_SECTIONS = [
  {
    title: "Workspace",
    items: [
      {
        label: "Dashboard",
        Icon: DashboardIcon,
        to: "/dashboard",
        showBadge: false,
        requiresSuperAdmin: false,
      },
      {
        label: "Tasks",
        Icon: AssignmentIcon,
        to: "/dashboard/tasks",
        showBadge: true,
        requiresSuperAdmin: false,
      },
      {
        label: "Users",
        Icon: PeopleIcon,
        to: "/dashboard/users",
        showBadge: false,
        requiresSuperAdmin: false,
      },
    ],
  },
  {
    title: "Manage",
    items: [
      {
        label: "Departments",
        Icon: BusinessIcon,
        to: "/dashboard/departments",
        showBadge: false,
        requiresSuperAdmin: false,
      },
      {
        label: "Materials",
        Icon: InventoryIcon,
        to: "/dashboard/materials",
        showBadge: false,
        requiresSuperAdmin: false,
      },
      {
        label: "Vendors",
        Icon: StoreIcon,
        to: "/dashboard/vendors",
        showBadge: false,
        requiresSuperAdmin: false,
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        label: "Settings",
        Icon: SettingsIcon,
        to: "/dashboard/settings",
        showBadge: false,
        requiresSuperAdmin: false,
      },
    ],
  },
];
