import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const Invoice = () => {
  const contentRef = useRef();
  // const handlePrint = useReactToPrint({ contentRef });
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    // documentTitle: "AwesomeFileName",
    // ignoreGlobalStyles: true,
    // pageStyle: ".head {background: red; }",
    // onAfterPrint: handleAfterPrint,
    // onBeforePrint: handleBeforePrint,
  });
  return (
    <Box sx={{ background: "#ddd", padding: "30px" }}>
      <Box
        sx={{ maxWidth: "900px", background: "#fff", margin: "auto" }}
        ref={contentRef}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#4DA1A9",
            color: "#fff",
            padding: "60px",
          }}
        >
          <Box>
            <img src="/logo.png" alt="" />
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, fontSize: "18px" }}
            >
              iFixit
            </Typography>
            <Typography variant="body1">Company Address</Typography>
            <Typography variant="body1">Company Contact Number</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "60px",
          }}
        >
          <Box>
            <Typography
              variant="body1"
              sx={{
                textTransform: "uppercase",
                fontSize: "18px",
              }}
            >
              Invoice to
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textTransform: "uppercase",
                padding: "15px 0",
                fontWeight: 600,
              }}
            >
              Mr. Jhone Doe
            </Typography>
            <Typography variant="body1">Customer Address</Typography>
            <Typography variant="body1">Customer Contact Number</Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="h4"
              sx={{
                textTransform: "uppercase",
                fontWeight: 600,
                color: "#4DA1A9",
              }}
            >
              Invoice
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textTransform: "uppercase",

                fontWeight: 600,
              }}
            >
              Invoice No. 2003
            </Typography>
            <Typography variant="body1">Date: 12-04-2025</Typography>
          </Box>
        </Box>
        <Box sx={{ padding: "0px 60px 60px 60px" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: "16px" }}>
                    Dessert (100g serving)
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, fontSize: "16px" }}
                  >
                    Calories
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, fontSize: "16px" }}
                  >
                    Fat&nbsp;(g)
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, fontSize: "16px" }}
                  >
                    Carbs&nbsp;(g)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell align="right">4000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box>
            <Box
              sx={{
                maxWidth: "70%",
                margin: "90px auto 30px",
                paddingTop: "10px",
                display: "flex",
                justifyContent: "space-between",
                borderTop: "3px solid #999",
              }}
            >
              <Typography variant="body1">Approved by</Typography>
              <Typography variant="body1">Date</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ background: "#4DA1A9", height: "12px" }}></Box>
      </Box>

      {/* <Box>
        <Button onClick={handlePrint} variant="outline">
          Print Invoice!
        </Button>
      </Box> */}
    </Box>
  );
};

export default Invoice;
