import React, { useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import { AuthContext } from "../../context/AuthContext";
import PulseLoader from "react-spinners/PulseLoader";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box } from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { ifixit_admin_panel, login, logout } = useContext(AuthContext);
  const [oldPasswordShow, setOldPasswordShow] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPasswordShow, setNewPasswordShow] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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

  const validation = () => {
    let isError = false;

    // if (!oldPassword.trim()) {
    //   handleSnakbarOpen("Please enter old password", "error");
    //   document.getElementById("oldPassword").focus();
    //   return (isError = true);
    // }
    if (!newPassword.trim()) {
      handleSnakbarOpen("Please enter new password", "error");
      document.getElementById("newPassword").focus();
      return (isError = true);
    }
    if (newPassword.trim().length < 6) {
      handleSnakbarOpen(
        "The password field must be at least 6 characters.",
        "error"
      );
      document.getElementById("newPassword").focus();
      return (isError = true);
    }
    if (!confirmPassword.trim()) {
      handleSnakbarOpen("Please enter confirm password", "error");
      document.getElementById("confirmPassword").focus();
      return (isError = true);
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      handleSnakbarOpen(
        "Your new password and confirm password is not same",
        "error"
      );
      document.getElementById("confirmPassword").focus();
      return (isError = true);
    }

    return isError;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let err = validation();

    if (err) {
      return;
    } else {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("tempPassword", ifixit_admin_panel.password);
        formData.append("newPassword", newPassword);
        formData.append("confirmNewPassword", confirmPassword);
        formData.append("tempToken", ifixit_admin_panel.temp_token);
        // let token = await RefreshToken(ifixit_admin_panel.token)
        let token = ifixit_admin_panel.token;
        let response = await axios({
          url: "/api/v1/private/auth/admin/change-password",
          method: "put",
          data: formData,
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("response", response);
        if (response?.status === 401) {
          logout();
          navigate("/");
          return;
        }
        if (response?.status > 199 && response?.status < 300) {
          handleSnakbarOpen("Password reset successfully", "success");
          login({});
          navigate("/");
        }
      } catch (error) {
        console.log("error", error);
        setLoading(false);
        if (error?.response?.status === 401) {
          logout();
          return;
        }
        if (error?.response?.status === 500) {
          handleSnakbarOpen(error?.response?.statusText, "error");
        } else {
          setErrors(error.response.data.errors);
        }
      }
      setLoading(false);
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const customeTextFeild = {
    // padding: "15px 20px",
    background: "#FAFAFA",
    "& label.Mui-focused": {
      color: "#A0AAB4",
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-input": {
      padding: "15px 24px 15px 0px",
    },
    "& .MuiOutlinedInput-root": {
      paddingLeft: "24px",
      "& fieldset": {
        borderColor: "rgba(0,0,0,0)",
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
    <div>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "80vh" }}
      >
        <form
          style={{
            width: "470px",
            padding: "50px",
            padding: "40px 60px",
            background: "#fff",
            borderRadius: "10px",
            textAlign: "center",
            border: `1px solid #E5E5E5`,
            boxSizing: "border-box",
          }}
          onSubmit={onSubmit}
        >
          <img
            src="/logo.png"
            alt=""
            style={{
              display: "block",
              margin: "auto",
              maxWidth: "155px",
              marginBottom: "30px",
            }}
          />

          <Typography
            variant="base"
            color="text.light"
            sx={{ fontWeight: 500, mb: 4 }}
          >
            Reset your password
          </Typography>
          {/* <Box sx={{ mb: 2 }}>
            <FormControl
              fullWidth
              variant="outlined"
              sx={{ ...customeTextFeild }}
            >
              <OutlinedInput
                id="oldPassword"
                autoFocus
                type={oldPasswordShow ? "text" : "password"}
                placeholder="Old password"
                size="small"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.9965 16H16.0054"
                        stroke="#969696"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.9955 16H12.0045"
                        stroke="#969696"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M7.99451 16H8.00349"
                        stroke="#969696"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setOldPasswordShow(!oldPasswordShow)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {oldPasswordShow ? (
                        <VisibilityOffOutlinedIcon sx={{ color: "#969696" }} />
                      ) : (
                        <RemoveRedEyeOutlinedIcon sx={{ color: "#969696" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {errors.old_password && (
              <Typography variant="small" color="error.main">
                {errors.old_password}
              </Typography>
            )}
          </Box> */}
          <Box sx={{ mb: 2 }}>
            <FormControl
              fullWidth
              variant="outlined"
              sx={{ ...customeTextFeild }}
            >
              <OutlinedInput
                id="newPassword"
                type={newPasswordShow ? "text" : "password"}
                placeholder="New password"
                size="small"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.9965 16H16.0054"
                        stroke="#969696"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.9955 16H12.0045"
                        stroke="#969696"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M7.99451 16H8.00349"
                        stroke="#969696"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setNewPasswordShow(!newPasswordShow)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {newPasswordShow ? (
                        <VisibilityOffOutlinedIcon sx={{ color: "#969696" }} />
                      ) : (
                        <RemoveRedEyeOutlinedIcon sx={{ color: "#969696" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {errors.password && (
              <Typography variant="small" color="error.main">
                {errors.password}
              </Typography>
            )}
          </Box>
          <Box sx={{ mb: 4 }}>
            <FormControl
              fullWidth
              variant="outlined"
              sx={{ ...customeTextFeild }}
            >
              <OutlinedInput
                id="confirmPassword"
                type={confirmPasswordShow ? "text" : "password"}
                placeholder="Confirm password"
                size="small"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.9965 16H16.0054"
                        stroke="#969696"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.9955 16H12.0045"
                        stroke="#969696"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M7.99451 16H8.00349"
                        stroke="#969696"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setConfirmPasswordShow(!confirmPasswordShow)
                      }
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {confirmPasswordShow ? (
                        <VisibilityOffOutlinedIcon sx={{ color: "#969696" }} />
                      ) : (
                        <RemoveRedEyeOutlinedIcon sx={{ color: "#969696" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {errors.password_confirm && (
              <Typography variant="small" color="error.main">
                {errors.password_confirm}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            disableElevation
            fullWidth
            sx={{ minHeight: "56px", mb: 4 }}
            disabled={loading}
            // onClick={onSubmit}
            type="submit"
          >
            {loading === false && "Continue"}
            <PulseLoader
              color={"#4B46E5"}
              loading={loading}
              size={10}
              speedMultiplier={0.5}
            />{" "}
          </Button>
        </form>
      </Grid>
    </div>
  );
};

export default ResetPassword;
