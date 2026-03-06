import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import notFoundSvg from "../../assets/notFound_404.svg";

const getErrorDetails = (error) => {
  if (isRouteErrorResponse(error)) {
    return {
      title: error.status === 404 ? "Page Not Found" : "Route Error",
      message: error.data?.message || error.statusText || "Unable to load this page.",
      statusLabel: `${error.status}`,
    };
  }

  if (error instanceof Error) {
    return {
      title: "Route Error",
      message: error.message,
      statusLabel: error.name || "Error",
    };
  }

  return {
    title: "Route Error",
    message: "Unable to load this page.",
    statusLabel: "Error",
  };
};

/**
 * Route-level error renderer used by the router.
 *
 * @returns {JSX.Element} Route error UI.
 * @throws {never} This component does not throw.
 */
const RouteError = () => {
  const navigate = useNavigate();
  const routeError = useRouteError();
  const { title, message, statusLabel } = getErrorDetails(routeError);

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center" maxWidth={480}>
        <Box
          component="img"
          src={notFoundSvg}
          alt={title}
          sx={{
            width: "100%",
            maxWidth: 320,
            height: "auto",
          }}
        />
        <Typography variant="overline" color="text.secondary">
          {statusLabel}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
          <Button size="small" variant="outlined" onClick={() => navigate("/")}>
            Home
          </Button>
          <Button size="small" variant="text" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default RouteError;
