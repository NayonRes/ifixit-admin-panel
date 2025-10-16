import React, { useContext, useEffect, useState } from "react";
import { Box, Chip, Paper, Skeleton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ColorPalette from "../../color-palette/ColorPalette";
import { BackHand } from "@mui/icons-material";
import { getDataWithToken } from "../../services/GetDataService";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import ReportDetails from "./ReportDetails";

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
    cursor: "pointer",
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
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 2,
    border: `1px solid ${ColorPalette.light.primary.main}`,
    backgroundColor: ColorPalette.light.text.bg,
    borderRadius: "8px",
    height: "100%",
    width: "100%",
    p: 2,
  },
};

const Reports = ({
  technician,
  setTechnician,
  technicianName,
  setTechnicianName,
}) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);

  const { enqueueSnackbar } = useSnackbar();
  const [technicianList, setTechnicianList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [message, setMessage] = useState("");

  const [transactionData, setTransactionData] = useState([]);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [repairListDialog, setRepairListDialog] = useState(false);
  const [createdBy, setCreatedBy] = useState(null);

  const handleRepairListDialogClose = () => {
    setRepairListDialog(false);
    setCreatedBy(null);
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

  const getBranchId = () => {
    let token = ifixit_admin_panel.token;
    let decodedToken = jwtDecode(token);
    let branch_id = decodedToken?.user?.branch_id;
    return branch_id;
  };

  const getUsers = async () => {
    setLoading2(true);

    let branch_id = getBranchId();

    let newBranchId;

    // let url = `/api/v1/user/dropdownlist?designation=Manager`;
    let url = `/api/v1/user/dropdownlist`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setLoading2(false);

      const groupedData = {};

      allData?.data.data.forEach((user) => {
        user.branch_data.forEach((branch) => {
          if (!groupedData[branch._id]) {
            groupedData[branch._id] = {
              branch_data: {
                _id: branch._id,
                name: branch.name,
              },
              users: [],
            };
          }
          groupedData[branch._id].users.push(user);
        });
      });

      const finalArray = Object.values(groupedData);

      // console.log("finalArray*********************", finalArray);

      setTechnicianList(finalArray);
      // setTechnicianList(allData?.data.data);

      let name = allData?.data.data.filter((i) => i._id === technician);
      // setTechnicianName(name[0]?.name);

      // if (allData.data.data.length < 1) {
      //   setMessage("No Data found");
      // } else {
      //   setMessage("");
      // }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
  };

  const getTransactions = async () => {
    setTransactionLoading(true);

    let url = `/api/v1/transactionHistory/all?startDate=${dayjs().format(
      "YYYY-MM-DD"
    )}&is_collection_received=false`;

    let allData = await getDataWithToken(url);

    if (allData?.status === 401) {
      logout();
      return;
    }
    console.log("TransactionData ====================", allData?.data?.data);

    if (allData?.status >= 200 && allData?.status < 300) {
      setTransactionData(allData?.data?.data);

      if (allData?.data?.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setTransactionLoading(false);
  };

  const userReportData = (userEmail) => {
    // Filter transactions by created_by (user email)
    let allData = transactionData?.filter(
      (item) => item?.created_by === userEmail
    );

    let totalCreditAmount = 0;
    let totalDebitAmount = 0;
    let totalTransactionAmount = 0;

    if (allData?.length > 0) {
      allData.forEach((transaction) => {
        // Calculate total amount for this transaction
        const transactionTotal = transaction?.transaction_info?.length
          ? transaction.transaction_info.reduce(
              (sum, item) => sum + (item.amount || 0),
              0
            )
          : 0;

        totalTransactionAmount += transactionTotal;

        // Credit = Income, Debit = Outgoings (Expenses/Refunds)
        if (transaction.transaction_type === "credit") {
          totalCreditAmount += transactionTotal;
        } else if (transaction.transaction_type === "debit") {
          totalDebitAmount += transactionTotal;
        }
      });

      console.log("Transaction data for user:", userEmail, allData);
      console.log("Total Credit Amount (Income):", totalCreditAmount);
      console.log("Total Debit Amount (Outgoings):", totalDebitAmount);
      console.log("Total Transaction Amount:", totalTransactionAmount);
    }

    return {
      length: allData?.length > 0 ? allData?.length : 0,
      totalCreditAmount: totalCreditAmount, // Income
      totalDebitAmount: totalDebitAmount, // Outgoings (Expenses/Refunds)
      totalIncomeAmount: totalCreditAmount, // Same as credit
      totalOutgoingsAmount: totalDebitAmount, // Same as debit
      netBalance: totalCreditAmount - totalDebitAmount, // Net Balance
      totalAmount: totalTransactionAmount,
    };
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([getUsers(), getTransactions()]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <Grid container columnSpacing={3} style={{ padding: "24px 0" }}>
        <Grid size={9}>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ color: "#0F1624", fontWeight: 600 }}
          >
            Reports
          </Typography>
        </Grid>
        <Grid size={3} style={{ textAlign: "right" }}>
          {/* <Button
            disableElevation
            variant="outlined"
            size="large"
            // startIcon={<FilterListIcon />}
            onClick={() => setOpen(!open)}
          >
            {open ? <FilterListOffIcon /> : <FilterListIcon />}
          </Button> */}

          {/* <IconButton
            onClick={() => setOpen(!open)}
            // size="large"
            aria-label="show 5 new notifications"
            color="inherit"
          >
            <Badge badgeContent={5} color="error">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.3807 14.2348C13.9595 14.0475 15.4819 13.6763 16.9259 13.1432C15.7286 11.8142 14.9998 10.0547 14.9998 8.125V7.54099C14.9999 7.52734 15 7.51368 15 7.5C15 4.73858 12.7614 2.5 10 2.5C7.23858 2.5 5 4.73858 5 7.5L4.99984 8.125C4.99984 10.0547 4.27106 11.8142 3.07373 13.1432C4.51784 13.6763 6.04036 14.0475 7.61928 14.2348M12.3807 14.2348C11.6 14.3274 10.8055 14.375 9.99984 14.375C9.19431 14.375 8.3999 14.3274 7.61928 14.2348M12.3807 14.2348C12.4582 14.4759 12.5 14.7331 12.5 15C12.5 16.3807 11.3807 17.5 10 17.5C8.61929 17.5 7.5 16.3807 7.5 15C7.5 14.7331 7.54183 14.476 7.61928 14.2348"
                  stroke="#656E81"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Badge>
          </IconButton> */}
        </Grid>
      </Grid>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{}}>
          {!loading2 &&
            technicianList.length > 0 &&
            technicianList.map((item, index) => (
              <>
                <Typography
                  variant="h6"
                  sx={{ width: "100%", fontWeight: 600 }}
                >
                  {item?.branch_data?.name}
                </Typography>
                {item?.users?.length > 0 &&
                  item?.users?.map((item, i) => {
                    const report = userReportData(item?.email);
                    return (
                      <Grid size={3} key={i}>
                        <Box
                          // sx={
                          //   technician === item._id
                          //     ? style.cardActive
                          //     : style.card
                          // }

                          sx={{
                            borderRadius: "20px",

                            border: "1px solid #ebebeb",
                            cursor: "pointer",
                            "&:hover": {
                              boxShadow:
                                "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                            },
                            // p: 2,
                          }}
                          role="button"
                          onClick={() => {
                            setCreatedBy(item?.email);
                            setRepairListDialog(true);
                          }}
                        >
                          <Grid
                            container
                            alignItems="center"
                            columnSpacing={5}
                            rowSpacing={2}
                            sx={{
                              background: "#ECFDFF",
                              p: 2,
                              borderRadius: " 20px 20px 0 0",
                            }}
                          >
                            <Grid size={9}>
                              <Grid container alignItems="center" spacing={2}>
                                <Grid size="auto">
                                  {" "}
                                  <img
                                    src={
                                      item?.image?.url?.length > 0
                                        ? item?.image?.url
                                        : "/userpic.png"
                                    }
                                    alt=""
                                    width="40px"
                                    height="40px"
                                    style={{
                                      display: "block",
                                      margin: "5px 0px",
                                      borderRadius: "100px",
                                      // border: "1px solid #d1d1d1",
                                    }}
                                  />
                                </Grid>
                                <Grid size="auto">
                                  <Typography
                                    variant="base"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {item.name}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid size={3} sx={{ textAlign: "right" }}>
                              <Chip
                                label={report?.length}
                                color="success"
                                sx={{
                                  px: 1.5,
                                  minWidth: "auto",
                                  maxWidth: "none",
                                  whiteSpace: "nowrap",
                                  overflow: "visible",
                                  textOverflow: "clip",
                                }}
                              />
                            </Grid>
                            <Grid size={6} sx={{}}>
                              <Typography
                                variant="medium"
                                color="text.light"
                                sx={{ fontWeight: 400 }}
                              >
                                Total Transaction Amount
                              </Typography>
                              <Typography
                                variant="base"
                                sx={{ fontWeight: 600 }}
                              >
                                ৳ {report?.totalAmount}
                              </Typography>
                            </Grid>
                            <Grid size={6} sx={{ textAlign: "right" }}>
                              <Typography
                                variant="medium"
                                color="text.light"
                                sx={{ fontWeight: 400 }}
                              >
                                Net Balance
                              </Typography>
                              <Typography
                                variant="base"
                                sx={{
                                  fontWeight: 600,
                                  color:
                                    report?.netBalance >= 0
                                      ? "#2E7D32"
                                      : "#D32F2F",
                                }}
                              >
                                ৳ {report?.netBalance}
                              </Typography>
                            </Grid>
                            <Grid size={6} sx={{}}>
                              <Typography
                                variant="medium"
                                color="text.light"
                                sx={{ fontWeight: 400 }}
                              >
                                Total Income
                              </Typography>
                              <Typography
                                variant="base"
                                sx={{ fontWeight: 600, color: "#2E7D32" }}
                              >
                                ৳ {report?.totalIncomeAmount}
                              </Typography>
                            </Grid>
                            <Grid size={6} sx={{ textAlign: "right" }}>
                              <Typography
                                variant="medium"
                                color="text.light"
                                sx={{ fontWeight: 400 }}
                              >
                                Total Outgoings (Expenses/Refunds)
                              </Typography>
                              <Typography
                                variant="base"
                                sx={{ fontWeight: 600, color: "#D32F2F" }}
                              >
                                ৳ {report?.totalOutgoingsAmount}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            alignItems="center"
                            rowSpacing={2}
                            justifyContent="space-between"
                            sx={{
                              background: "#fff",
                              p: 2,
                              borderRadius: "0 0 20px 20px",
                            }}
                          >
                            <Grid size="auto">See Details</Grid>
                            <Grid size="auto">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  d="M7.53329 12.8659C7.41107 12.7437 7.34707 12.5881 7.34129 12.3992C7.33596 12.2103 7.3944 12.0548 7.51663 11.9326L10.7833 8.66589H3.33329C3.1444 8.66589 2.98596 8.60189 2.85796 8.47389C2.7304 8.34633 2.66663 8.18811 2.66663 7.99922C2.66663 7.81033 2.7304 7.65189 2.85796 7.52389C2.98596 7.39633 3.1444 7.33255 3.33329 7.33255H10.7833L7.51663 4.06589C7.3944 3.94366 7.33596 3.78811 7.34129 3.59922C7.34707 3.41033 7.41107 3.25477 7.53329 3.13255C7.65551 3.01033 7.81107 2.94922 7.99996 2.94922C8.18885 2.94922 8.3444 3.01033 8.46663 3.13255L12.8666 7.53255C12.9333 7.58811 12.9806 7.65744 13.0086 7.74055C13.0362 7.82411 13.05 7.91033 13.05 7.99922C13.05 8.08811 13.0362 8.17144 13.0086 8.24922C12.9806 8.327 12.9333 8.39922 12.8666 8.46589L8.46663 12.8659C8.3444 12.9881 8.18885 13.0492 7.99996 13.0492C7.81107 13.0492 7.65551 12.9881 7.53329 12.8659Z"
                                  fill="#1D2433"
                                  fill-opacity="0.65"
                                />
                              </svg>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    );
                  })}
              </>
            ))}

          {!loading2 && message && (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", mt: 4, width: "100%" }}
            >
              {message}
            </Typography>
          )}

          {loading2 && (
            <>
              <Grid size={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    height={250}
                    sx={{ flex: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={250}
                    sx={{ flex: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={250}
                    sx={{ flex: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={250}
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Grid>
              <Grid size={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    height={250}
                    sx={{ flex: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={250}
                    sx={{ flex: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={250}
                    sx={{ flex: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={250}
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {repairListDialog && (
        <ReportDetails
          created_by={createdBy}
          isDialog={true}
          onClose={handleRepairListDialogClose}
        />
      )}
    </div>
  );
};

export default Reports;
