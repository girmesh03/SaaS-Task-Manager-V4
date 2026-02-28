/**
 * @file Dashboard application layout shell.
 */
import { useState } from "react";
import { Outlet, useNavigation } from "react-router";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MuiBackdrop } from "../reusable";
import { LAYOUT_DIMENSIONS, APP_NAME } from "../../utils/constants";
import DashboardAppBar from "./DashboardAppBar";
import DashboardDrawer from "./DashboardDrawer";

/**
 * Dashboard route layout with app bar, drawer, and mobile bottom navigation.
 *
 * @returns {JSX.Element} Dashboard layout element.
 * @throws {never} This component does not throw.
 */
const DashboardLayout = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";

  const isBelow768 = useMediaQuery("(max-width:767.95px)");

  const toggleMobileDrawer = () => setMobileDrawerOpen((prev) => !prev);
  const handleDrawerNavigate = () => setMobileDrawerOpen(false);

  // Placeholder data - will be replaced with actual data from context/API
  const mockUser = {
    id: "1",
    fullName: "User Name",
    email: "user@example.com",
    avatarUrl: "",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <DashboardAppBar
        title={APP_NAME}
        onOpenDrawer={toggleMobileDrawer}
        onOpenSearch={() => {}}
        unreadCount={3}
        notificationsDisabled={false}
        user={mockUser}
      />

      <DashboardDrawer
        mobileOpen={mobileDrawerOpen}
        onMobileClose={() => setMobileDrawerOpen(false)}
        onNavigate={handleDrawerNavigate}
        isSuperAdmin={false}
      />

      <Box
        component="main"
        sx={{
          ml: { md: `${LAYOUT_DIMENSIONS.DASHBOARD_DRAWER_WIDTH_PX}px` },
          mt: `${LAYOUT_DIMENSIONS.APP_BAR_HEIGHT_REM}rem`,
          height: `calc(100vh - ${LAYOUT_DIMENSIONS.APP_BAR_HEIGHT_REM}rem)`,
          maxHeight: `calc(100vh - ${LAYOUT_DIMENSIONS.APP_BAR_HEIGHT_REM}rem)`,
          overflowY: "auto",
          px: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            pt: 2,
            pb: {
              xs: isBelow768
                ? LAYOUT_DIMENSIONS.MOBILE_BOTTOM_NAV_HEIGHT_PX + 24
                : 3,
              md: 3,
            },
          }}
        >
          {isNavigating && <MuiBackdrop open={isNavigating} />}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
