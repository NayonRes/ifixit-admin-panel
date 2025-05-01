import React, { useEffect, useState, useContext } from "react";
import Grid from "@mui/material/Grid2";

import { Box, Button, Divider, TextField, Typography } from "@mui/material";
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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#F9FAFB",
  padding: "16px 12px",
  borderRadius: "8px !important",
  border: "1px solid #EAECF0",
  cursor: "pointer",
}));
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
              {details?.payment_info?.length > 0
                ? details?.payment_info?.map((item, index) => (
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
                : "---------"}
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
                  Total Paid Amount :{" "}
                  <b>{repairCost + spareParsCost - details?.discount_amount}</b>
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default RepairDetails;
