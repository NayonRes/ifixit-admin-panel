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
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import { statusList } from "../../data";
const WarrantyDetails = ({ clearFilter }) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const { rid } = useParams();
  const { wid } = useParams();
  const navigate = useNavigate();
  const [repairCost, setRepairCost] = useState(0);
  const [spareParsCost, setSpareParsCost] = useState(0);

  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState("");
  const [warrantyDetails, setwarrantyDetails] = useState("");

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
  const getWarrantyData = async () => {
    setLoading(true);

    let url = `/api/v1/warranty/${encodeURIComponent(wid.trim())}`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data", allData?.data?.data);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setwarrantyDetails(allData?.data?.data);

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
    getWarrantyData();
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
              Warranty Details (Repair No: {details?.repair_id})
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
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ color: "#0F1624", fontWeight: 600, mb: 2 }}
            >
              Warranty Info
            </Typography>

            {/* <Box sx={{ display: "flex", gap: 2 }}>
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
            </Box> */}
          </Box>

          {!loading &&
            details?.warranties_data?.length > 0 &&
            details?.warranties_data?.map((item, i) => (
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
                          Warranty No
                        </TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Paid Amount
                        </TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Due Amount
                        </TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Discount Amount
                        </TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Total Service charge
                        </TableCell>

                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Note
                        </TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Status
                        </TableCell>

                        <TableCell
                          align="right"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        key={i}
                        // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell sx={{ minWidth: "130px" }}>
                          {item?.warranty_id}
                        </TableCell>

                        <TableCell>
                          {item?.payment_info?.length > 0
                            ? item?.payment_info.reduce(
                                (sum, item) => sum + item.amount,
                                0
                              )
                            : 0}
                        </TableCell>
                        <TableCell sx={{ color: "#D92D20" }}>
                          {item?.due_amount > -1 ? item?.due_amount : "-------"}
                        </TableCell>
                        <TableCell sx={{ color: "#D92D20" }}>
                          {item?.discount_amount > -1
                            ? item?.discount_amount
                            : "-------"}
                        </TableCell>
                        <TableCell>
                          {item?.service_charge > -1
                            ? item?.service_charge
                            : "-------"}
                        </TableCell>

                        <TableCell sx={{ minWidth: "150px" }}>
                          {item?.remarks ? item?.remarks : "---------"}
                        </TableCell>
                        <TableCell>
                          {item?.repair_status ? (
                            <Chip
                              label={item?.repair_status}
                              variant="outlined"
                              sx={{
                                border: "0px",
                                backgroundColor:
                                  statusList.find(
                                    (el) => el.name === item?.repair_status
                                  )?.color || "",
                              }}
                            />
                          ) : (
                            "----------"
                          )}
                        </TableCell>
                        {/* <TableCell align="center" style={{ minWidth: "130px" }}>
                        <Invoice data={row} />
                      </TableCell> */}

                        <TableCell align="right">
                          {/* &nbsp; &nbsp;
                          <WarrantyProductSKU
                            warrantyData={row}
                            reload={reload}
                            setReload={setReload}
                          />{" "} */}
                          &nbsp; &nbsp;
                          <Button
                            size="small"
                            variant="outlined"
                            color="info"
                            startIcon={<ListAltOutlinedIcon />}
                            component={Link}
                            // to={`/repair/details/${rid}`}
                            to={`/repair/${rid}/warranty/details/${item?._id}`}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
          {details?.warranties_data < 1 ? (
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
                          Transaction Source
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
                            <TableCell>{item?.transaction_name}</TableCell>

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
          {/* <Box sx={{ my: "16px" }}>
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
          </TableContainer> */}
        </Box>
      </div>
    </>
  );
};

export default WarrantyDetails;
