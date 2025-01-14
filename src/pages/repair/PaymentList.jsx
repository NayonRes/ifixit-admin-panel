import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ColorPalette from "../../color-palette/ColorPalette";
import { BackHand } from "@mui/icons-material";
import { getDataWithToken } from "../../services/GetDataService";

const style = {
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 3,
    pb: 1,
    borderBottom: `1px solid ${ColorPalette.light.primary.light}`,
    width: "100%",
  },
  link: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 1,
    px: "4px",
  },
  linkActive: {
    cursor: "pointer",
    color: ColorPalette.light.primary.main,
    display: "flex",
    alignItems: "center",
    position: "relative",
    gap: 1,
    px: "4px",
    "&:before": {
      content: '""',
      width: "100%",
      height: "2px",
      backgroundColor: ColorPalette.light.primary.main,
      position: "absolute",
      bottom: -9,
      left: 0,
      right: 0,
    },
  },
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 2,
    border: `1px solid ${ColorPalette.light.primary.light}`,
    backgroundColor: ColorPalette.light.text.bg,
    borderRadius: "8px",
    height: "100%",
    width: "100%",
    p: 2,
  },
  cardActive: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 2,
    border: `3px solid ${ColorPalette.light.primary.main}`,
    backgroundColor: ColorPalette.light.text.bg,
    borderRadius: "8px",
    height: "100%",
    width: "100%",
    p: 2,
  },
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

const cash = "./cash.png";
const ucb = "./ucb.png";

const city = "./city.png";

const brac = "./brac.png";

const ssl = "./ssl.png";

const bkash = "./bkash.png";

const due = "./due.png";

let statusList = [
  { name: "Cash", color: "#FEF7C3", icon: cash },
  { name: "UCB", color: "#FEE4E2", icon: ucb },
  { name: "City", color: "#DCFAE6", icon: city },
  { name: "Brac", color: "#FFE6D5", icon: brac },
  { name: "SSL", color: "#E0E8FF", icon: ssl },
  { name: "Bkash", color: "#EBE9FE", icon: bkash },
  { name: "Due", color: "#FDEAD7", icon: due },
];
const PaymentList = ({ paymentStatus, setPaymentStatus }) => {
  return (
    <div>
      <Grid container columnSpacing={3} sx={{}}>
        <Grid size={12}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 3 }}>
            Payment Status
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 3 }}>
        {statusList.length > 0 &&
          statusList.map((item, index) => (
            <Grid size={12} key={index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  height: "100%",
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    flex: 1,
                  }}
                >
                  <Box>
                    <img src={item.icon} style={{ maxHeight: "30px" }} alt="" />
                  </Box>
                  <Box>{item.name}</Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    required
                    type="text"
                    size="small"
                    fullWidth
                    placeholder="Enter Membership ID"
                    variant="outlined"
                    sx={{ ...customeTextFeild, mb: 0 }}
                    // value={membershipId}
                    // onChange={(e) => {
                    //   setMembershipId(e.target.value);
                    // }}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default PaymentList;
