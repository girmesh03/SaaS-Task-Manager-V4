/**
 * @file Public layout with centered content and minimal header.
 */
import { Outlet, useNavigate } from "react-router";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { MuiAppIconLogo } from "../reusable/CustomIcons";
import { MuiThemeDropDown } from "../reusable";
import { APP_NAME, LAYOUT_DIMENSIONS } from "../../utils/constants";

/**
 * Public layout component with minimal header and centered content area.
 *
 * @returns {JSX.Element} Public layout element.
 * @throws {never} This component does not throw.
 */
const PublicLayout = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar
          sx={{
            minHeight: `${LAYOUT_DIMENSIONS.APP_BAR_HEIGHT_PX}px !important`,
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <MuiAppIconLogo />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                display: { xs: "none", sm: "block" },
              }}
            >
              {APP_NAME}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="text"
              onClick={() => navigate("/login")}
              sx={{
                color: "text.primary",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/register")}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                boxShadow: "none",
              }}
            >
              Sign Up
            </Button>
            <MuiThemeDropDown />
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
            bgcolor: "background.default",
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Outlet />
          </Container>
        </Box>

        <Box
          component="footer"
          sx={{
            py: 2,
            px: 3,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ fontSize: "0.75rem" }}
          >
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PublicLayout;
