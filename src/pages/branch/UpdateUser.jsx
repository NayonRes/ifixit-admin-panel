import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
const useStyles = makeStyles((theme) => ({
  form: {
    padding: "50px",
    background: "#fff",
    borderRadius: "10px",
    width: "400px",
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  },
}));
const UpdateUser = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { state } = useLocation();
  const uploadImage = "/image/userpic.png";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@dg.com");
  const [password, setPassword] = useState("admin12345");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(false);
  const [parentName, setParentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [parentList, setParentList] = useState([]);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [roleList, setRoleList] = useState([]);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null); 
  const [preview, setPreview] = useState(uploadImage);
  const { enqueueSnackbar } = useSnackbar();
  const handleChange = (event) => {
    setParentName(event.target.value);
  };
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
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
        // formdata.append("email", email);
        formdata.append("password", password);
        formdata.append("role_id", roleId);
        formdata.append("status", status);
        if (imageFile) {
          formdata.append("image", imageFile);
        }

        let response = await axios({
          url: `/api/v1/user/update-profile/${state?.row?._id}`,
          method: "put",
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

  const getData = async () => {
    try {
      setRoleLoading(true);

      const allDataUrl = `/api/v1/role/dropdownlist`;
      let allData = await getDataWithToken(allDataUrl);
      console.log("allData", allData.data);

      if (allData.status >= 200 && allData.status < 300) {
        setRoleList(allData?.data?.data);

        if (allData.data.data.length < 1) {
          setMessage("No data found");
        }
      }
      setRoleLoading(false);
    } catch (error) {
      console.log("error", error?.response);
      setRoleLoading(false);
      handleSnakbarOpen(error.response.data.message.toString(), "error");
    }
  };

  useEffect(() => {
    getData();
    console.log("state?.row", state?.row);

    setRoleId(state?.row?.role[0]?.role_id);

    setName(state?.row?.name);
    // setEmail(state?.row?.email);
    setPreview(state?.row?.image?.url);
    setStatus(state?.row?.status);
  }, []);
  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "85vh" }}
      >
        <form className={classes.form} onSubmit={onSubmit}>
          <Typography
            variant="h5"
            style={{ marginBottom: "30px", textAlign: "center" }}
          >
            Update User
          </Typography>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
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
          </div>
          <TextField
            size="small"
            style={{ marginBottom: "30px" }}
            fullWidth
            id="name"
            label="User Name"
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          {/* <TextField
            autoFocus
            label="Email"
            fullWidth
            size="small"
            className={classes.inputStyle}
            style={{ marginBottom: "30px" }}
            variant="outlined"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /> */}
          <FormControl
            fullWidth
            variant="outlined"
            style={{ marginBottom: "30px" }}
          >
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl fullWidth size="small" style={{ marginBottom: "30px" }}>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="parent-id"
              value={roleId}
              label="Role"
              onChange={(e) => setRoleId(e.target.value)}
            >
              {roleList?.map((item, i) => (
                <MenuItem key={item.role_id} value={item.role_id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" style={{ marginBottom: "30px" }}>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="status"
              value={status}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </Select>
          </FormControl>
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
      </Grid>
    </>
  );
};

export default UpdateUser;
