import { Box, Typography } from "@mui/material";
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";

import { useDropzone } from "react-dropzone";
import Grid from "@mui/material/Grid2";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px 24px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#cccaca",
  borderStyle: "dashed",
  backgroundColor: "#fff",
  // color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  borderRadius: "12px",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const ImageUpload = ({ file, setFile, dimension }) => {
  const dropzoneRef = useRef(null);
  const onDrop = useCallback((acceptedFiles) => {
    console.log("onDrop", acceptedFiles);
    // if (!dropzoneRef.current) return;
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // setBase64String(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const onFileDialogCancel = useCallback(() => {
    setFile(null);
    console.log("File dialog was closed without selecting a file");
    // setBase64String(""); // Update state to indicate dialog was cancelled
  }, []);

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    onFileDialogCancel,
    ref: dropzoneRef,
    accept: { "image/png": [], "image/jpeg": [], "image/webp": [] },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB file size limit
  });
  const files = acceptedFiles.map((file) => (
    <>
      {file.path} - {file.size} bytes
    </>
  ));
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );
  return (
    <Box {...getRootProps({ style })}>
      <input {...getInputProps()} />

      <Grid container justifyContent="center">
        <Box
          sx={{
            mb: 1.5,
            p: 1.125,
            paddingBottom: "3px",
            borderRadius: "8px",
            border: "1px solid #EAECF0",
            boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M6.66666 13.3333L9.99999 10M9.99999 10L13.3333 13.3333M9.99999 10V17.5M16.6667 13.9524C17.6846 13.1117 18.3333 11.8399 18.3333 10.4167C18.3333 7.88536 16.2813 5.83333 13.75 5.83333C13.5679 5.83333 13.3975 5.73833 13.3051 5.58145C12.2184 3.73736 10.212 2.5 7.91666 2.5C4.46488 2.5 1.66666 5.29822 1.66666 8.75C1.66666 10.4718 2.36286 12.0309 3.48911 13.1613"
              stroke="#344054"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Box>
      </Grid>
      <Box sx={{ pl: 1.5, textAlign: "center" }}>
        <Typography
          variant="base"
          color="text.fade"
          sx={{ fontWeight: 400, mb: 0.5 }}
        >
          <span style={{ color: "#4238CA", fontWeight: 500 }}>
            {" "}
            Click to upload{" "}
          </span>
          or drag and drop
        </Typography>
        <Typography variant="medium" color="text.fade">
          File Type : PNG, JPG
        </Typography>
        <Typography variant="medium" color="text.fade">
          {dimension && dimension}
        </Typography>
        {file?.path?.length > 0 && (
          <Typography variant="medium" color="text.light" sx={{ mt: 1 }}>
            <b>Uploaded:</b> {file?.path} - {file?.size} bytes
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ImageUpload;
