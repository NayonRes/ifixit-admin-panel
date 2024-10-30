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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  customerTypeList,
  designationList,
  ratingList,
  roleList,
} from "../../data";
import { handlePostData } from "../../services/PostDataService";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px 24px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#EAECF0",
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
const form = {
  padding: "50px",
  background: "#fff",
  borderRadius: "10px",
  width: "800px",
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
};
const AddSupplier = ({ clearFilter }) => {
  const navigate = useNavigate();

  const [addDialog, setAddDialog] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [remarks, setRemarks] = useState("");
  const [address, setAddress] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationNumber, setOrganizationNumber] = useState("");
  const [organizationEmail, setOrganizationEmail] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");

  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setAddDialog(false);
    }
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

  const clearForm = () => {
    setName("");
    setNumber("");
    setEmail("");
    setAddress("");
    setOrganizationName("");
    setOrganizationNumber("");
    setOrganizationEmail("");
    setOrganizationAddress("");
    setRemarks("");
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // var formdata = new FormData();
    // formdata.append("name", name);

    // formdata.append("parent_id", parent_id);

    let data = {
      name: name.trim(),
      mobile: number.trim(),
      email: email.trim(),
      address: address.trim(),
      organizationName: organizationName.trim(),
      organizationNumber: organizationNumber.trim(),
      organizationEmail: organizationEmail.trim(),
      organizationAddress: organizationAddress.trim(),

      remarks: remarks.trim(),
    };

    let response = await handlePostData("/api/v1/supplier", data, false);

    console.log("response", response);

    if (response.status >= 200 && response.status < 300) {
      handleSnakbarOpen("Added successfully", "success");
      clearFilter(); // this is for get the table list again

      clearForm();
      handleDialogClose();
    } else {
      handleSnakbarOpen(response?.data?.message, "error");
    }

    setLoading(false);
    // }
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

  const customeSelectFeild = {
    background: "#ffffff",

    "& label.Mui-focused": {
      color: "#E5E5E5",
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px 16px",
    },
    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px",
      "& fieldset": {
        borderColor: "#E5E5E5",
      },

      "&:hover fieldset": {
        borderColor: "#E5E5E5",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#E5E5E5",
      },
    },
  };

  return (
    <>
      <Button
        variant="contained"
        disableElevation
        sx={{ py: 1.125, px: 2, borderRadius: "6px" }}
        onClick={() => {
          setAddDialog(true);
          // getDropdownList();
        }}
        startIcon={
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.99996 4.16675V15.8334M4.16663 10.0001H15.8333"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        }
      >
        Add Supplier
      </Button>

      <Dialog
        open={addDialog}
        onClose={handleDialogClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "16px", // Customize the border-radius here
          },
        }}
        PaperProps={{
          component: "form",
          onSubmit: onSubmit,
        }}
        maxWidth="xl"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontSize: "20px",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            color: "#0F1624",
            position: "relative",
            px: 2,
            borderBottom: "1px solid #EAECF1",
          }}
        >
          Add Supplier
          <IconButton
            sx={{ position: "absolute", right: 0, top: 0 }}
            onClick={() => setAddDialog(false)}
          >
            <svg
              width="46"
              height="44"
              viewBox="0 0 46 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29 16L17 28M17 16L29 28"
                stroke="#656E81"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            maxWidth: "800px",
            minWidth: "800px",
            px: 2,
            borderBottom: "1px solid #EAECF1",
            my: 1,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={6}>
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
                sx={{ ...customeTextFeild, mb: 2 }}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Grid>
            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Mobile Number
              </Typography>
              <TextField
                required
                size="small"
                fullWidth
                id="number"
                placeholder="Mobile Number"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 2 }}
                value={number}
                onChange={(e) => {
                  setNumber(e.target.value);
                }}
              />
            </Grid>
            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Supplier Email
              </Typography>
              <TextField
                type="email"
                size="small"
                fullWidth
                id="email"
                placeholder="Supplier Email"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 2 }}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Grid>
            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Supplier Address
              </Typography>
              <TextField
                size="small"
                fullWidth
                id="address"
                placeholder="Supplier Address"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 2 }}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </Grid>

            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Organization Name
              </Typography>
              <TextField
                size="small"
                fullWidth
                id="organizationName"
                placeholder="Organization Name"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 2 }}
                value={organizationName}
                onChange={(e) => {
                  setOrganizationName(e.target.value);
                }}
              />
            </Grid>
            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Organization Number
              </Typography>
              <TextField
                size="small"
                fullWidth
                id="organizationNumber"
                placeholder="Organization Number"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 2 }}
                value={organizationNumber}
                onChange={(e) => {
                  setOrganizationNumber(e.target.value);
                }}
              />
            </Grid>
            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Organization Email
              </Typography>
              <TextField
                type="email"
                size="small"
                fullWidth
                id="organizationEmail"
                placeholder="Organization Email"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 2 }}
                value={organizationEmail}
                onChange={(e) => {
                  setOrganizationEmail(e.target.value);
                }}
              />
            </Grid>
            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Organization Address
              </Typography>
              <TextField
                size="small"
                fullWidth
                id="organizationAddress"
                placeholder="Organization Address"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 2 }}
                value={organizationAddress}
                onChange={(e) => {
                  setOrganizationEmail(e.target.value);
                }}
              />
            </Grid>

            <Grid size={12}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Add Note
              </Typography>
              <TextField
                multiline
                rows={2}
                size="small"
                fullWidth
                id="membershipId"
                placeholder="Add Note"
                variant="outlined"
                sx={{ ...customeTextFeild }}
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 2 }}>
          <Button
            variant="outlined"
            onClick={handleDialogClose}
            sx={{
              px: 2,
              py: 1.25,
              fontSize: "14px",
              fontWeight: 600,
              color: "#344054",
              border: "1px solid #D0D5DD",
              boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            type="submit"
            sx={{
              px: 2,
              py: 1.25,
              fontSize: "14px",
              fontWeight: 600,
              minWidth: "127px",
              minHeight: "44px",
            }}
            // style={{ minWidth: "180px", minHeight: "35px" }}
            autoFocus
            disableElevation
          >
            <PulseLoader
              color={"#353b48"}
              loading={loading}
              size={10}
              speedMultiplier={0.5}
            />{" "}
            {loading === false && "Save changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddSupplier;
