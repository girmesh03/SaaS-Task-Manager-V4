/**
 * @file Public layout with centered content and marketing footer.
 */
import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";

import { MuiAppIconLogo } from "../reusable/CustomIcons";
import { MuiThemeDropDown } from "../reusable";
import {
  APP_NAME,
  FOOTER_LINK_GROUPS,
  LAYOUT_DIMENSIONS,
} from "../../utils/constants";

const socialLinks = Object.freeze([
  { icon: GitHubIcon, label: "GitHub" },
  { icon: LinkedInIcon, label: "LinkedIn" },
  { icon: XIcon, label: "X" },
]);

/**
 * Public layout component with minimal header and structured footer.
 *
 * @returns {JSX.Element} Public layout element.
 * @throws {never} This component does not throw.
 */
const PublicLayout = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const [expandedGroup, setExpandedGroup] = useState(null);

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
            gap: 1,
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

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
            <MuiThemeDropDown />
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
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
            px: { xs: 2, sm: 3, md: 4 },
            py: 4,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Container maxWidth="lg">
            {isXs ? (
              <Stack spacing={2}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <MuiAppIconLogo />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {APP_NAME}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Enterprise task management for multi-tenant teams.
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {socialLinks.map((item) => (
                      <IconButton
                        key={item.label}
                        aria-label={item.label}
                        size="small"
                      >
                        <item.icon fontSize="small" />
                      </IconButton>
                    ))}
                  </Stack>
                </Stack>
                {FOOTER_LINK_GROUPS.map((group) => (
                  <Accordion
                    key={group.title}
                    expanded={expandedGroup === group.title}
                    onChange={() =>
                      setExpandedGroup((current) =>
                        current === group.title ? null : group.title
                      )
                    }
                    disableGutters
                    elevation={0}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {group.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={1}>
                        {group.links.map((linkLabel) => (
                          <Link
                            key={linkLabel}
                            component="button"
                            type="button"
                            color="text.secondary"
                            aria-disabled="true"
                            tabIndex={-1}
                          >
                            {linkLabel}
                          </Link>
                        ))}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}
                <Typography variant="body2" color="text.secondary" align="center">
                  Copyright {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={3}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <MuiAppIconLogo />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {APP_NAME}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        Enterprise task management for multi-tenant teams.
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {socialLinks.map((item) => (
                          <IconButton
                            key={item.label}
                            aria-label={item.label}
                            size="small"
                          >
                            <item.icon fontSize="small" />
                          </IconButton>
                        ))}
                      </Stack>
                    </Stack>
                  </Grid>
                  {FOOTER_LINK_GROUPS.map((group) => (
                    <Grid key={group.title} size={{ xs: 12, sm: 4, md: 2.66 }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {group.title}
                        </Typography>
                        {group.links.map((linkLabel) => (
                          <Link
                            key={linkLabel}
                            component="button"
                            type="button"
                            color="text.secondary"
                            aria-disabled="true"
                            tabIndex={-1}
                          >
                            {linkLabel}
                          </Link>
                        ))}
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
                <Divider />
                <Typography variant="body2" color="text.secondary" align="center">
                  Copyright {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                </Typography>
              </Stack>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default PublicLayout;
