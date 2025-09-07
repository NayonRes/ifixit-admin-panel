import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ColorPalette from "../../color-palette/ColorPalette";
import { BackHand } from "@mui/icons-material";
import { getDataWithToken } from "../../services/GetDataService";
import { AuthContext } from "../../context/AuthContext";

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

const cash = "/cash.png";
const ucb = "/ucb.png";

const city = "/city.png";

const brac = "/brac.png";

const ssl = "/ssl.png";

const bkash = "/bkash.png";

const due = "/due.png";
const discount = "/discount.png";

let paymentMethodList = [
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
  discount_amount,
  set_discount_amount,
  allIssue,
  allSpareParts,
  billCollections,
  setBillCollections,
  allInfo,
  setAllInfo,
}) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [amounts, setAmounts] = useState([]);

  const totalAmount =
    allIssue.reduce((sum, item) => sum + item.repair_cost, 0) +
    allSpareParts.reduce((sum, item) => sum + item.price, 0);

  const totalPaidAmount = (data) => {
    const paidAmount = data?.reduce((sum, item) => sum + (item.amount || 0), 0);
    return paidAmount;
  };
  // const handleChange = (name, value) => {
  //   const updatedAmounts = [...billCollections];
  //   const index = updatedAmounts.findIndex((item) => item.name === name);

  //   if (value === 0) {
  //     // Remove the entry if the amount is 0
  //     if (index !== -1) {
  //       updatedAmounts.splice(index, 1);
  //     }
  //   } else {
  //     if (index !== -1) {
  //       updatedAmounts[index].amount = value;
  //     } else {
  //       updatedAmounts.push({ name, amount: value });
  //     }
  //   }
  //   const groupedPayments = updatedAmounts.reduce((acc, item) => {
  //     if (!acc[item.name]) {
  //       acc[item.name] = 0;
  //     }
  //     acc[item.name] += item.amount;
  //     return acc;
  //   }, {});

  //   // convert back to array of objects
  //   const paymentInfo = Object.entries(groupedPayments).map(([key, value]) => ({
  //     name: key,
  //     amount: value,
  //   }));
  //   // setAmounts(updatedAmounts);
  //   set_payment_info(paymentInfo);
  //   // todays collections
  //   setBillCollections(updatedAmounts);

  //   // const paidAmount = totalPaidAmount(updatedAmounts);

  //   // const dueAmount = totalAmount - paidAmount - discount_amount;

  //   // set_due_amount(dueAmount);
  // };
  const handleChange = (name, value) => {
    let updatedAmounts;

    if (isNaN(value)) {
      // Remove the entry if value is not a number
      updatedAmounts = billCollections.filter((item) => item.name !== name);
    } else {
      const exists = billCollections.some((item) => item.name === name);

      if (exists) {
        // Update the amount of the existing name
        updatedAmounts = billCollections.map((item) =>
          item.name === name ? { ...item, amount: value } : item
        );
      } else {
        // Add a new entry
        updatedAmounts = [...billCollections, { name, amount: value }];
      }
    }

    // Update state
    setBillCollections(updatedAmounts);
    // Merge with existing payment_info
    set_payment_info((prev) => {
      // Find the initial amount from allInfo (backend snapshot)
      const base =
        allInfo?.payment_info?.find((item) => item.name === name)?.amount || 0;

      const exists = prev.some((item) => item.name === name);

      if (exists) {
        // Update existing, but recalc from base
        return prev.map((item) =>
          item.name === name
            ? { ...item, amount: base + value } // always base + new value
            : item
        );
      } else {
        // Add new entry using base + value
        return [...prev, { name, amount: base + value }];
      }
    });
  };

  useEffect(() => {
    if (payment_info && payment_info.length > 0) {
      setAmounts(payment_info);
    }
  }, []);

  // useEffect(() => {
  //   const paidAmount = totalPaidAmount(billCollections);
  //   const dueAmount = totalAmount - paidAmount - discount_amount;

  //   set_due_amount(dueAmount);
  // }, [billCollections, totalAmount, discount_amount]);

  return (
    <div>
      <Grid container columnSpacing={3} sx={{}}>
        <Grid size={12}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 3 }}>
              Payment Status
            </Typography>
            {/* <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 600, mb: 3 }}
            >
              Payment Received Time: 15/04/2024 12:35:38
            </Typography> */}
          </Box>
        </Grid>
      </Grid>
      {/* {JSON.stringify(amounts)} Amount: */}
      <TableContainer
        sx={{
          borderRadius: "16px",
          borderRadius: "8px 8px 0 0",
          border: "3px solid #eee",
          mt: 0,
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell style={{ whiteSpace: "nowrap", background: "#fff" }}>
                Methods
              </TableCell>
              {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                Purchase date
                </TableCell> */}

              <TableCell style={{ whiteSpace: "nowrap", background: "#fff" }}>
                Received Amount
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap", background: "#fff" }}>
                Amount
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap", background: "#fff" }}>
                Total Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {!loading &&
                  details?.repair_attached_spareparts_data?.length > 0 &&
                  details?.repair_attached_spareparts_data
                    ?.filter((item) => item?.is_warranty_claimed_sku === false)
                    ?.map((row, i) => ( */}
            {paymentMethodList.length > 0 &&
              paymentMethodList.map((item, index) => (
                <TableRow
                  // key={i}
                  // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  style={index % 2 === 0 ? { background: "#F9FAFB" } : null}
                >
                  <TableCell sx={{ minWidth: "400px" }}>
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
                        <img
                          src={item?.icon}
                          style={{ maxHeight: "30px" }}
                          alt=""
                        />
                      </Box>
                      <Box>{item.name}</Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ minWidth: "130px" }}>
                    {allInfo?.payment_info?.find(
                      (res) => res?.name === item.name
                    )?.amount || 0}{" "}
                  </TableCell>
                  <TableCell sx={{ width: "200px" }}>
                    <TextField
                      required
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      size="small"
                      fullWidth
                      variant="outlined"
                      sx={{ ...customeTextFeild, mb: 0 }}
                      onChange={(e) => {
                        const value = e.target.value;

                        // allow only digits (no e, -, +)
                        if (/^\d*$/.test(value)) {
                          handleChange(
                            item.name,
                            value === "" ? 0 : Number(value)
                          );
                        }
                      }}
                      onKeyDown={(e) => {
                        // Prevent typing e, +, -, .
                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      // onChange={(e) =>
                      //   handleChange(
                      //     item.name,
                      //     parseFloat(e.target.value) || 0
                      //   )
                      // }
                      value={
                        billCollections.find(
                          (entry) => entry.name === item.name
                        )?.amount || ""
                      }
                      // value={membershipId}
                      // onChange={(e) => {
                      //   setMembershipId(e.target.value);
                      // }}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: "130px" }}>
                    {payment_info?.find((el) => el.name === item.name)?.amount}
                  </TableCell>
                </TableRow>
              ))}

            <TableRow
            // key={i}
            // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell sx={{ minWidth: "400px" }}>
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
              </TableCell>
              <TableCell></TableCell>
              <TableCell sx={{ width: "200px" }}>
                <TextField
                  required
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  size="small"
                  fullWidth
                  variant="outlined"
                  sx={{
                    ...customeTextFeild,
                    mb: 0,
                    background: due_amount < 0 && "#ff7a7a",
                  }}

                     onKeyDown={(e) => {
                        // Prevent typing e, +, -, .
                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                  value={due_amount}
                  onChange={(e) => {
                    set_due_amount(e.target.value);
                  }}
                />
              </TableCell>{" "}
              <TableCell>{due_amount}</TableCell>
            </TableRow>
            <TableRow
            // key={i}
            // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell sx={{ minWidth: "400px" }}>
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
                    <img src={discount} style={{ maxHeight: "30px" }} alt="" />
                  </Box>
                  <Box>Discount</Box>
                </Box>
              </TableCell>
              <TableCell></TableCell>
              <TableCell sx={{ width: "200px" }}>
                <TextField
                  required
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  size="small"
                  fullWidth
                  variant="outlined"
                  sx={{ ...customeTextFeild, mb: 0 }}
                  value={discount_amount}
                  onChange={(e) => {
                    set_discount_amount(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    // Prevent typing e, +, -, .
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </TableCell>{" "}
              <TableCell>{discount_amount}</TableCell>
            </TableRow>

            <TableRow
              // key={i}
              // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              sx={{ py: 4 }}
            >
              <TableCell
                align="right"
                sx={{
                  minWidth: "400px",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#fff",
                  overflow: "hidden",
                  borderRadius: "0 0 0 8px",
                  background: "#4238CA",
                  py: 2,
                }}
                colSpan={1}
              >
                Total Amount
              </TableCell>
              <TableCell sx={{ background: "#4238CA", py: 2 }}></TableCell>
              <TableCell sx={{ background: "#4238CA", py: 2 }}></TableCell>

              <TableCell
                align="right"
                sx={{
                  color: "#fff",
                  overflow: "hidden",
                  borderRadius: "0 0 8px",
                  background: "#4238CA",
                  py: 2,
                }}
              >
                {totalAmount}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* <Grid
        container
        spacing={0}
        sx={{
          mt: 0,
          borderRadius: "8px 8px 0 0",
          border: "3px solid #eee",
          borderRadius: 2,
        }}
      >
        {paymentMethodList.length > 0 &&
          paymentMethodList.map((item, index) => (
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
                    <img
                      src={item?.icon}
                      style={{ maxHeight: "30px" }}
                      alt=""
                    />
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
                    value={
                      amounts.find((entry) => entry.name === item.name)
                        ?.amount || ""
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
                sx={{
                  ...customeTextFeild,
                  mb: 0,
                  background: due_amount < 0 && "#ff7a7a",
                }}
                value={due_amount}
                // onChange={(e) => {
                //   set_due_amount(e.target.value);
                // }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid size={12} sx={{ p: 1 }}>
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
                <img src={discount} style={{ maxHeight: "30px" }} alt="" />
              </Box>
              <Box>Discount</Box>
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
                value={discount_amount}
                onChange={(e) => {
                  set_discount_amount(e.target.value);
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
                value={totalAmount}
                // value={
                //   allIssue.reduce((sum, item) => sum + item.repair_cost, 0) +
                //   allSpareParts.reduce((sum, item) => sum + item.price, 0)
                // }
                // value={membershipId}
                // onChange={(e) => {
                //   setMembershipId(e.target.value);
                // }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid> */}
    </div>
  );
};

export default PaymentList;
