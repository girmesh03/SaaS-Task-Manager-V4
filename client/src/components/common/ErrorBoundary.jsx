/**
 * @file Global client-side error boundary wrapper.
 */
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const deriveErrorType = (error) => {
  if (error && typeof error === "object") {
    return error.error?.type || error.name || "UnknownError";
  }

  return "UnknownError";
};

/**
 * Boundary fallback content.
 *
 * @param {{ error: unknown; resetErrorBoundary: () => void }} props - Fallback props.
 * @returns {JSX.Element} Fallback UI.
 */
const Fallback = ({ error, resetErrorBoundary }) => {
  const message = error instanceof Error ? error.message : "Unexpected error";
  const errorType = deriveErrorType(error);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Stack spacing={1.5} alignItems="center" textAlign="center">
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Something went wrong
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {errorType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="contained" onClick={resetErrorBoundary}>
            Try Again
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => window.location.assign("/")}
          >
            Home
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

/**
 * App-level error boundary component.
 *
 * @param {{ children: React.ReactNode }} props - Boundary children.
 * @returns {JSX.Element} Error boundary wrapper.
 */
const ErrorBoundary = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={Fallback}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
