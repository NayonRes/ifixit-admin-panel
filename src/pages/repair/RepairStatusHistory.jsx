import React, { useEffect, useState, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import moment from "moment";
import { statusColor } from "../../data";
import EditIcon from "@mui/icons-material/Edit";

import { getDataWithToken } from "../../services/GetDataService";
import { AuthContext } from "../../context/AuthContext";

export default function RepairStatusHistory({ contactData }) {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [tableDataList, setTableDataList] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = useState("");

  const getData = async () => {
    setLoading(true);

    let url = `/api/v1/repair?customer_id=${contactData?._id}&limit=100&page=1`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data:", allData?.data?.data);

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
                History (2)
              </Typography>
            </TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell sx={{ color: "#F6AC3C" }}>Rework </TableCell>
              <TableCell>
                14 Apr 2024{" "}
                <span style={{ display: "block", color: "#666" }}>
                  5:25:35 PM
                </span>{" "}
              </TableCell>
              <TableCell>Wade Warren</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  id="outlined-multiline-flexible"
                  multiline
                  maxRows={4}
                  placeholder="Add Note"
                />
              </TableCell>
              <TableCell>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell sx={{ color: "#F6AC3C" }}>Hold </TableCell>
              <TableCell>
                14 Apr 2024{" "}
                <span style={{ display: "block", color: "#666" }}>
                  5:25:35 PM
                </span>{" "}
              </TableCell>
              <TableCell>Wade Warren</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  id="outlined-multiline-flexible"
                  multiline
                  maxRows={4}
                  placeholder="Add Note"
                />
              </TableCell>
              <TableCell>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>

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
