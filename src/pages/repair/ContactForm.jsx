import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { designationList, roleList } from "../../data";

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

const ContactForm = () => {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [email, setEmail] = useState("");
  const [remark, setRemark] = useState("");
  const [rating, setRating] = useState("");
  const [membershipId, setMembershipId] = useState("");

  const [ratingList, setRatingList] = useState([
    { _id: 1, name: "Excellent" },
    { _id: 2, name: "Good" },
    { _id: 3, name: "Neutral" },
    { _id: 4, name: "Bad" },
    { _id: 5, name: "Very Bad" },
  ]);
  const [customerTypeList, setCustomerTypeList] = useState([
    "Walk In",
    "Corporate",
  ]);

  return (
    <>
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
          sx={{ ...customeTextFeild, mb: 3 }}
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
          sx={{ ...customeTextFeild, mb: 3 }}
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
            mb: 3,
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
          sx={{ ...customeTextFeild, mb: 3 }}
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
          sx={{ ...customeTextFeild, mb: 3 }}
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
          {ratingList?.length < 1 && (
            <InputLabel
              id="demo-simple-select-label"
              sx={{ color: "#b3b3b3", fontWeight: 300 }}
            >
              Select Rating
            </InputLabel>
          )}
          <Select
            required
            labelId="demo-simple-select-label"
            id="rating"
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 250, // Set the max height here
                },
              },
            }}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {ratingList?.map((item) => (
              <MenuItem key={item?._id} value={item?._id}>
                {item?.name}
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
          type="email"
          size="small"
          fullWidth
          id="email"
          placeholder="Enter Membership ID"
          variant="outlined"
          sx={{ ...customeTextFeild, mb: 3 }}
          value={membershipId}
          onChange={(e) => {
            setMembershipId(e.target.value);
          }}
        />
      </Grid>
    </>
  );
};

export default ContactForm;
