import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

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
  boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
  background: "#ffffff",

  "& label.Mui-focused": {
    color: "#E5E5E5",
  },

  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-input": {
    // padding: "10px 16px",
  },
  "& .MuiOutlinedInput-root": {
    // paddingLeft: "24px",
    "& fieldset": {
      borderColor: "#",
    },

    "&:hover fieldset": {
      borderColor: "#969696",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#969696",
    },
  },
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
};

export default function EditContactForm({ contactData }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [email, setEmail] = useState("");
  const [remark, setRemark] = useState("");
  const [rating, setRating] = useState("");
  const [color, setColor] = useState("");
  const [membershipId, setMembershipId] = useState("");

  const [ratingList, setRatingList] = useState([
    { _id: 1, name: "Excellent", color: "#6439FF" },
    { _id: 2, name: "Good", color: "#00B781" },
    { _id: 3, name: "Neutral", color: "#79D7BE" },
    { _id: 4, name: "Bad", color: "#F0BB78" },
    { _id: 5, name: "Very Bad", color: "#EB5B00" },
  ]);
  const [customerTypeList, setCustomerTypeList] = useState([
    "Walk In",
    "Corporate",
  ]);

  const handleRatingWithColor = (rating_id) => {
    const selectedRating = ratingList.find((r) => r._id === rating_id);

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircleIcon
          style={{ color: selectedRating.color, height: "20px", width: "20px" }}
        />
        {selectedRating.name}
      </Box>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const getInitData = async () => {
    if (contactData) {
      setFullName(contactData?.name);
      setMobile(contactData?.mobile);
      setCustomerType(contactData?.customer_type);
      setEmail(contactData?.email);
      setRemark(contactData?.remarks);
      setRating(contactData?.rating);
      setMembershipId(contactData?.membership_id);
    }
  };

  useEffect(() => {
    getInitData();
  }, []);

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant="outlined"
        color=""
        // disabled={loading3}
        disableElevation
        // sx={{
        //   py: 1.125,
        //   px: 2,
        //   borderRadius: "6px",
        //   minWidth: "150px",
        //   ml: 1,
        // }}
        // onClick={onSubmit}
        startIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Outline"
            viewBox="0 0 24 24"
            width="16"
            height="16"
          >
            <path
              d="M18.656.93,6.464,13.122A4.966,4.966,0,0,0,5,16.657V18a1,1,0,0,0,1,1H7.343a4.966,4.966,0,0,0,3.535-1.464L23.07,5.344a3.125,3.125,0,0,0,0-4.414A3.194,3.194,0,0,0,18.656.93Zm3,3L9.464,16.122A3.02,3.02,0,0,1,7.343,17H7v-.343a3.02,3.02,0,0,1,.878-2.121L20.07,2.344a1.148,1.148,0,0,1,1.586,0A1.123,1.123,0,0,1,21.656,3.93Z"
              fill="#666"
            />
            <path
              d="M23,8.979a1,1,0,0,0-1,1V15H18a3,3,0,0,0-3,3v4H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2h9.042a1,1,0,0,0,0-2H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H16.343a4.968,4.968,0,0,0,3.536-1.464l2.656-2.658A4.968,4.968,0,0,0,24,16.343V9.979A1,1,0,0,0,23,8.979ZM18.465,21.122a2.975,2.975,0,0,1-1.465.8V18a1,1,0,0,1,1-1h3.925a3.016,3.016,0,0,1-.8,1.464Z"
              fill="#666"
            />
          </svg>
        }
      >
        Edit
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={style}>
            <Grid size={12}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{ color: "#0F1624", fontWeight: 600 }}
                >
                  Edit Contact
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Grid>
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
                id="full_name"
                placeholder="Full Name"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 1 }}
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
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
                Mobile
              </Typography>
              <TextField
                required
                size="small"
                fullWidth
                id="mobile"
                placeholder="Enter Number"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 1 }}
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
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
                Customer Type
              </Typography>

              <FormControl
                fullWidth
                size="small"
                sx={{
                  ...customeSelectFeild,
                  "& label.Mui-focused": {
                    color: "rgba(0,0,0,0)",
                  },

                  "& .MuiOutlinedInput-input img": {
                    position: "relative",
                    top: "2px",
                  },
                  mb: 1,
                }}
              >
                {customerTypeList?.length < 1 && (
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "#b3b3b3", fontWeight: 300 }}
                  >
                    Select Customer type
                  </InputLabel>
                )}
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="customer_type"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 250, // Set the max height here
                      },
                    },
                  }}
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                >
                  {customerTypeList?.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}>
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
                sx={{ ...customeTextFeild, mb: 1 }}
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
                Remark
              </Typography>
              <TextField
                required
                size="small"
                fullWidth
                id="remark"
                placeholder="Enter Remark"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 1 }}
                value={remark}
                onChange={(e) => {
                  setRemark(e.target.value);
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
                Rating
              </Typography>

              <FormControl
                fullWidth
                size="small"
                sx={{
                  ...customeSelectFeild,
                  "& label.Mui-focused": {
                    color: "rgba(0,0,0,0)",
                  },

                  "& .MuiOutlinedInput-input img": {
                    position: "relative",
                    top: "2px",
                  },
                  mb: 3,
                }}
              >
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  {ratingList?.map((item) => (
                    <MenuItem key={item?._id} value={item?._id}>
                      {handleRatingWithColor(item?._id)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Membership ID
              </Typography>
              <TextField
                required
                type="text"
                size="small"
                fullWidth
                id="email"
                placeholder="Enter Membership ID"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 1 }}
                value={membershipId}
                onChange={(e) => {
                  setMembershipId(e.target.value);
                }}
              />
            </Grid>
            <Grid size={12}>
              <Box
                sx={{
                  borderTop: "1px solid #EAECF1",
                  pt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Save changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Modal>
    </div>
  );
}
