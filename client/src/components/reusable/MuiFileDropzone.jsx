import { memo, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import { useDropzone } from "react-dropzone";

import { FILE_UPLOAD_CONSTRAINTS } from "../../utils/constants";

/**
 * Validates and renders a reusable drag-and-drop file input.
 *
 * @param {{ onFilesAccepted?: (files: File[]) => void, onValidationError?: (message: string) => void, uploadProgress?: number | null, helperText?: string }} props - Dropzone props.
 * @returns {JSX.Element} Dropzone wrapper.
 * @throws {never} This component does not throw.
 */
const MuiFileDropzone = ({
  onFilesAccepted,
  onValidationError,
  uploadProgress = null,
  helperText,
}) => {
  const [acceptedFiles, setAcceptedFiles] = useState([]);

  const validator = (file) => {
    const extension = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;

    if (!FILE_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        code: "invalid-extension",
        message: `Unsupported file type: ${extension}`,
      };
    }

    if (file.size > FILE_UPLOAD_CONSTRAINTS.MAX_SIZE_BYTES) {
      return {
        code: "file-too-large",
        message: "File exceeds the 10MB size limit.",
      };
    }

    return null;
  };

  const onDrop = (files, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      onValidationError?.(
        rejectedFiles[0]?.errors?.[0]?.message || "File validation failed."
      );
      return;
    }

    setAcceptedFiles(files);
    onFilesAccepted?.(files);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    validator,
    onDrop,
  });

  const renderedFiles = useMemo(
    () =>
      acceptedFiles.map((file) => (
        <Stack
          key={`${file.name}-${file.size}`}
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: "action.hover",
          }}
        >
          <InsertDriveFileOutlinedIcon fontSize="small" />
          <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
            {file.name}
          </Typography>
        </Stack>
      )),
    [acceptedFiles]
  );

  return (
    <Stack spacing={1.5}>
      <Box
        {...getRootProps()}
        sx={{
          border: "1px dashed",
          borderColor: isDragActive ? "primary.main" : "divider",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          cursor: "pointer",
          minHeight: 180,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <input {...getInputProps()} />
        <UploadFileRoundedIcon color={isDragActive ? "primary" : "action"} />
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {isDragActive ? "Drop files here" : "Drag files here or click to browse"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {helperText ||
            `Allowed: ${FILE_UPLOAD_CONSTRAINTS.ALLOWED_EXTENSIONS.join(", ")}`}
        </Typography>
      </Box>

      {typeof uploadProgress === "number" ? (
        <LinearProgress variant="determinate" value={uploadProgress} />
      ) : null}

      {renderedFiles.length > 0 ? <Stack spacing={1}>{renderedFiles}</Stack> : null}
    </Stack>
  );
};

export default memo(MuiFileDropzone);
