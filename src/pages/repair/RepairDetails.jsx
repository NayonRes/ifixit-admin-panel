import React, { useEffect, useState, useContext } from "react";
import Grid from "@mui/material/Grid2";

import {
  Box,
  Button,
  Chip,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDataWithToken } from "../../services/GetDataService";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TableContainer } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import { AuthContext } from "../../context/AuthContext";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import moment from "moment";

const RepairDetails = ({ clearFilter }) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const { rid } = useParams();
  const navigate = useNavigate();
  const [repairCost, setRepairCost] = useState(0);
  const [spareParsCost, setSpareParsCost] = useState(0);

  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState("");

  const { enqueueSnackbar } = useSnackbar();

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

  function calculateTransactionTotals(transactions = []) {
    if (!transactions || transactions.length === 0) {
      return { credit: 0, debit: 0, netBalance: 0 };
    }

    const totals = transactions.reduce(
      (acc, transaction) => {
        const sum = (transaction.transaction_info || []).reduce(
          (s, t) => s + (t.amount || 0),
          0
        );

        if (transaction.transaction_type === "credit") {
          acc.credit += sum;
        } else if (transaction.transaction_type === "debit") {
          acc.debit += sum;
        }

        return acc;
      },
      { credit: 0, debit: 0 }
    );

    return {
      credit: totals.credit,
      debit: totals.debit,
      netBalance: totals.credit - totals.debit,
    };
  }
  const calculateTotalRepairCost = (services) => {
    return services.reduce((total, service) => {
      return total + service.repair_cost;
    }, 0);
  };
  const calculateTotalSparePartsCost = (services) => {
    return services.reduce((total, service) => {
      return total + service.price;
    }, 0);
  };
  const getData = async () => {
    setLoading(true);

    let url = `/api/v1/repair/${encodeURIComponent(rid.trim())}`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data", allData?.data?.data);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setDetails(allData?.data?.data);
      let totalRepairCost = calculateTotalRepairCost(
        allData?.data?.data?.issues
      );
      let totalSpareCost = calculateTotalSparePartsCost(
        allData?.data?.data?.product_details
      );
      // console.log('allData?.data?.data?.product_details',totalSpareCost)
      setRepairCost(totalRepairCost);
      setSpareParsCost(totalSpareCost);

      if (allData.data.data.length < 1) {
        // setMessage("No data found");
      }
    } else {
      setLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading(false);
  };

  const totals = calculateTransactionTotals(
    details?.transaction_histories_data
  );
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <Box container sx={{ padding: "24px 0" }}>
        <Grid container alignItems="center">
          <Grid size={6}>
            {" "}
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ color: "#0F1624", fontWeight: 600 }}
            >
              Repair Details
            </Typography>
          </Grid>
          <Grid size={6} sx={{ textAlign: "right" }}>
            {" "}
            <Button
              component={Link}
              to={`/repair/invoice/${rid}`}
              variant="outlined"
              color="info"
              startIcon={<LocalPrintshopOutlinedIcon />}
            >
              Repair Invoice
            </Button>
          </Grid>
        </Grid>
      </Box>

      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          // backgroundColor: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
        }}
      >
        <Box sx={{ padding: "12px", margin: "16px" }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
              >
                Customer Info
              </Typography>
            </Grid>

            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Name :{" "}
                <b>
                  {details?.customer_data?.length > 0
                    ? details?.customer_data[0]?.name
                    : "---------"}
                </b>
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Mobile :{" "}
                <b>
                  {details?.customer_data?.length > 0
                    ? details?.customer_data[0]?.mobile
                    : "---------"}
                </b>
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Email :{" "}
                <b>
                  {details?.customer_data?.length > 0
                    ? details?.customer_data[0]?.email
                    : "---------"}
                </b>
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Customer Type :{" "}
                <b>
                  {details?.customer_data?.length > 0
                    ? details?.customer_data[0]?.customer_type
                    : "---------"}
                </b>
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Rating :{" "}
                <b>
                  {details?.customer_data?.length > 0
                    ? details?.customer_data[0]?.rating
                    : "---------"}
                </b>
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Membership Id :{" "}
                <b>
                  {details?.customer_data?.length > 0
                    ? details?.customer_data[0]?.membership_id
                    : "---------"}
                </b>
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Remarks :{" "}
                <b>
                  {details?.customer_data?.length > 0
                    ? details?.customer_data[0]?.remarks
                    : "---------"}
                </b>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          // backgroundColor: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          marginTop: 20,
        }}
      >
        <Box sx={{ padding: "12px", margin: "16px" }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
              >
                Device Info
              </Typography>
            </Grid>

            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Brand :{" "}
                <b>
                  {details?.brand_data?.length > 0
                    ? details?.brand_data[0]?.name
                    : "---------"}
                </b>
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Model :{" "}
                <b>
                  {details?.model_data?.length > 0
                    ? details?.model_data[0]?.name
                    : "---------"}
                </b>
              </Typography>
            </Grid>

            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Spareparts:{" "}
                {details?.product_details?.length > 0
                  ? details?.product_details?.map((item, index) => (
                      <b
                        key={index}
                        style={{
                          background: "#eee",
                          marginRight: "10px",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          marginBottom: "3px",
                          display: "inline-block",
                        }}
                      >
                        {item?.name} - ({item?.price} TK)
                      </b>
                    ))
                  : "---------"}
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Serial :{" "}
                <b>
                  {details?.serial?.length > 0 ? details?.serial : "---------"}
                </b>
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Pass code :{" "}
                <b>
                  {details?.pass_code?.length > 0
                    ? details?.pass_code
                    : "---------"}
                </b>
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Issue:{" "}
                {details?.issues?.length > 0
                  ? details?.issues?.map((item, index) => (
                      <b
                        key={index}
                        style={{
                          background: "#eee",
                          marginRight: "10px",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          marginBottom: "3px",
                          display: "inline-block",
                        }}
                      >
                        {item?.name} - ({item?.repair_cost} TK)
                      </b>
                    ))
                  : "---------"}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          // backgroundColor: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          marginTop: 20,
        }}
      >
        <Box sx={{ padding: "12px", margin: "16px" }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
              >
                Repair Checklist
              </Typography>
            </Grid>

            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Power :{" "}
                <b>
                  {details?.repair_checklist?.has_power
                    ? "Has power"
                    : "No power"}
                </b>
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Battery health :{" "}
                <b>
                  {details?.repair_checklist?.battery_health
                    ? details?.repair_checklist?.battery_health + "%"
                    : "-------"}
                </b>
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Note :{" "}
                <b>
                  {details?.repair_checklist?.note?.length > 0
                    ? details?.repair_checklist?.note
                    : "-------"}
                </b>
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500, fontSize: "18px", mb: 2 }}
              >
                Check list :{" "}
              </Typography>

              {details?.repair_checklist?.checklist?.length > 0
                ? details?.repair_checklist?.checklist?.map((item, index) => (
                    <Typography
                      key={index}
                      variant="medium"
                      color="text.main"
                      gutterBottom
                      sx={{ fontWeight: 500 }}
                      style={{
                        background: "#eee",
                        marginRight: "10px",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        marginBottom: "5px",
                        display: "inline-block",
                      }}
                    >
                      {item?.name} : <b>{item?.status}</b>
                      {item?.status === "Functional" ? (
                        <>
                          {" "}
                          &nbsp;
                          <CheckCircleOutlinedIcon
                            color="success"
                            sx={{
                              fontSize: "22px",
                              position: "relative",
                              top: 5,
                            }}
                          />
                        </>
                      ) : (
                        <>
                          {" "}
                          &nbsp;
                          <img
                            src="/cross.png"
                            alt=""
                            style={{
                              width: "20px",
                              position: "relative",
                              top: 5,
                            }}
                            // onClick={() => handleCheckboxChange(index, false)}
                          />
                        </>
                      )}
                    </Typography>
                  ))
                : "---------"}
            </Grid>
          </Grid>
        </Box>
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          // backgroundColor: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          marginTop: 20,
        }}
      >
        <Box sx={{ padding: "12px", margin: "16px" }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
              >
                Repair & Delivery Info
              </Typography>
            </Grid>

            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Repair By :{" "}
                <b>
                  {details?.repair_by_data?.length > 0
                    ? details?.repair_by_data[0]?.name
                    : "---------"}
                </b>
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Repair Status :{" "}
                <b>
                  {details?.repair_status?.length > 0
                    ? details?.repair_status
                    : "---------"}
                </b>
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Delivery Status :{" "}
                <b>
                  {details?.delivery_status?.length > 0
                    ? details?.delivery_status
                    : "---------"}
                </b>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          // backgroundColor: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          marginTop: 20,
          marginBottom: 16,
        }}
      >
        <Box sx={{ padding: "12px", margin: "16px" }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
              >
                Payment Info
              </Typography>
            </Grid>

            <Grid size={12}>
              {details?.payment_info?.length > 0 ? (
                details?.payment_info?.map((item, index) => (
                  <Typography
                    variant="medium"
                    color="text.main"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                    key={index}
                    style={{
                      background: "#eee",
                      marginRight: "10px",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      marginBottom: "5px",
                      display: "inline-block",
                    }}
                  >
                    {item?.name} : <b>{item?.amount}</b>
                  </Typography>
                ))
              ) : (
                <Box sx={{ textAlign: "center", fontWeight: 600 }}>
                  No Payment Available
                </Box>
              )}

              {details?.payment_info?.length > 0 && (
                <>
                  {details?.due_amount && (
                    <Typography
                      variant="medium"
                      color="text.main"
                      gutterBottom
                      sx={{ fontWeight: 500 }}
                      style={{
                        background: "#eee",
                        marginRight: "10px",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        marginBottom: "5px",
                        display: "inline-block",
                      }}
                    >
                      Due Amount : <b>{details?.due_amount}</b>
                    </Typography>
                  )}

                  {details?.discount_amount && (
                    <Typography
                      variant="medium"
                      color="text.main"
                      gutterBottom
                      sx={{ fontWeight: 500 }}
                      style={{
                        background: "#eee",
                        marginRight: "10px",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        marginBottom: "5px",
                        display: "inline-block",
                      }}
                    >
                      Discount Amount : <b>{details?.discount_amount}</b>
                    </Typography>
                  )}

                  <Typography
                    variant="medium"
                    color="text.main"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                    style={{
                      background: "#eee",
                      marginRight: "10px",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      marginBottom: "5px",
                      display: "inline-block",
                    }}
                  >
                    Total Paid Amount :{" "}
                    <b>
                      {repairCost +
                        spareParsCost -
                        (Number(details?.discount_amount) || 0)}
                    </b>
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          // backgroundColor: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          marginTop: 20,
        }}
      >
        <Box sx={{ padding: "12px", margin: "16px" }}>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
          >
            Attached Items
          </Typography>

          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Product Name
                  </TableCell>
                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                Purchase date
                </TableCell> */}

                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    SKU Number
                  </TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Created Info
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Updated Info
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  details?.repair_attached_spareparts_data?.length > 0 &&
                  details?.repair_attached_spareparts_data
                    ?.filter((item) => item?.is_warranty_claimed_sku === false)
                    ?.map((row, i) => (
                      <TableRow
                        key={i}
                        // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        {/* <TableCell sx={{ width: 50 }}>
                                      <img
                                        src={
                                          row?.images?.length > 0
                                            ? row?.images[0]?.url
                                            : "/noImage.jpg"
                                        }
                                        alt=""
                                        width={40}
                                      />
                                    </TableCell> */}
                        <TableCell sx={{ minWidth: "130px" }}>
                          {row?.stocks_data?.product_data
                            ? row?.stocks_data?.product_data?.name
                            : "---------"}{" "}
                          &nbsp;{" "}
                          {row?.stocks_data?.product_variation_data
                            ? row?.stocks_data?.product_variation_data?.name
                            : "---------"}
                        </TableCell>

                        <TableCell>{row?.sku_number}</TableCell>
                        <TableCell>
                          {row?.created_user?.name} <br />
                          {moment(row?.created_at).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell>
                          {row?.updated_user?.name
                            ? row?.updated_user?.name
                            : "N/A"}{" "}
                          <br />
                          {row?.updated_user?.name &&
                            moment(row?.updated_at).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell>
                          {row?.status ? (
                            <>
                              <TaskAltOutlinedIcon
                                style={{
                                  color: "#10ac84",
                                  height: "16px",
                                  position: "relative",
                                  top: "4px",
                                }}
                              />{" "}
                              <span
                                style={{
                                  color: "#10ac84",
                                }}
                              >
                                Attached &nbsp;
                              </span>
                            </>
                          ) : (
                            <>
                              <HighlightOffOutlinedIcon
                                style={{
                                  color: "#ee5253",
                                  height: "16px",
                                  position: "relative",
                                  top: "4px",
                                }}
                              />
                              <span
                                style={{
                                  color: "#ee5253",
                                }}
                              >
                                Removed
                              </span>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}

                {details?.length < 1 ? (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell colSpan={6} style={{ textAlign: "center" }}>
                      <strong> No data found</strong>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          // backgroundColor: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          marginTop: 20,
        }}
      >
        <Box sx={{ padding: "12px", margin: "16px" }}>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ color: "#0F1624", fontWeight: 600, margin: 0, mb: 3 }}
          >
            Service History
          </Typography>
          {!loading &&
            details?.repair_service_history_data?.length > 0 &&
            details?.repair_service_history_data
              ?.slice()
              ?.reverse()
              ?.map((item, i) => (
                <Box
                  sx={{
                    mb: 2,
                    background: "#f9f9f9",
                    p: 1,
                    borderRadius: "8px",
                  }}
                >
                  <Typography
                    variant=""
                    gutterBottom
                    component="div"
                    sx={{ color: "#0F1624", margin: 0 }}
                  >
                    <b>Date :</b>{" "}
                    {moment(item?.created_at).format("DD MMM YYYY")} |{" "}
                    <b>User Name:</b> {item?.created_user?.name} |{" "}
                    <b>User Email:</b> {item?.created_user?.email}
                  </Typography>
                  <TableContainer sx={{ background: "#fff" }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ whiteSpace: "nowrap" }}>
                            Name
                          </TableCell>
                          {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                Purchase date
                </TableCell> */}

                          <TableCell
                            align="right"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Cost
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {!loading &&
                          item?.service_info?.length > 0 &&
                          item?.service_info?.map((row, i) => (
                            <TableRow
                              key={i}
                              // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                              {/* <TableCell sx={{ width: 50 }}>
                                      <img
                                        src={
                                          row?.images?.length > 0
                                            ? row?.images[0]?.url
                                            : "/noImage.jpg"
                                        }
                                        alt=""
                                        width={40}
                                      />
                                    </TableCell> */}

                              <TableCell>{row?.name}</TableCell>
                              <TableCell align="right">
                                {row?.repair_cost}
                              </TableCell>
                            </TableRow>
                          ))}
                        {!loading && item?.service_info?.length > 0 && (
                          <TableRow>
                            <TableCell>
                              <strong>Total</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>
                                {item?.service_info?.reduce(
                                  (acc, cur) =>
                                    acc + (Number(cur?.repair_cost) || 0),
                                  0
                                )}
                              </strong>
                            </TableCell>
                          </TableRow>
                        )}
                        {item?.service_info?.length < 1 ? (
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell
                              colSpan={2}
                              style={{ textAlign: "center" }}
                            >
                              <strong> No data found</strong>
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))}
          {details?.repair_service_history_data < 1 ? (
            <Box sx={{ textAlign: "center" }}>
              <strong> No data found</strong>
            </Box>
          ) : null}
        </Box>
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          // backgroundColor: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          marginTop: 20,
        }}
      >
        <Box sx={{ padding: "12px", margin: "16px" }}>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ color: "#0F1624", fontWeight: 600, margin: 0, mb: 3 }}
          >
            Spare Parts History
          </Typography>
          {!loading &&
            details?.repair_product_history_data?.length > 0 &&
            details?.repair_product_history_data
              ?.slice()
              ?.reverse()
              ?.map((item, i) => (
                <Box
                  sx={{
                    mb: 2,
                    background: "#f9f9f9",
                    p: 1,
                    borderRadius: "8px",
                  }}
                >
                  <Typography
                    variant=""
                    gutterBottom
                    component="div"
                    sx={{ color: "#0F1624", margin: 0 }}
                  >
                    <b>Date :</b>{" "}
                    {moment(item?.created_at).format("DD MMM YYYY")} |{" "}
                    <b>User Name:</b> {item?.created_user?.name} |{" "}
                    <b>User Email:</b> {item?.created_user?.email}
                  </Typography>
                  <TableContainer sx={{ background: "#fff" }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ whiteSpace: "nowrap" }}>
                            Name
                          </TableCell>
                          {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                Purchase date
                </TableCell> */}

                          <TableCell
                            align="right"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Price
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {!loading &&
                          item?.product_details?.length > 0 &&
                          item?.product_details?.map((row, i) => (
                            <TableRow
                              key={i}
                              // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                              {/* <TableCell sx={{ width: 50 }}>
                                      <img
                                        src={
                                          row?.images?.length > 0
                                            ? row?.images[0]?.url
                                            : "/noImage.jpg"
                                        }
                                        alt=""
                                        width={40}
                                      />
                                    </TableCell> */}

                              <TableCell>{row?.name}</TableCell>
                              <TableCell align="right">{row?.price}</TableCell>
                            </TableRow>
                          ))}
                        {!loading && item?.product_details?.length > 0 && (
                          <TableRow>
                            <TableCell>
                              <strong>Total</strong>
                            </TableCell>
                            <TableCell align="right">
                              <strong>
                                {item?.product_details?.reduce(
                                  (acc, cur) => acc + (Number(cur?.price) || 0),
                                  0
                                )}
                              </strong>
                            </TableCell>
                          </TableRow>
                        )}
                        {item?.product_details?.length < 1 ? (
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell
                              colSpan={2}
                              style={{ textAlign: "center" }}
                            >
                              <strong> No data found</strong>
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))}
          {details?.repair_service_history_data < 1 ? (
            <Box sx={{ textAlign: "center" }}>
              <strong> No data found</strong>
            </Box>
          ) : null}
        </Box>
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          // backgroundColor: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          marginTop: 20,
        }}
      >
        <Box sx={{ padding: "12px", margin: "16px" }}>
          {/* <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ color: "#0F1624", fontWeight: 600, margin: 0, mb: 3 }}
          >
            Transactions History{" "}
            {
              calculateTransactionTotals(details?.transaction_histories_data)
                ?.credit
            }{" "}
            {
              calculateTransactionTotals(details?.transaction_histories_data)
                ?.debit
            }
            {
              calculateTransactionTotals(details?.transaction_histories_data)
                ?.netBalance
            }
          </Typography> */}

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ color: "#0F1624", fontWeight: 600, mb: 2 }}
            >
              Transactions History
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Chip
                label={`Total Collection: ${totals.credit}`}
                color="success"
                variant="outlined"
                sx={{ fontWeight: "bold", fontSize: "14px" }}
              />
              <Chip
                label={`Total Refund: ${totals.debit}`}
                color="error"
                variant="outlined"
                sx={{ fontWeight: "bold", fontSize: "14px" }}
              />
              <Chip
                label={`Net Balance: ${totals.netBalance}`}
                color={totals.netBalance >= 0 ? "primary" : "warning"}
                variant="filled"
                sx={{ fontWeight: "bold", fontSize: "14px" }}
              />
            </Box>
          </Box>

          {!loading &&
            details?.transaction_histories_data?.length > 0 &&
            details?.transaction_histories_data?.map((item, i) => (
              <Box
                sx={{
                  mb: 2,
                  background: "#f9f9f9",
                  p: 1,
                  borderRadius: "8px",
                }}
              >
                <Typography
                  variant=""
                  gutterBottom
                  component="div"
                  sx={{ color: "#0F1624", margin: 0 }}
                >
                  <b>Date :</b> {moment(item?.created_at).format("DD MMM YYYY")}{" "}
                  | <b>User Name:</b> {item?.created_user?.name} |{" "}
                  <b>User Email:</b> {item?.created_user?.email}
                </Typography>
                <TableContainer sx={{ background: "#fff" }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Account Name
                        </TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Transaction Type
                        </TableCell>

                        <TableCell
                          align="right"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!loading &&
                        item?.transaction_info?.length > 0 &&
                        item?.transaction_info?.map((row, i) => (
                          <TableRow
                            key={i}
                            // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                          >
                            {/* <TableCell sx={{ width: 50 }}>
                                      <img
                                        src={
                                          row?.images?.length > 0
                                            ? row?.images[0]?.url
                                            : "/noImage.jpg"
                                        }
                                        alt=""
                                        width={40}
                                      />
                                    </TableCell> */}

                            <TableCell>{row?.name}</TableCell>

                            <TableCell>
                              {item?.transaction_type === "credit" ? (
                                <>
                                  <TaskAltOutlinedIcon
                                    style={{
                                      color: "#10ac84",
                                      height: "16px",
                                      position: "relative",
                                      top: "4px",
                                    }}
                                  />{" "}
                                  <span
                                    style={{
                                      color: "#10ac84",
                                    }}
                                  >
                                    Received &nbsp;
                                  </span>
                                </>
                              ) : (
                                <>
                                  <HighlightOffOutlinedIcon
                                    style={{
                                      color: "#ee5253",
                                      height: "16px",
                                      position: "relative",
                                      top: "4px",
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: "#ee5253",
                                    }}
                                  >
                                    Refund
                                  </span>
                                </>
                              )}
                            </TableCell>
                            <TableCell align="right">{row?.amount}</TableCell>
                          </TableRow>
                        ))}
                      {!loading && item?.transaction_info?.length > 0 && (
                        <TableRow>
                          <TableCell>
                            <strong>Total</strong>
                          </TableCell>
                          <TableCell align="right" colSpan={2}>
                            <strong>
                              {item?.transaction_info?.reduce(
                                (acc, cur) => acc + (Number(cur?.amount) || 0),
                                0
                              )}
                            </strong>
                          </TableCell>
                        </TableRow>
                      )}
                      {item?.transaction_info?.length < 1 ? (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            colSpan={2}
                            style={{ textAlign: "center" }}
                          >
                            <strong> No data found</strong>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
          {details?.transaction_histories_data < 1 ? (
            <Box sx={{ textAlign: "center" }}>
              <strong> No data found</strong>
            </Box>
          ) : null}
        </Box>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          // backgroundColor: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          marginTop: 20,
        }}
      >
        <Box sx={{ padding: "12px", margin: "16px" }}>
          {/* <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
          >
            Warranty Items
          </Typography> */}
          <Box sx={{ my: "16px" }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
                >
                  Warranty Info
                </Typography>
              </Grid>

              <Grid size={3}>
                <Typography
                  variant="medium"
                  color="text.main"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  Service Charge :{" "}
                  <b>
                    {details?.warranties_data?.[0]?.service_charge > 0
                      ? `TK. ${details.warranties_data[0].service_charge}`
                      : "---------"}
                  </b>
                </Typography>
              </Grid>
              <Grid size={3}>
                <Typography
                  variant="medium"
                  color="text.main"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  Discount :{" "}
                  <b>
                    {details?.warranties_data?.[0]?.discount > 0
                      ? `TK. ${details.warranties_data[0].discount}`
                      : "TK. 0"}
                  </b>
                </Typography>
              </Grid>
              <Grid size={3}>
                <Typography
                  variant="medium"
                  color="text.main"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  Status :{" "}
                  <b>
                    {details?.warranties_data?.[0]?.warranty_service_status
                      ? `${details.warranties_data[0].warranty_service_status}`
                      : "---------"}
                  </b>
                </Typography>
              </Grid>
              <Grid size={3}>
                <Typography
                  variant="medium"
                  color="text.main"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  Date :{" "}
                  <b>
                    {details?.warranties_data?.[0]?.created_at
                      ? moment(details.warranties_data[0].created_at).format(
                          "DD/MM/YYYY"
                        )
                      : "---------"}
                  </b>
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Product Name
                  </TableCell>
                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                Purchase date
                </TableCell> */}

                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    SKU Number
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Claimed on SKU Number
                  </TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Created Info
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Updated Info
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  details?.repair_attached_spareparts_data?.length > 0 &&
                  details?.repair_attached_spareparts_data
                    ?.filter((item) => item?.is_warranty_claimed_sku === true)
                    ?.map((row, i) => (
                      <TableRow
                        key={i}
                        // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        {/* <TableCell sx={{ width: 50 }}>
                                      <img
                                        src={
                                          row?.images?.length > 0
                                            ? row?.images[0]?.url
                                            : "/noImage.jpg"
                                        }
                                        alt=""
                                        width={40}
                                      />
                                    </TableCell> */}
                        <TableCell sx={{ minWidth: "130px" }}>
                          {row?.stocks_data?.product_data
                            ? row?.stocks_data?.product_data?.name
                            : "---------"}{" "}
                          &nbsp;{" "}
                          {row?.stocks_data?.product_variation_data
                            ? row?.stocks_data?.product_variation_data?.name
                            : "---------"}
                        </TableCell>

                        <TableCell>{row?.sku_number}</TableCell>
                        <TableCell>{row?.claimed_on_sku_number}</TableCell>

                        <TableCell>
                          {row?.created_user?.name} <br />
                          {moment(row?.created_at).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell>
                          {row?.updated_user?.name
                            ? row?.updated_user?.name
                            : "N/A"}{" "}
                          <br />
                          {row?.updated_user?.name &&
                            moment(row?.updated_at).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell>
                          {row?.status ? (
                            <>
                              <TaskAltOutlinedIcon
                                style={{
                                  color: "#10ac84",
                                  height: "16px",
                                  position: "relative",
                                  top: "4px",
                                }}
                              />{" "}
                              <span
                                style={{
                                  color: "#10ac84",
                                }}
                              >
                                Attached &nbsp;
                              </span>
                            </>
                          ) : (
                            <>
                              <HighlightOffOutlinedIcon
                                style={{
                                  color: "#ee5253",
                                  height: "16px",
                                  position: "relative",
                                  top: "4px",
                                }}
                              />
                              <span
                                style={{
                                  color: "#ee5253",
                                }}
                              >
                                Removed
                              </span>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}

                {details?.length < 1 ? (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell colSpan={6} style={{ textAlign: "center" }}>
                      <strong> No data found</strong>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
    </>
  );
};

export default RepairDetails;
