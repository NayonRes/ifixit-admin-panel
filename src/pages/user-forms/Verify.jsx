import React, { useRef, useState, useContext } from "react";
// import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Countdown from "react-countdown";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AuthContext } from "../../context/AuthContext";
import OtpInput from "react-otp-input";
import { Box } from "@mui/material";

const Verify = () => {
  const navigate = useNavigate();
  const { login, ifixit_admin_panel } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [otpTimeOut, setOtpTimeOut] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [minutes, setMinutes] = useState(5);
  const [myOTP, setMyOTP] = useState({ otp: "" });
  const handleChange = (otp) => {
    setMyOTP({ otp });
  };

  const buttonref = useRef(null);

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

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let data = {
        email: ifixit_admin_panel.email,
        password: ifixit_admin_panel.password,
        token: "my token",
      };

      handleSnakbarOpen("OTP verified successfully", "success");
      setTimeout(() => {
        login(data);
        setLoading(false);
        navigate("/dashboard");
      }, 1200);
    } catch (error) {
      console.log("error", error);
      handleSnakbarOpen(error.response.data.messages.toString(), "error");

      setLoading(false);
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
        <Box
          sx={{
            padding: "50px",
            background: "#fff",
            borderRadius: "10px",
            textAlign: "center",
            width: "400px",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          }}
          // className={classes.form}
        >
          <img
            src="/logo.png"
            alt=""
            style={{ display: "block", margin: "auto", maxWidth: "155px" }}
          />{" "}
          <br />
          <Typography
            variant="h5"
            component="div"
            style={{ marginBottom: "30px" }}
          >
            Verify your identity.
            <span
              style={{
                display: "block",
                fontSize: "16px",
                letterSpacing: "2px",
                marginTop: "5px",
              }}
            >
              {" "}
              We have sent a 6 digits varification code to{" "}
              {ifixit_admin_panel.email}
            </span>
          </Typography>
          {otpTimeOut === false && (
            <form onSubmit={onSubmit}>
              <Grid
                id="mainGrid"
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={3}
              >
                <Grid item xs={12}>
                  {/* <OtpInput
                    value={myOTP.otp}
                    onChange={handleChange}
                    numInputs={6}
                    // separator={<span>&nbsp; &nbsp; &nbsp;</span>}
                    isInputNum={true}
                    shouldAutoFocus={true}
                    isInputSecure={true}
                    // inputStyle={classes.newInputStyle}
                    // focusStyle={classes.newFocusStyle}
                    containerStyle={{ justifyContent: "space-between" }}
                  /> */}
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    ref={buttonref}
                    type="submit"
                    onClick={onSubmit}
                    disabled={loading}
                    style={{ minHeight: "37px" }}
                  >
                    {loading === false && "Continue"}
                    <PulseLoader
                      color={"#4B46E5"}
                      loading={loading}
                      size={10}
                      speedMultiplier={0.5}
                    />{" "}
                  </Button>
                  <br />
                  <br />
                  <Button
                    variant="outlined"
                    fullWidth
                    color="primary"
                    style={{ border: "none" }}
                    onClick={() => navigate("/")}
                    startIcon={<ArrowBackIcon />}
                  >
                    Back to Login
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Box>
      </Grid>
    </React.Fragment>
  );
};

export default Verify;
