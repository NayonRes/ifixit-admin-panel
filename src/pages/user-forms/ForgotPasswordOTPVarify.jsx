import React, { useRef, useState, useContext } from "react";
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
import ForgotPasswordResetPassword from "./ForgotPasswordResetPassword";
import OtpInput from "react-otp-input";
import { IconButton } from "@mui/material";
// const useStyles = makeStyles((theme) => ({

//   newInputStyle: {
//     background: "none",
//     minWidth: "40px",
//     minHeight: "40px",
//     fontSize: "16px",
//     borderRadius: "3px",
//     border: "1px solid #c3bebe",
//   },
//   newFocusStyle: {
//     borderRadius: "3px",
//     border: "1px solid #353b48",
//     outline: "1px solid #353b48",
//   },
// }));

const ForgotPasswordOTPVarify = ({ email, reference }) => {
  const navigate = useNavigate();
  const { login, ifixit_admin_panel } = useContext(AuthContext);
  // const newInputStyle = {
  //   background: "none",
  //   minWidth: "40px",
  //   minHeight: "40px",
  //   fontSize: "16px",
  //   borderRadius: "3px",
  //   border: "1px solid #c3bebe",
  // };
  // const newFocusStyle = {
  //   borderRadius: "3px",
  //   border: "1px solid #353b48",
  //   outline: "1px solid #353b48",
  // };

  const Completionist = () => <span>Otp time is out</span>;

  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          {minutes}:{seconds < 10 && "0"}
          {seconds}
        </span>
      );
    }
  };

  const newInputStyle = {
    background: "#FAFAFA",
    minWidth: "48px",
    minHeight: "48px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "0px solid #969696",
    // "&::focus": {
    //   width: "250px",
    // },
  };
  const newErrorInputStyle = {
    background: "#FFECEC",
    minWidth: "48px",
    minHeight: "48px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "2px solid #F23836",
    // "&::focus": {
    //   width: "250px",
    // },
  };
  const newFocusStyle = {
    // borderRadius: "6px",
    // border: `1px solid ${theme.palette.text.light}`,
    // outline: `none`,

    outline: "none", // You may want to remove the default outline
    borderColor: "#ddd !important", // Your desired focus border color
  };
  const [showOTPSection, setShowOTPSection] = useState(true); /// 111
  const [loading, setLoading] = useState(false);
  const [otpTimeOut, setOtpTimeOut] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [minutes, setMinutes] = useState(5);
  const [errors, setErrors] = useState("");
  const [myOTP, setMyOTP] = useState({ otp: "" });
  const targetTimeRef = useRef(Date.now() + 300000);
  const [loading2, setLoading2] = useState(false);
  // const handleChange = (otp) => {
  //   setMyOTP({ otp });
  // };

  const handleChange = (otp) => {
    setMyOTP({ otp });
    if (otp.length === 6) {
      onSubmit(otp);
    }
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

  // const onSubmit = async (e) => {
  //   e.preventDefault();

  //   setShowOTPSection(false);
  // };

  const onSubmit = async (otp) => {
    // e.preventDefault();
    // setErrors(false);
    try {
      setLoading(true);
      let data = {
        email: email,
        // tempToken: ifixit_admin_panel.temp_token,
        otp: otp,
      };

      let url = `/api/v1/public/auth/admin/forgot-password/verify-otp`;
      let response = await axios({
        url: url,
        method: "post",
        data: data,
      });

      console.log("response", response);
      if (response.status === 200) {
        login(response.data.data);
        // login(response.data.data);
        handleSnakbarOpen("Successful", "success");
        // navigate("/dashboard");
        setShowOTPSection(false);
      } else {
        handleSnakbarOpen(response.data.messages, "error");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("catch error", error);
      if (error?.response?.status === 500) {
        handleSnakbarOpen(error?.response?.statusText, "error");
      } else {
        // handleSnakbarOpen(error?.response?.data?.message, "error");
        setErrors(error?.response?.data?.message);
      }
    }
  };

  const resendOtp = async (e) => {
    setLoading2(true);
    try {
      let url = `/api/v1/public/auth/admin/signin`;
      let data = {
        email: ifixit_admin_panel?.email.trim().toLocaleLowerCase(),
        password: ifixit_admin_panel.password.trim(),
        grant_type: process.env.REACT_APP_GRANT_TYPE,
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRECT,
        scope: process.env.REACT_APP_SCOPE,
      };
      // let res = await handlePostData(url, data);
      let res = await axios({
        url: url,
        method: "post",
        data: data,
      });

      if (res?.status > 199 && res?.status < 300) {
        handleSnakbarOpen("Please check your email for new opt", "success");
        login({
          email: ifixit_admin_panel?.email.trim().toLocaleLowerCase(),
          password: ifixit_admin_panel.password.trim(),
          ...res.data.data,
        });
      }
      setLoading2(false);

      // login(data);
      // setLoading(false);
      // navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      console.log("catch error", error);
      if (error?.response?.status === 500) {
        handleSnakbarOpen(error?.response?.statusText, "error");
      } else {
        handleSnakbarOpen(error?.response?.data?.message, "error");
        setErrors(error.response.data.errors);
      }
    }
  };
  const lastPartOfEmail = () => {
    // const email = ifixit_admin_panel.email;
    const afterAt = email.split("@")[1];
    return "*****@" + afterAt;
  };
  return (
    <React.Fragment>
      {showOTPSection ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "100vh" }}
        >
          <div
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
              Verification
            </Typography>
            <Typography
              variant="base"
              color="text.light"
              sx={{ mb: 2.5, fontWeight: 500, textAlign: "left" }}
            >
              We texted you a code to verify your account
            </Typography>
            <Typography
              variant="medium"
              color="text.light"
              sx={{ fontWeight: 500, textAlign: "left" }}
            >
              Enter the security code we have sent to:
            </Typography>
            <Typography
              variant="medium"
              color="text.main"
              sx={{ mb: 0.75, fontWeight: 500, textAlign: "left" }}
            >
              {lastPartOfEmail()}
            </Typography>
            {/* {otpTimeOut && (
            <React.Fragment>
              <Grid
                id="mainGrid"
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={3}
              >
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    disableElevation
                    fullWidth
                    style={{
                      background: "none",
                      border: "none",
                      color: "#666666",
                    }} 
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/")}
                  >
                    BACk TO LOGIN
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    //   className={classes.buttonStyle}
                    // inputRef={buttonref}
                    ref={buttonref}
                    // onKeyDown={submitKeyDown}
                    type="submit"
                    onClick={resendOTP}
                    disabled={loading}
                  >
                    {loading === false && "Resend OTP"}
                    <PulseLoader
                      color={"#353b48"}
                      loading={loading}
                      size={10}
                      speedMultiplier={0.5}
                    />{" "}
                  </Button>
                </Grid>
              </Grid>
            </React.Fragment>
          )} */}
            {otpTimeOut === false && (
              <React.Fragment>
                <Grid
                  id="mainGrid"
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={3}
                >
                  <Grid item xs={12}>
                    <OtpInput
                      value={myOTP.otp}
                      onChange={handleChange}
                      numInputs={6}
                      isInputNum={true}
                      // shouldAutoFocus={true}
                      isInputSecure={true}
                      renderSeparator={<span> &nbsp;&nbsp;</span>}
                      inputStyle={
                        errors?.length > 0 ? newErrorInputStyle : newInputStyle
                      }
                      // focusStyle={newFocusStyle}
                      focusStyle={{
                        outline: "none",
                        border: "2px solid red",
                        borderRadius: "8px",
                      }}
                      renderInput={(props) => (
                        <input
                          {...props}
                          className={
                            errors?.length > 0
                              ? "error-custom-otp-input"
                              : "custom-otp-input"
                          }
                        />
                      )}
                    />
                    {errors?.length > 0 && (
                      <Typography
                        variant="medium"
                        color="error.main"
                        sx={{ mt: 0.75, fontWeight: 500, textAlign: "left" }}
                      >
                        <svg
                          width="17"
                          height="16"
                          viewBox="0 0 17 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ position: "relative", top: 3 }}
                        >
                          <path
                            d="M8.28581 14.6667C11.9525 14.6667 14.9525 11.6667 14.9525 8.00004C14.9525 4.33337 11.9525 1.33337 8.28581 1.33337C4.61914 1.33337 1.61914 4.33337 1.61914 8.00004C1.61914 11.6667 4.61914 14.6667 8.28581 14.6667Z"
                            stroke="#F23836"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8.28906 10.6666L8.28906 7.33329"
                            stroke="#F23836"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8.29199 5.33337L8.286 5.33337"
                            stroke="#F23836"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        &nbsp; Please enter valid OTP
                      </Typography>
                    )}
                    <Typography
                      variant="medium"
                      color="text.main"
                      sx={{ mt: 0.75, fontWeight: 500, textAlign: "left" }}
                    >
                      {/* 5:00 */}
                      <Countdown
                        date={targetTimeRef.current}
                        renderer={renderer}
                      />
                    </Typography>
                    <Typography
                      variant="medium"
                      color="text.light"
                      sx={{
                        mt: 0.75,
                        mt: 2.5,
                        fontWeight: 500,
                        textAlign: "left",
                      }}
                    >
                      Didn’t receive a code?
                      <Button
                        sx={{
                          color: "#222222",
                          borderBottom: !loading2 && "1px solid #222222",
                          borderRadius: "0px",
                          p: 0,
                        }}
                        disabled={loading2}
                        onClick={resendOtp}
                      >
                        RESEND
                      </Button>
                    </Typography>
                  </Grid>

                  {/* <Grid item xs={12}>
                    <Button
                      disableElevation
                      variant="contained"
                      fullWidth
                      color="primary"
                      style={{ minHeight: "37px" }}
                      //   className={classes.buttonStyle}
                      // inputRef={buttonref}
                      ref={buttonref}
                      // onKeyDown={submitKeyDown}
                      type="submit"
                      onClick={onSubmit}
                      disabled={loading}
                    >
                      {loading === false && "Continue"}
                      <PulseLoader
                        color={"#353b48"}
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
                  </Grid> */}
                </Grid>
              </React.Fragment>
            )}
          </div>
        </Grid>
      ) : (
        <ForgotPasswordResetPassword
          email={email}
          otp={myOTP.otp}
          reference={reference}
        />
      )}
    </React.Fragment>
  );
};

export default ForgotPasswordOTPVarify;
