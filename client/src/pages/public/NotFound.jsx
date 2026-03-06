import { useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import notFoundSvg from "../../assets/notFound_404.svg";

/**
 * Not found page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center" maxWidth={480}>
        <Box
          component="img"
          src={notFoundSvg}
          alt="Page not found"
          sx={{
            width: "100%",
            maxWidth: 320,
            height: "auto",
          }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Page Not Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          The page you are looking for does not exist or has moved.
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="contained" onClick={() => navigate("/")}>
            Home
          </Button>
          <Button size="small" variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default NotFound;
