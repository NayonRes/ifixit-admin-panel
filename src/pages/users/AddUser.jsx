import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import Grid from "@mui/material/Grid2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { Box, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { getDataWithToken } from "../../services/GetDataService";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import EmailIcon from "@mui/icons-material/Email";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { designationList, roleList } from "../../data";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px 24px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fff",
  // color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
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
const form = {
  padding: "50px",
  background: "#fff",
  borderRadius: "10px",
  width: "400px",
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
};
const AddUser = () => {
  const navigate = useNavigate();
  const uploadImage = "/image/userpic.png";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [designation, setDesignation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [parentName, setParentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [parentList, setParentList] = useState([]);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [roleList, setRoleList] = useState([]);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(uploadImage);
  const [file, setFile] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const handleChange = (event) => {
    setParentName(event.target.value);
  };
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
    console.log("File dialog was closed without selecting a file");
    // setBase64String(""); // Update state to indicate dialog was cancelled
  }, []);
  const handleSnakbarOpen = (msg, vrnt) => {
    let duration;
    if (vrnt === "error") {
      duration = 3000;
    } else {
      duration = 1000;
    }
    enqueueSnackbar(msg, {
      variant: vrnt,
      autoHideDuration: duration,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const validation = () => {
    let isError = false;

    if (!name.trim()) {
      handleSnakbarOpen("Please enter title", "error");
      document.getElementById("name").focus();
      return (isError = true);
    }

    if (!email.trim()) {
      handleSnakbarOpen("Please enter email address", "error");
      document.getElementById("email").focus();
      return (isError = true);
    } else if (
      !/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email.trim()
      )
    ) {
      handleSnakbarOpen("Invalid email address", "error");
      document.getElementById("email").focus();
      return (isError = true);
    }

    if (!password.trim()) {
      handleSnakbarOpen("Please enter password", "error");
      document.getElementById("password").focus();
      return (isError = true);
    }

    // if (!parentName.trim()) {
    //   handleSnakbarOpen("Please select a parent", "error");
    //   document.getElementById("parent-id").focus();
    //   return (isError = true);
    // }

    return isError;
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    let err = validation();
    if (err) {
      return;
    } else {
      setLoading(true);
      try {
        var formdata = new FormData();
        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append("password", password);
        formdata.append("role_id", roleId);
        if (imageFile) {
          formdata.append("image", imageFile);
        }

        let response = await axios({
          url: `/api/v1/user/create`,
          method: "post",
          data: formdata,
        });
        if (response.status >= 200 && response.status < 300) {
          handleSnakbarOpen("Added successfully", "success");
          // navigate("/category-list");
        }
      } catch (error) {
        console.log("error", error);
        handleSnakbarOpen(error.response.data.message, "error");
        setLoading(false);
      }
      setLoading(false);
    }
  };
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
    accept: { "image/*": [] },
    maxFiles: 1,
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
  const imageProcess = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setImageFile(imageFile);
        setPreview(x.target.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setImageFile(null);
    }
  };

  const customeTextFeild = {
    boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
    // padding: "15px 20px",

    // "& label.Mui-focused": {
    //   color: "#A0AAB4",
    // },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-input": {
      // padding: "15px 24px 15px 0px",
    },
    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px",
      "& fieldset": {
        borderColor: "",
      },

      "&:hover fieldset": {
        borderColor: "#969696",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#969696",
      },
    },
  };

  return (
    <>
      <Box>
        <form onSubmit={onSubmit}>
          {/* <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <img
              src={preview}
              alt=""
              style={{
                height: "120px",
                width: "120px",
                borderRadius: "50%",
                border: "2px solid #ddd",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                cursor: "pointer",
              }}
              onClick={() =>
                document.getElementById("contained-button-file").click()
              }
            />
            <Button
              size="small"
              variant="outlined"
              style={{ marginTop: "5px", width: "150px", padding: 4 }}
              onClick={() =>
                document.getElementById("contained-button-file").click()
              }
              startIcon={<FileUploadOutlinedIcon />}
            >
              Upload
            </Button>
            <input
              accept="image/png, image/jpg, image/jpeg"
              style={{ display: "none" }}
              id="contained-button-file"
              type="file"
              onChange={imageProcess}
            />
          </div> */}
          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Full Name
          </Typography>
          <TextField
            required
            size="small"
            fullWidth
            id="name"
            placeholder="Full Name"
            variant="outlined"
            sx={{ ...customeTextFeild, mb: 3 }}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Set Password
          </Typography>
          <TextField
            required
            size="small"
            fullWidth
            id="password"
            placeholder="Enter password"
            variant="outlined"
            sx={{ ...customeTextFeild, mb: 3 }}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Email
          </Typography>
          <TextField
            required
            type="email"
            size="small"
            fullWidth
            id="email"
            placeholder="Enter Email"
            variant="outlined"
            sx={{ ...customeTextFeild, mb: 3 }}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Phone Number
          </Typography>
          <TextField
            required
            size="small"
            fullWidth
            id="number"
            placeholder="Enter Number"
            variant="outlined"
            sx={{ ...customeTextFeild, mb: 3 }}
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          />
          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Designation
          </Typography>
          <FormControl fullWidth size="small" style={{ marginBottom: "30px" }}>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="parent-id"
              value={designation}
              label="Role"
              onChange={(e) => setDesignation(e.target.value)}
            >
              {designationList?.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box {...getRootProps({ style })}>
            <input {...getInputProps()} />
            {/* <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: "#E5E5E5",
                    mb: 7,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <path
                      d="M9.5 17.5V11.5L7.5 13.5"
                      stroke="#555555"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.5 11.5L11.5 13.5"
                      stroke="#555555"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M22.5 10.5V15.5C22.5 20.5 20.5 22.5 15.5 22.5H9.5C4.5 22.5 2.5 20.5 2.5 15.5V9.5C2.5 4.5 4.5 2.5 9.5 2.5H14.5"
                      stroke="#555555"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M22.5 10.5H18.5C15.5 10.5 14.5 9.5 14.5 6.5V2.5L22.5 10.5Z"
                      stroke="#555555"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </Avatar> */}
           
              <Box sx={{ pl: 1.5 }}>
                <Typography
                  variant="base"
                  color="text.fade"
                  sx={{ fontWeight: 500 }}
                >
                  Drag and Drop or{" "}
                  <span style={{ color: "#687535" }}>Browser</span>
                </Typography>
                <Typography variant="medium" color="text.fade">
                  Supports: jpeg, jpg, png, svg
                </Typography>
                {file?.path?.length > 0 && (
                  <Typography
                    variant="medium"
                    color="text.light"
                    sx={{ mt: 1 }}
                  >
                    <b>Uploaded:</b> {file?.path} - {file?.size} bytes
                  </Typography>
                )}
              </Box>
          
          </Box>
          <div style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              disabled={loading}
              type="submit"
              style={{ minWidth: "180px", minHeight: "35px" }}
              autoFocus
              disableElevation
            >
              <PulseLoader
                color={"#353b48"}
                loading={loading}
                size={10}
                speedMultiplier={0.5}
              />{" "}
              {loading === false && "Submit"}
            </Button>
          </div>
        </form>
      </Box>
    </>
  );
};

export default AddUser;
