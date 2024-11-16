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

const ForgotPasswordResetPassword = ({ email, otp, reference }) => {
  const navigate = useNavigate();
  const { login, ifixit_admin_panel } = useContext(AuthContext);
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
  const validation = () => {
    let isError = false;

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
        let data = {
          email: email,
          otp: parseInt(otp),
          // reference: reference,
          newPassword: newPassword,
          confirmNewPassword: confirmPassword,
        };

        let response = await axios({
          url: "/api/v1/public/auth/admin/forgot-password/reset",
          method: "post",
          data: data,
        });

        if (response?.status > 199 && response?.status < 300) {
          handleSnakbarOpen("Password reset successfully", "success");
          // login({});
          navigate("/");
        }
      } catch (error) {
        console.log("error", error);
        setLoading(false);
        if (error?.response?.status === 500) {
          handleSnakbarOpen(error?.response?.statusText, "error");
        } else {
          setErrors(error.response.data.errors);
        }

        setLoading(false);
      }
      setLoading(false);
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <form
          style={{
            width: "470px",
            padding: "50px",
            padding: "40px 60px",
            background: "#fff",
            borderRadius: "10px",
            border: `1px solid #E5E5E5`,
            boxSizing: "border-box",
          }}
          onSubmit={onSubmit}
        >
          <Typography
            variant="h6"
            sx={{ mb: 6, fontWeight: 500, textAlign: "left" }}
          >
            <IconButton
              sx={{ borderRadius: "4px", mr: 0.5 }}
              onClick={() => {
                navigate("/");
              }}
            >
              <svg
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.71258 0.929932L1.64258 6.99993L7.71258 13.0699"
                  stroke="#555555"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.6425 7H1.8125"
                  stroke="#555555"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </IconButton>
            Verification
          </Typography>
          <Typography
            variant="base"
            color="text.light"
            sx={{ mb: 2.5, fontWeight: 500, textAlign: "left" }}
          >
            Do not use previous password as your new password.
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="medium"
              color="text.light"
              sx={{ fontWeight: 500, textAlign: "left" }}
            >
              New Password
            </Typography>
            <FormControl
              fullWidth
              variant="outlined"
              sx={{ ...customeTextFeild }}
            >
              <OutlinedInput
                type={newPasswordShow ? "text" : "password"}
                id="newPassword"
                // placeholder="Password"
                // size="small"
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
                      sx={{ mr: 0.5 }}
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
            {errors?.newPassword && (
              <Typography
                variant="small"
                color="error.main"
                sx={{ textAlign: "left" }}
              >
                {errors.newPassword.toString()}
              </Typography>
            )}
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="medium"
              color="text.light"
              sx={{ fontWeight: 500, textAlign: "left" }}
            >
              Re-enter Password
            </Typography>
            <FormControl
              fullWidth
              variant="outlined"
              sx={{ ...customeTextFeild }}
            >
              <OutlinedInput
                type={confirmPasswordShow ? "text" : "password"}
                id="confirmPassword"
                // placeholder="Password"
                // size="small"
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
                      sx={{ mr: 0.5 }}
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
            {errors?.confirmNewPassword && (
              <Typography
                variant="small"
                color="error.main"
                sx={{ textAlign: "left" }}
              >
                {errors.confirmNewPassword.toString()}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            disableElevation
            fullWidth
            sx={{ minHeight: "56px", mb: 4, mt: 2 }}
            disabled={loading}
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

          {/* <Button
            variant="contained"
            disableElevation
            fullWidth
            style={{ marginBottom: "30px", minHeight: "37px" }}
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
          </Button> */}
        </form>
      </Grid>
    </div>
  );
};

export default ForgotPasswordResetPassword;
