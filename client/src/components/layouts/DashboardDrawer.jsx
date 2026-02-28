/**
 * @file Dashboard drawer (sidebar navigation).
 */
import { memo, useMemo } from "react";
import { NavLink, useLocation } from "react-router";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MuiAppIconLogo } from "../reusable/CustomIcons";
import {
  APP_NAME,
  LAYOUT_DIMENSIONS,
  UI_PLACEHOLDERS,
} from "../../utils/constants";
import { DASHBOARD_NAV_SECTIONS } from "../../utils/dashboardLayoutConfig";

/**
 * Dashboard drawer component.
 *
 * @param {{
 *   mobileOpen: boolean;
 *   onMobileClose: () => void;
 *   onNavigate: () => void;
 *   isSuperAdmin: boolean;
 * }} props - Component props.
 * @returns {JSX.Element} Rendered drawer(s).
 * @throws {never} This component does not throw.
 */
const DashboardDrawer = ({
  mobileOpen,
  onMobileClose,
  onNavigate,
  isSuperAdmin,
}) => {
  const location = useLocation();

  const sections = useMemo(() => {
    return DASHBOARD_NAV_SECTIONS.map((section) => ({
      ...section,
      items: (section.items || []).filter(
        (item) => !item.requiresSuperAdmin || isSuperAdmin
      ),
    })).filter((section) => (section.items || []).length > 0);
  }, [isSuperAdmin]);

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          px: 2,
          py: 2,
          minHeight: `${LAYOUT_DIMENSIONS.APP_BAR_HEIGHT_PX}px`,
        }}
      >
        <MuiAppIconLogo />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          {APP_NAME}
        </Typography>
      </Stack>

      <Divider />

      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 2 }}>
        {sections.map((section, sectionIndex) => (
          <List
            key={section.title}
            disablePadding
            subheader={
              <ListSubheader
                component="div"
                sx={{
                  bgcolor: "transparent",
                  lineHeight: "28px",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  color: "text.disabled",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  px: 0,
                  py: 0.5,
                  mb: 0.5,
                }}
              >
                {section.title}
              </ListSubheader>
            }
            sx={{
              py: 0,
              mb: sectionIndex < sections.length - 1 ? 1 : 0,
            }}
          >
            {(section.items || []).map((item) => {
              const pathname = location.pathname || "";
              const isSelected =
                item.to === "/dashboard"
                  ? pathname === item.to
                  : pathname.startsWith(item.to);

              return (
                <ListItem key={item.label} disablePadding sx={{ mb: 0.25 }}>
                  <ListItemButton
                    component={NavLink}
                    to={item.to}
                    selected={isSelected}
                    onClick={onNavigate}
                    sx={{
                      borderRadius: 1,
                      py: 1,
                      px: 1.5,
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                      "&.Mui-selected": {
                        bgcolor: "action.selected",
                        "&:hover": {
                          bgcolor: "action.selected",
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 36,
                        color: isSelected ? "primary.main" : "text.secondary",
                      }}
                    >
                      <item.Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: isSelected ? 600 : 500,
                              color: isSelected
                                ? "text.primary"
                                : "text.secondary",
                            }}
                          >
                            {item.label}
                          </Typography>
                          {item.showBadge ? (
                            <Box
                              component="span"
                              sx={{
                                px: 0.75,
                                py: 0.25,
                                borderRadius: 999,
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                fontSize: "0.6875rem",
                                fontWeight: 700,
                                lineHeight: 1.2,
                                minWidth: 20,
                                textAlign: "center",
                              }}
                            >
                              {UI_PLACEHOLDERS.TASK_BADGE_COUNT}
                            </Box>
                          ) : null}
                        </Stack>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          width: LAYOUT_DIMENSIONS.DASHBOARD_DRAWER_WIDTH_PX,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: LAYOUT_DIMENSIONS.DASHBOARD_DRAWER_WIDTH_PX,
            boxSizing: "border-box",
            borderRight: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: LAYOUT_DIMENSIONS.DASHBOARD_DRAWER_WIDTH_PX,
            boxSizing: "border-box",
            bgcolor: "background.paper",
            backgroundImage: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default memo(DashboardDrawer);
