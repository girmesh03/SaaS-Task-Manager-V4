/**
 * @file User menu component for dashboard app bar.
 */
import { memo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import { useNavigate } from "react-router";

import { useAuth } from "../../hooks/useAuth";

/**
 * User menu component with account actions and optional platform tools.
 *
 * @param {{ user: { _id: string | null; fullName: string; email: string; avatarUrl: string } | null; isPlatformSuperAdmin?: boolean }} props - Component props.
 * @returns {JSX.Element} User menu element.
 * @throws {never} This component does not throw.
 */
const UserMenu = ({ user, isPlatformSuperAdmin = false }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((namePart) => namePart[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (to) => {
    handleClose();
    navigate(to);
  };

  return (
    <>
      <Tooltip title={user?.fullName || "User"}>
        <IconButton
          size="small"
          aria-label="User menu"
          sx={{ ml: 0.5 }}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <Avatar
            src={user?.avatarUrl || ""}
            alt={user?.fullName || "User"}
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              fontSize: "0.875rem",
            }}
          >
            {initials}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MenuItem onClick={() => handleNavigate("/dashboard/settings")}>
          <ListItemIcon>
            <PersonOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/dashboard/settings")}>
          <ListItemIcon>
            <SettingsRoundedIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        {isPlatformSuperAdmin ? (
          <MenuItem onClick={() => handleNavigate("/dashboard/settings")}>
            <ListItemIcon>
              <BusinessRoundedIcon fontSize="small" />
            </ListItemIcon>
            Organization Context
          </MenuItem>
        ) : null}
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose();
            void logout();
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default memo(UserMenu);
