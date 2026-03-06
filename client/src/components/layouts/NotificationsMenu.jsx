/**
 * @file Notifications menu component for dashboard app bar.
 */
import { memo, useState } from "react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { UI_PLACEHOLDERS } from "../../utils/constants";

/**
 * Notifications menu component with placeholder dropdown content.
 *
 * @param {{ unreadCount: number; disabled?: boolean; onViewAll?: () => void }} props - Component props.
 * @returns {JSX.Element} Notifications menu element.
 * @throws {never} This component does not throw.
 */
const NotificationsMenu = ({
  unreadCount = 0,
  disabled = false,
  onViewAll,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <Box>
      <Tooltip title="Notifications">
        <IconButton
          size="small"
          aria-label="View notifications"
          disabled={disabled}
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{ color: "text.secondary" }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        slotProps={{
          paper: {
            sx: {
              width: 320,
              maxWidth: "calc(100vw - 24px)",
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Placeholder dropdown wired for later notification endpoints.
          </Typography>
        </Box>
        <Divider />
        <List disablePadding>
          {UI_PLACEHOLDERS.NOTIFICATIONS.map((notification) => (
            <ListItemButton key={notification.id} sx={{ alignItems: "flex-start" }}>
              <ListItemText
                primary={notification.title}
                secondary={`${notification.message} • ${notification.createdAt}`}
                primaryTypographyProps={{
                  fontWeight: notification.unread ? 700 : 500,
                }}
                secondaryTypographyProps={{
                  sx: { display: "block", mt: 0.5 },
                }}
              />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <Box sx={{ px: 2, py: 1.5 }}>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            onClick={() => {
              setAnchorEl(null);
              onViewAll?.();
            }}
          >
            View All
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default memo(NotificationsMenu);
