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

    if (!oldPassword.trim()) {
      handleSnakbarOpen("Please enter old password", "error");
      document.getElementById("oldPassword").focus();
      return (isError = true);
    }
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
          old_password: oldPassword,
          password: newPassword,
          password_confirm: confirmPassword,
        };
        let response = await axios({
          url: "/api/auth/user/change-password",
          method: "post",
          data: data,
        });

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
            padding: "50px",
            background: "#fff",
            borderRadius: "10px",
            textAlign: "center",
            width: "400px",
            // boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          }}
          onSubmit={onSubmit}
        >
          <img
            src="/logo.svg"
            alt=""
            style={{ display: "block", margin: "auto", maxWidth: "155px" }}
          />
          <br />
          <Typography
            variant="h5"
            component="div"
            style={{ marginBottom: "30px" }}
          >
            Reset your password
          </Typography>
          <Box sx={{ marginBottom: "30px" }}>
            <FormControl fullWidth variant="outlined">
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
                    <LockOutlinedIcon />
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
                      {oldPasswordShow ? <VisibilityOff /> : <Visibility />}
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
          </Box>
          <Box sx={{ marginBottom: "30px" }}>
            <FormControl fullWidth variant="outlined">
              <OutlinedInput
                id="newPassword"
                type={newPasswordShow ? "text" : "password"}
                placeholder="New password"
                size="small"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
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
                      {newPasswordShow ? <VisibilityOff /> : <Visibility />}
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
          <Box sx={{ marginBottom: "30px" }}>
            <FormControl fullWidth variant="outlined">
              <OutlinedInput
                id="confirmPassword"
                type={confirmPasswordShow ? "text" : "password"}
                placeholder="Confirm password"
                size="small"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
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
                      {confirmPasswordShow ? <VisibilityOff /> : <Visibility />}
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
          </Button>
        </form>
      </Grid>
    </div>
  );
};

export default ResetPassword;
