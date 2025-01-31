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
];
const PaymentList = ({
  paymentStatus,
  setPaymentStatus,
  payment_info,
  set_payment_info,
  due_amount,
  set_due_amount,
  allIssue,
  allSpareParts,
}) => {
  const [amounts, setAmounts] = useState([]);

  const handleChange = (name, value) => {
    const updatedAmounts = [...amounts];
    const index = updatedAmounts.findIndex((item) => item.name === name);

    if (value === 0) {
      // Remove the entry if the amount is 0
      if (index !== -1) {
        updatedAmounts.splice(index, 1);
      }
    } else {
      if (index !== -1) {
        updatedAmounts[index].amount = value;
      } else {
        updatedAmounts.push({ name, amount: value });
      }
    }

    setAmounts(updatedAmounts);
    set_payment_info(updatedAmounts);
  };

  return (
    <div>
      <Grid container columnSpacing={3} sx={{}}>
        <Grid size={12}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 3 }}>
              Payment Status
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 600, mb: 3 }}
            >
              Payment Received Time: 15/04/2024 12:35:38
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={0}
        sx={{
          mt: 0,
          borderRadius: "8px 8px 0 0",
          border: "3px solid #eee",
          borderRadius: 2,
        }}
      >
        {statusList.length > 0 &&
          statusList.map((item, index) => (
            <Grid
              size={12}
              key={index}
              sx={{ p: 1 }}
              style={index % 2 === 0 ? { background: "#F9FAFB" } : null}
            >
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
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    size="small"
                    fullWidth
                    variant="outlined"
                    sx={{ ...customeTextFeild, mb: 0 }}
                    onChange={(e) =>
                      handleChange(item.name, parseFloat(e.target.value) || 0)
                    }
                    // value={membershipId}
                    // onChange={(e) => {
                    //   setMembershipId(e.target.value);
                    // }}
                  />
                </Box>
              </Box>
            </Grid>
          ))}

        <Grid size={12} sx={{ p: 1, background: "#F9FAFB" }}>
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
                <img src={due} style={{ maxHeight: "30px" }} alt="" />
              </Box>
              <Box>Due</Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                required
                type="number"
                onWheel={(e) => e.target.blur()}
                size="small"
                fullWidth
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 0 }}
                value={due_amount}
                onChange={(e) => {
                  set_due_amount(e.target.value);
                }}
              />
            </Box>
          </Box>
        </Grid>

        <Grid
          size={12}
          sx={{
            p: 1,
            background: ColorPalette.light.primary.main,
            color: "white",
            borderRadius: "0 0 8px 8px",
          }}
        >
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
              <Box></Box>
              <Box>Total Amount</Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                required
                type="number"
                onWheel={(e) => e.target.blur()}
                size="small"
                fullWidth
                variant="outlined"
                sx={{ mb: 0, background: "#fff", borderRadius: 1 }}
                value={
                  allIssue.reduce((sum, item) => sum + item.repair_cost, 0) +
                  allSpareParts.reduce((sum, item) => sum + item.price, 0)
                }
                // value={membershipId}
                // onChange={(e) => {
                //   setMembershipId(e.target.value);
                // }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default PaymentList;
