/**
 * @file Dashboard app bar (title + global search + theme + notifications + user menu).
 */
import { memo } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { MuiThemeDropDown } from "../reusable";
import { LAYOUT_DIMENSIONS } from "../../utils/constants";
import NotificationsMenu from "./NotificationsMenu";
import UserMenu from "./UserMenu";

/**
 * Dashboard app bar component.
 *
 * @param {{
 *   title: string;
 *   onOpenDrawer: () => void;
 *   onOpenSearch: () => void;
 *   unreadCount: number;
 *   notificationsDisabled?: boolean;
 *   user: {
 *     id: string | null;
 *     fullName: string;
 *     email: string;
 *     avatarUrl: string;
 *   } | null;
 * }} props - Component props.
 * @returns {JSX.Element} Rendered app bar.
 * @throws {never} This component does not throw.
 */
const DashboardAppBar = ({
  title,
  onOpenDrawer,
  onOpenSearch,
  unreadCount,
  notificationsDisabled = false,
  user,
}) => {
  const isBelow768 = useMediaQuery("(max-width:767.95px)");

  const bellUnreadCount = notificationsDisabled ? 0 : unreadCount;

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        height: LAYOUT_DIMENSIONS.APP_BAR_HEIGHT_PX,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        width: {
          md: `calc(100% - ${LAYOUT_DIMENSIONS.DASHBOARD_DRAWER_WIDTH_PX}px)`,
        },
        ml: { md: `${LAYOUT_DIMENSIONS.DASHBOARD_DRAWER_WIDTH_PX}px` },
      }}
    >
      <Toolbar
        sx={{
          minHeight: `${LAYOUT_DIMENSIONS.APP_BAR_HEIGHT_REM}rem`,
          gap: 1.5,
        }}
      >
        <IconButton
          edge="start"
          onClick={onOpenDrawer}
          aria-label="Open sidebar"
          sx={{ display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 700, minWidth: 120 }}>
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {isBelow768 ? (
          <Tooltip title="Global search">
            <IconButton
              size="small"
              aria-label="Open global search"
              onClick={onOpenSearch}
            >
              <SearchOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            size="small"
            variant="outlined"
            startIcon={<SearchOutlinedIcon fontSize="small" />}
            onClick={onOpenSearch}
          >
            Global Search
          </Button>
        )}

        <MuiThemeDropDown />

        <NotificationsMenu
          unreadCount={bellUnreadCount}
          disabled={notificationsDisabled}
        />

        <UserMenu
          user={{
            id: user?.id || null,
            fullName: user?.fullName || "",
            email: user?.email || "",
            avatarUrl: user?.avatarUrl || "",
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default memo(DashboardAppBar);
