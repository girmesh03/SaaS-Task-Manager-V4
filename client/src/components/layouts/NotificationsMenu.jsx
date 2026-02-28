/**
 * @file Notifications menu component for dashboard app bar.
 */
import { memo } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import NotificationsIcon from "@mui/icons-material/Notifications";

/**
 * Notifications menu component with badge count.
 *
 * @param {{ unreadCount: number; disabled?: boolean }} props - Component props.
 * @returns {JSX.Element} Notifications menu element.
 * @throws {never} This component does not throw.
 */
const NotificationsMenu = ({ unreadCount = 0, disabled = false }) => {
  return (
    <Tooltip title="Notifications">
      <IconButton
        size="small"
        aria-label="View notifications"
        disabled={disabled}
        sx={{ color: "text.secondary" }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon fontSize="small" />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default memo(NotificationsMenu);
