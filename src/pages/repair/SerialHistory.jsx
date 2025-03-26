import React, { useEffect, useState, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Skeleton, Typography } from "@mui/material";
import { getDataWithToken } from "../../services/GetDataService";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";
import { enqueueSnackbar } from "notistack";
import { statusList } from "../../data.js";
import { useParams } from "react-router-dom";

export default function SerialHistory({
  contactData,
  serial,
  serialLoading,
  setSerialLoading,
  serialHistoryList,
  setSerialHistoryList,
}) {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const { rid } = useParams();

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
  const pageLoading = () => {
    let content = [];
    let loadingNumber = 4;

    for (let i = 0; i < 10; i++) {
      content.push(
        <TableRow key={i}>
          {[...Array(loadingNumber).keys()].map((e, i) => (
            <TableCell key={i}>
              <Skeleton></Skeleton>
            </TableCell>
          ))}
        </TableRow>
      );
    }
    return content;
  };

  const getColor = (name) => {
    let co = statusList.filter((i) => i.name == name);
    console.log("co", co?.[0]?.color);
    return co?.[0]?.bg;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer component={Paper} sx={{ border: "1px solid #eee" }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableHead>
              <Typography variant="body1" sx={{ fontWeight: 600, p: 2 }}>
                Repair History
              </Typography>
            </TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Model</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>Repair Status</TableCell>
              <TableCell>Branch</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!serialLoading &&
              serialHistoryList.length > 0 &&
              serialHistoryList.map((item, index) => (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    {moment(item?.created_at).format("DD MMM YYYY")}
                  </TableCell>
                  <TableCell>
                    {item?.model_data?.map((item, index) => item?.name)}
                  </TableCell>
                  <TableCell sx={{ color: getColor(item?.repair_status) }}>
                    {item?.repair_status}
                  </TableCell>
                  <TableCell>
                    {item?.branch_data?.length > 0 &&
                      item?.branch_data[0]?.name}
                  </TableCell>
                </TableRow>
              ))}

            {!serialLoading && serialHistoryList.length < 1 ? (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                  <strong> No history found</strong>
                </TableCell>
              </TableRow>
            ) : null}
            {serialLoading && pageLoading()}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
