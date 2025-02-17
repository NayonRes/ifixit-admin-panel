import React, { useState, useContext } from "react";
import Grid from "@mui/material/Grid2";
// import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { handlePostData } from "../../services/PostDataService";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Box } from "@mui/material";
import axios from "axios";
import { styled, useTheme } from "@mui/material/styles";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(true);
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const handleChange = (event) => {
    setChecked(event.target.checked);
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
    return isError;
  };

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

  const onSubmit = async (e) => {
    e.preventDefault();
    let err = validation();
    if (err) {
      return;
    } else {
      setLoading(true);
      try {
        let data = {
          email: email.trim(),
          password: password.trim(),
        };
        let response = await axios({
          url: `/api/v1/user/login`,
          method: "post",
          data: data,
        });
        if (response.status >= 200 && response.status < 300) {
          console.log("response", response.data);
          handleSnakbarOpen("Successfully", "success");
          // navigate("/category-list");

          console.log("response", response);

          login(response.data);
          // navigate("/verify");
          navigate("/");
        }
        setLoading(false);
      } catch (error) {
        console.log("error", error.response.data);
        setLoading(false);
        handleSnakbarOpen(error.response.data.message.toString(), "error");
      }
    }
  };
  return (
    <React.Fragment>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        {/* <Grid
          container
          justifyContent="center"
          alignItems="center"
          // className={classes.main}
          sx={{
            width: "1100px !important",
            padding: "10px 30px",
            background: "#fff",
            borderRadius: "10px",
            textAlign: "center",
          }}
        > */}
        {/* <Grid item xs={6}>
            <img
              src="/image/login.jpg"
              alt=""
              style={{ display: "block", margin: "auto", maxWidth: "100%" }}
            />
          </Grid> */}
        {/* <Grid item xs={6}> */}
        <form
          // className={classes.formStyle}
          onSubmit={onSubmit}
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
            Login as User
          </Typography>
          <Box sx={{ mb: 1.5 }}>
            <TextField
              sx={{ ...customeTextFeild }}
              placeholder="Email"
              fullWidth
              // size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />{" "}
            {errors?.email && (
              <Typography
                variant="small"
                color="error.main"
                sx={{ textAlign: "left" }}
              >
                {errors.email.toString()}
              </Typography>
            )}
          </Box>
          <Box sx={{ mb: 2 }}>
            <FormControl
              fullWidth
              variant="outlined"
              sx={{ ...customeTextFeild }}
            >
              <OutlinedInput
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                // size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ mr: 0.5 }}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon sx={{ color: "#969696" }} />
                      ) : (
                        <RemoveRedEyeOutlinedIcon sx={{ color: "#969696" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {errors?.password && (
              <Typography
                variant="small"
                color="error.main"
                sx={{ textAlign: "left" }}
              >
                {errors.password.toString()}
              </Typography>
            )}
          </Box>

          {/* <Grid container alignItems="center" sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={handleChange}
                      sx={{
                        color: "#969696",
                        // "&.Mui-checked": {
                        //   color: "red",
                        // },
                      }}
                    />
                  }
                  label="Remember me"
                  sx={{
                    ".MuiTypography-root": {
                      color: "#969696",
                      fontWeight: 500,
                      fontSize: "16px",
                    },
                  }}
                />
              </FormGroup>
            </Grid>
          </Grid> */}
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
          <Typography
            component="div"
            color="primary.main"
            style={{
              fontWeight: 500,
              fontSize: "16px",
              textAlign: "center",
              cursor: "pointer",
              display: "inline-flex",
            }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </Typography>
        </form>
        {/* </Grid> */}
        {/* </Grid> */}
      </Grid>
    </React.Fragment>
  );
};

export default Login;
