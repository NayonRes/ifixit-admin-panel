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

export default function RepairHistory({ contactData, serial }) {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [tableDataList, setTableDataList] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = useState("");

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
  const getData = async () => {
    setLoading(true);

    let url = `/api/v1/sale?customer_id=${contactData?._id}&limit=100&page=1`;
    // let url = `/api/v1/repair?serial=${serial}&limit=100&page=1`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data::::::", allData?.data?.data);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setTableDataList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading(false);
  };

  const getColor = (name) => {
    let co = statusList.filter((i) => i.name == name);
    console.log("co", co?.[0]?.color);
    return co?.[0]?.bg;
  };

  useEffect(() => {
    getData();
    console.log("contactData", contactData);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer component={Paper} sx={{ border: "1px solid #eee" }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableHead>
              <Typography variant="body1" sx={{ fontWeight: 600, p: 2 }}>
                History
              </Typography>
            </TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>Sale Id</TableCell>

              <TableCell>Branch</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              tableDataList.length > 0 &&
              tableDataList.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    {moment(item?.created_at).format("DD MMM YYYY")}
                  </TableCell>
                  <TableCell>{item?.sale_id}</TableCell>

                  <TableCell>
                    {item?.branch_data?.length > 0 &&
                      item?.branch_data[0]?.name}
                  </TableCell>
                </TableRow>
              ))}

            {!loading && tableDataList.length < 1 ? (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                  <strong> {message}</strong>
                </TableCell>
              </TableRow>
            ) : null}
            {loading && pageLoading()}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
