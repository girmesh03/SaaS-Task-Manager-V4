/**
 * @file Dashboard application layout shell.
 */
import { useMemo, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";

import {
  MuiBackdrop,
  MuiDialog,
  MuiEmptyState,
  MuiTextField,
} from "../reusable";
import {
  BOTTOM_NAV_ITEMS,
  LAYOUT_DIMENSIONS,
  ROLES,
  TASK_TYPE_LABELS,
  UI_PLACEHOLDERS,
} from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";
import { useSocketStatus } from "../../hooks/useSocketStatus";
import DashboardAppBar from "./DashboardAppBar";
import DashboardDrawer from "./DashboardDrawer";

const TITLE_BY_ROUTE = Object.freeze({
  "/dashboard": "Dashboard",
  "/dashboard/tasks": "Tasks",
  "/dashboard/users": "Users",
  "/dashboard/departments": "Departments",
  "/dashboard/materials": "Materials",
  "/dashboard/vendors": "Vendors",
  "/dashboard/settings": "Settings",
});

/**
 * Dashboard route layout with app bar, drawer, dialogs, and mobile bottom navigation.
 *
 * @returns {JSX.Element} Dashboard layout element.
 * @throws {never} This component does not throw.
 */
const DashboardLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();
  const { user: currentUser } = useAuth();
  const socketStatus = useSocketStatus();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const isNavigating = navigation.state !== "idle";
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));

  const appBarUser = useMemo(
    () => ({
      _id: currentUser?._id || null,
      fullName: currentUser?.fullName || "Workspace User",
      email: currentUser?.email || "workspace@example.com",
      avatarUrl: currentUser?.avatarUrl || "",
    }),
    [currentUser]
  );

  const currentTitle =
    Object.entries(TITLE_BY_ROUTE)
      .sort(([leftRoute], [rightRoute]) => rightRoute.length - leftRoute.length)
      .find(([route]) => location.pathname.startsWith(route))?.[1] || "Workspace";

  const currentBottomNavValue =
    BOTTOM_NAV_ITEMS.find((item) => location.pathname.startsWith(item.value))
      ?.value || "/dashboard";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <DashboardAppBar
        title={currentTitle}
        onOpenDrawer={() => setMobileDrawerOpen((previous) => !previous)}
        onOpenSearch={() => setSearchOpen(true)}
        unreadCount={UI_PLACEHOLDERS.NOTIFICATION_BADGE_COUNT}
        notificationsDisabled={false}
        onViewAllNotifications={() => navigate("/dashboard/settings")}
        user={appBarUser}
        isPlatformSuperAdmin={Boolean(
          currentUser?.role === ROLES.SUPER_ADMIN && currentUser?.isPlatformOrgUser
        )}
        isConnected={socketStatus.isConnected}
      />

      <DashboardDrawer
        mobileOpen={mobileDrawerOpen}
        onMobileClose={() => setMobileDrawerOpen(false)}
        onNavigate={() => setMobileDrawerOpen(false)}
        isSuperAdmin={Boolean(currentUser?.role === ROLES.SUPER_ADMIN)}
      />

      <Box
        component="main"
        sx={{
          ml: { md: `${LAYOUT_DIMENSIONS.DASHBOARD_DRAWER_WIDTH_PX}px` },
          mt: `${LAYOUT_DIMENSIONS.APP_BAR_HEIGHT_REM}rem`,
          minHeight: `calc(100vh - ${LAYOUT_DIMENSIONS.APP_BAR_HEIGHT_REM}rem)`,
          overflowY: "auto",
          px: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            pt: 2,
            pb: {
              xs: isXs ? LAYOUT_DIMENSIONS.MOBILE_BOTTOM_NAV_HEIGHT_PX + 40 : 3,
              md: 3,
            },
          }}
        >
          {isNavigating ? <MuiBackdrop open={isNavigating} /> : null}
          <Outlet />
        </Box>
      </Box>

      {isXs ? (
        <>
          <Fab
            color="primary"
            aria-label="Create task"
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              position: "fixed",
              bottom: LAYOUT_DIMENSIONS.MOBILE_BOTTOM_NAV_HEIGHT_PX - 28,
              left: "50%",
              transform: "translateX(-50%)",
              width: LAYOUT_DIMENSIONS.MOBILE_FAB_SIZE_PX,
              height: LAYOUT_DIMENSIONS.MOBILE_FAB_SIZE_PX,
              zIndex: (muiTheme) => muiTheme.zIndex.appBar + 2,
            }}
          >
            <AddRoundedIcon />
          </Fab>
          <Paper
            elevation={8}
            sx={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: (muiTheme) => muiTheme.zIndex.appBar + 1,
            }}
          >
            <BottomNavigation
              value={currentBottomNavValue}
              onChange={(event, nextValue) => navigate(nextValue)}
              showLabels
            >
              <BottomNavigationAction
                label={BOTTOM_NAV_ITEMS[0].label}
                value={BOTTOM_NAV_ITEMS[0].value}
                icon={<DashboardOutlinedIcon />}
              />
              <BottomNavigationAction
                label={BOTTOM_NAV_ITEMS[1].label}
                value={BOTTOM_NAV_ITEMS[1].value}
                icon={<AssignmentTurnedInOutlinedIcon />}
              />
              <BottomNavigationAction
                label={BOTTOM_NAV_ITEMS[2].label}
                value={BOTTOM_NAV_ITEMS[2].value}
                icon={<PeopleOutlineRoundedIcon />}
              />
              <BottomNavigationAction
                label={BOTTOM_NAV_ITEMS[3].label}
                value={BOTTOM_NAV_ITEMS[3].value}
                icon={<PersonOutlineRoundedIcon />}
              />
            </BottomNavigation>
          </Paper>
        </>
      ) : null}

      <MuiDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Global Search"
        actions={
          <Button size="small" variant="contained" onClick={() => setSearchOpen(false)}>
            Close
          </Button>
        }
      >
        <Stack spacing={2}>
          <MuiTextField
            label="Search"
            placeholder="Search departments, users, tasks, materials, vendors"
          />
          {UI_PLACEHOLDERS.GLOBAL_SEARCH_RESULTS.map((group) => (
            <Box key={group.group}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                {group.group}
              </Typography>
              <Stack spacing={1}>
                {group.items.map((item) => (
                  <Paper
                    key={item.id}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.secondaryLabel}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </MuiDialog>

      <MuiDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        title="Create Task"
        actions={
          <Button
            size="small"
            variant="contained"
            onClick={() => setCreateDialogOpen(false)}
          >
            Close
          </Button>
        }
      >
        <MuiEmptyState
          message="Task creation shell is ready"
          secondaryMessage="Choose a task type here in Phase 1. Full task forms arrive in Phase 2."
        />
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          {Object.values(TASK_TYPE_LABELS).map((label) => (
            <Button key={label} size="small" variant="outlined">
              {label}
            </Button>
          ))}
        </Stack>
      </MuiDialog>
    </Box>
  );
};

export default DashboardLayout;
