import React, { useEffect, useState, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Typography } from "@mui/material";
import { getDataWithToken } from "../../services/GetDataService";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";

export default function RepairHistory({ contactData }) {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [tableDataList, setTableDataList] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = useState("");

  const getData = async () => {
    setLoading(true);

    let url = `/api/v1/repair?customer_id=${contactData?._id}&limit=100&page=1`;
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
    }
    setLoading(false);
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
                Repair History
              </Typography>
            </TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Repair Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableDataList.length > 0 &&
              tableDataList.map((item, index) => (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    {moment(item?.created_at).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>
                    {item?.model_data?.map((item, index) => item?.name)}
                  </TableCell>
                  <TableCell>{item?.repair_status}</TableCell>
                </TableRow>
              ))}
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell colSpan={12} align="center">
                {message}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
