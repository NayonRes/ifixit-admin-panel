import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";
import ForgotPasswordOTPVarify from "./ForgotPasswordOTPVarify";
import EmailIcon from "@mui/icons-material/Email";
import { Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSection, setEmailSection] = useState(true); ///111
  const [reference, setReference] = useState("");
  const [otpSection, setOtpSection] = useState(false); ///111
  const [passwordSection, setPasswordSection] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [errors, setErrors] = useState("");

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
    if (!email.trim()) {
      handleSnakbarOpen("Please enter email address", "error");
      document.getElementById("email").focus();
      return (isError = true);
    } else if (
      !/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      handleSnakbarOpen("Invalid email address", "error");
      document.getElementById("email").focus();

      return (isError = true);
    }

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
        let formData = new FormData();
        formData.append("email", email.trim().toLocaleLowerCase());
        let response = await axios({
          url: "/api/v1/public/auth/admin/forgot-password/send-otp",
          method: "post",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("response", response);
        if (response?.status > 199 && response?.status < 300) {
          handleSnakbarOpen("OPT has been in your email address", "success");
          setReference(response?.data?.data?.reference);
          setEmailSection(false);
          setOtpSection(true);
        }
      } catch (error) {
        console.log("error", error);
        setLoading(false);
        if (error?.response?.status === 500) {
          handleSnakbarOpen(error?.response?.statusText, "error");
        } else {
          handleSnakbarOpen(error.response.data.message.toString(), "error");
        }
      }
      setLoading(false);
    }
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
      {emailSection && (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "100vh" }}
        >
          <form
            onSubmit={onSubmit}
            style={{
              width: "470px",
              padding: "50px",
              padding: "40px 60px",
              background: "#fff",
              borderRadius: "10px",
              border: `1px solid #E5E5E5`,
              boxSizing: "border-box",
            }}
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
              Forgot Password
            </Typography>
            <Typography
              variant="base"
              color="text.light"
              sx={{ mb: 2.5, fontWeight: 500, textAlign: "left" }}
            >
              Enter the email address associated with your Dizli account.
            </Typography>

            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="medium"
                color="text.light"
                sx={{ fontWeight: 500, textAlign: "left" }}
              >
                Email Address
              </Typography>
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
                color={"#353b48"}
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
                color={"#353b48"}
                loading={loading}
                size={10}
                speedMultiplier={0.5}
              />{" "}
            </Button> */}
          </form>
        </Grid>
      )}

      {otpSection && (
        <ForgotPasswordOTPVarify email={email} reference={reference} />
      )}
    </div>
  );
};

export default ForgotPassword;
