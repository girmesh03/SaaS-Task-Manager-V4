/**
 * @file User menu component for dashboard app bar.
 */
import { memo } from "react";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

/**
 * User menu component with avatar.
 *
 * @param {{ user: { id: string | null; fullName: string; email: string; avatarUrl: string } | null }} props - Component props.
 * @returns {JSX.Element} User menu element.
 * @throws {never} This component does not throw.
 */
const UserMenu = ({ user }) => {
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <Tooltip title={user?.fullName || "User"}>
      <IconButton size="small" aria-label="User menu" sx={{ ml: 0.5 }}>
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
  );
};

export default memo(UserMenu);
