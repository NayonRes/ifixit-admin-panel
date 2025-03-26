import React, { useEffect, useState, useContext } from "react";
import Grid from "@mui/material/Grid2";

import { Box, Divider, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
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
        <Typography
          variant="h6"
          gutterBottom
          component="div"
          sx={{ color: "#0F1624", fontWeight: 600 }}
        >
          Repair Details
        </Typography>
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
                Device :{" "}
                <b>
                  {details?.product_details?.length > 0
                    ? details?.product_details[0]?.name
                    : "---------"}
                </b>
              </Typography>
            </Grid>
            
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default RepairDetails;
