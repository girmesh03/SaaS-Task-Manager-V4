import Box from "@mui/material/Box";
import CheckIcon from "@mui/icons-material/Check";

/**
 * Brand icon/logo used in public and dashboard shells.
 *
 * @returns {JSX.Element} Brand icon element.
 * @throws {never} This component does not throw.
 */
export const MuiAppIconLogo = () => {
  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "primary.contrastText",
        bgcolor: "primary.main",
        boxShadow: 2,
        flexShrink: 0,
      }}
    >
      <CheckIcon sx={{ fontSize: 20 }} />
    </Box>
  );
};
