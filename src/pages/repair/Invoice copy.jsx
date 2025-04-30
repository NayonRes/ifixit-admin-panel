import React, { useContext, useEffect, useRef, useState } from "react";
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
import { useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { getDataWithToken } from "../../services/GetDataService";
import { AuthContext } from "../../context/AuthContext";
import dayjs from "dayjs";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";

const Invoice = () => {
  const { rid } = useParams();
  const contentRef = useRef();
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [details, setDetails] = useState("");
  const [repairCost, setRepairCost] = useState(0);
  const [spareParsCost, setSpareParsCost] = useState(0);
  const [loading, setLoading] = useState(false);

  // const handlePrint = useReactToPrint({ contentRef });
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    // documentTitle: "AwesomeFileName",
    // ignoreGlobalStyles: true,
    // pageStyle: ".head {background: red; }",
    // onAfterPrint: handleAfterPrint,
    // onBeforePrint: handleBeforePrint,
  });

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

    let totalRepairCost = calculateTotalRepairCost(allData?.data?.data?.issues);
    let totalSpareCost = calculateTotalSparePartsCost(
      allData?.data?.data?.product_details
    );
    // console.log('allData?.data?.data?.product_details',totalSpareCost)
    setRepairCost(totalRepairCost);
    setSpareParsCost(totalSpareCost);
    setDetails(allData?.data?.data);

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
    <Box sx={{ padding: "30px" }}>
      <Box sx={{ textAlign: "right", maxWidth: "900px", margin: "auto",mb:1 }}>
        <Button
          onClick={handlePrint}
          variant="contained"
          color="info"
          size="large"
          startIcon={<LocalPrintshopOutlinedIcon />}
        >
          Print Invoice
        </Button>
      </Box>
      <Box
        sx={{
          maxWidth: "900px",
          background: "#fff",
          margin: "auto",
          border: "1px solid #eee",
        }}
        ref={contentRef}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#4DA1A9",
            color: "#fff",
            padding: "30px 30px",
          }}
        >
          <Box>
            <img src="/logo.png" alt="" width={120} />
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="small"
              sx={{ fontWeight: 600, fontSize: "18px", mb: 1 }}
            >
              {ifixit_admin_panel?.user?.branchInfo?.name}
            </Typography>
            <Typography variant="small">
              {" "}
              {ifixit_admin_panel?.user?.branchInfo?.address}
            </Typography>
            <Typography variant="small">
              {ifixit_admin_panel?.user?.branchInfo?.phone_no_1}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 30px 20px",
          }}
        >
          <Box>
            <Typography
              variant="medium"
              sx={{
                textTransform: "uppercase",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Invoice to
            </Typography>
            <Typography
              variant="small"
              sx={{
                textTransform: "uppercase",

                fontWeight: 600,
                mb: 1,
              }}
            >
              {details?.customer_data?.[0]?.name}
            </Typography>
            <Typography variant="small">
              {details?.customer_data?.[0]?.mobile}
            </Typography>
            <Typography variant="small">
              {details?.customer_data?.[0]?.email}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="h4"
              sx={{
                textTransform: "uppercase",
                fontWeight: 600,
                color: "#4DA1A9",
                mb: 1,
              }}
            >
              Invoice
            </Typography>
            <Typography
              variant="small"
              sx={{
                textTransform: "uppercase",

                fontWeight: 600,
              }}
            >
              Invoice No. {details?.repair_id}
            </Typography>
            <Typography variant="small">
              Date: {dayjs(details?.created_at).format("YYYY-MM-DD")}{" "}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ padding: "0px 30px 30px 30px" }}>
          <Box sx={{ minHeight: "735px" }}>
            {details?.issues?.length > 0 && (
              <Box>
                <Typography variant="small" sx={{ fontWeight: 600, mb: 1 }}>
                  Service Info
                </Typography>
                <TableContainer>
                  <Table
                    aria-label="simple table"
                    sx={{ "& td, & th": { fontSize: "10px", py: 1 } }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, fontSize: "10px" }}>
                          Service Name
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{ fontWeight: 600, fontSize: "10px" }}
                        >
                          Cost
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {details?.issues?.length > 0 &&
                        details?.issues?.map((item) => (
                          <TableRow
                            key={item.name}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {item.name}
                            </TableCell>

                            <TableCell align="right">
                              {item.repair_cost}
                            </TableCell>
                          </TableRow>
                        ))}

                      <TableRow
                        sx={{
                          background: "#eee",
                          "& td, & th": { fontSize: "10px" },
                        }}
                      >
                        <TableCell>Total</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {repairCost}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {details?.product_details?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="small" sx={{ fontWeight: 600, mb: 1 }}>
                  Spare Parts Info
                </Typography>
                <TableContainer>
                  <Table
                    aria-label="simple table"
                    sx={{ "& td, & th": { fontSize: "10px", py: 1 } }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, fontSize: "10px" }}>
                          Spare Parts Name
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{ fontWeight: 600, fontSize: "10px" }}
                        >
                          Cost
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {details?.product_details?.length > 0 &&
                        details?.product_details?.map((item) => (
                          <TableRow
                            key={item.name}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {item.name}
                            </TableCell>

                            <TableCell align="right">{item.price}</TableCell>
                          </TableRow>
                        ))}

                      <TableRow
                        sx={{
                          background: "#eee",
                          "& td, & th": { fontSize: "10px" },
                        }}
                      >
                        <TableCell>Total</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {spareParsCost}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="small" sx={{ mt: 6 }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Sapiente veritatis enim explicabo tempora suscipit, magni
                  obcaecati commodi cum libero laudantium recusandae officiis
                  labore optio. Necessitatibus officia omnis quas totam earum!
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right", flex: 1 }}>
                <Typography variant="medium" sx={{ fontWeight: 600, mb: 2 }}>
                  Payment Info
                </Typography>
                <TableContainer
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Table
                    sx={{
                      "& td, & th": { fontSize: "10px", py: 1 },
                      border: "1px solid #ddd",
                    }}
                    aria-label="simple table"
                  >
                    <TableBody sx={{ "& td, & th": { fontSize: "10px" } }}>
                      <TableRow>
                        <TableCell sx={{}}>Total Amount</TableCell>

                        <TableCell align="right" sx={{}}>
                          {repairCost + spareParsCost}
                        </TableCell>
                      </TableRow>
                      {/* <TableRow>
                        <TableCell sx={{}}>Repair Subtotal</TableCell>

                        <TableCell align="right" sx={{}}>
                          {repairCost}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{}}>Spare Parts Subtotal</TableCell>

                        <TableCell align="right" sx={{}}>
                          {spareParsCost}
                        </TableCell>
                      </TableRow> */}
                      <TableRow>
                        <TableCell sx={{}}>Due Amount</TableCell>

                        <TableCell align="right" sx={{}}>
                          - {details?.due_amount}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{}}>Discount Amount</TableCell>

                        <TableCell align="right" sx={{}}>
                          - {details?.discount_amount}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ background: "#eee" }}>
                        <TableCell sx={{}}>Total Paid Amount</TableCell>

                        <TableCell align="right">
                          {repairCost +
                            spareParsCost -
                            details?.discount_amount}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>
          <Box>
            <Box
              sx={{
                maxWidth: "70%",
                margin: "auto",
                paddingTop: "10px",
                display: "flex",
                justifyContent: "space-between",
                borderTop: "3px solid #999",
              }}
            >
              <Typography variant="small">Authorized Sign</Typography>
              <Typography variant="small">Date</Typography>
            </Box>
          </Box>
        </Box>
        {/* <Box sx={{ background: "#4DA1A9", height: "10px" }}></Box> */}
      </Box>
    </Box>
  );
};

export default Invoice;
