import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Typography } from "@mui/material";

export default function RepairHistory() {
  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableHead>
              <Typography variant="body1" sx={{ fontWeight: 600, p: 2 }}>
                Repair History
              </Typography>
            </TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Device</TableCell>
              <TableCell>Branch</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>04 Mar 2023</TableCell>
              <TableCell>iphone 7 Plus</TableCell>
              <TableCell>Jamuna Future Park</TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>04 Mar 2023</TableCell>
              <TableCell>iphone 7 Plus</TableCell>
              <TableCell>Jamuna Future Park</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
