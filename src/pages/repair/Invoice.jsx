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
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { allIssueCheckList } from "../../data";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

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
      <Box
        sx={{ textAlign: "right", maxWidth: "900px", margin: "auto", mb: 1 }}
      >
        <Button
          onClick={handlePrint}
          variant="contained"
          color="info"
          size="large"
          startIcon={<LocalPrintshopOutlinedIcon />}
        >
          Print{" "}
          {details?.delivery_status === "Not Delivered"
            ? "Job Card"
            : "Invoice"}
        </Button>
      </Box>
      <Box
        sx={{
          maxWidth: "900px",
          background: "#fff",
          margin: "auto",
          // border: "1px solid #eee",
          padding: "60px 90px 60px 90px",
        }}
        ref={contentRef}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <img src="/logo.png" alt="" width={120} />
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="small">
              Branch: {ifixit_admin_panel?.user?.branchInfo?.name}
            </Typography>
            <Typography variant="small">
              {" "}
              {ifixit_admin_panel?.user?.branchInfo?.address}
            </Typography>
            <Typography variant="small">
              Contact: {ifixit_admin_panel?.user?.branchInfo?.phone_no_1}
            </Typography>
          </Box>
        </Box>
        <Grid
          container
          justifyContent="center"
          spacing={3}
          sx={{ mb: 2, mt: 2 }}
        >
          <Grid size="auto" sx={{ fontSize: "12px" }}>
            <LanguageOutlinedIcon
              sx={{ fontSize: "16px", position: "relative", top: 3 }}
            />
            &nbsp; www.ifixit.com.bd
          </Grid>
          <Grid size="auto" sx={{ fontSize: "12px" }}>
            <EmailOutlinedIcon
              sx={{ fontSize: "16px", position: "relative", top: 3 }}
            />
            &nbsp; info@ifixit.com.bd
          </Grid>

          <Grid size="auto" sx={{ fontSize: "12px" }}>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="16"
              height="16"
              viewBox="0 0 50 50"
              style={{ position: "relative", top: 3 }}
            >
              <path d="M 25 3 C 12.861562 3 3 12.861562 3 25 C 3 36.019135 11.127533 45.138355 21.712891 46.728516 L 22.861328 46.902344 L 22.861328 29.566406 L 17.664062 29.566406 L 17.664062 26.046875 L 22.861328 26.046875 L 22.861328 21.373047 C 22.861328 18.494965 23.551973 16.599417 24.695312 15.410156 C 25.838652 14.220896 27.528004 13.621094 29.878906 13.621094 C 31.758714 13.621094 32.490022 13.734993 33.185547 13.820312 L 33.185547 16.701172 L 30.738281 16.701172 C 29.349697 16.701172 28.210449 17.475903 27.619141 18.507812 C 27.027832 19.539724 26.84375 20.771816 26.84375 22.027344 L 26.84375 26.044922 L 32.966797 26.044922 L 32.421875 29.564453 L 26.84375 29.564453 L 26.84375 46.929688 L 27.978516 46.775391 C 38.71434 45.319366 47 36.126845 47 25 C 47 12.861562 37.138438 3 25 3 z M 25 5 C 36.057562 5 45 13.942438 45 25 C 45 34.729791 38.035799 42.731796 28.84375 44.533203 L 28.84375 31.564453 L 34.136719 31.564453 L 35.298828 24.044922 L 28.84375 24.044922 L 28.84375 22.027344 C 28.84375 20.989871 29.033574 20.060293 29.353516 19.501953 C 29.673457 18.943614 29.981865 18.701172 30.738281 18.701172 L 35.185547 18.701172 L 35.185547 12.009766 L 34.318359 11.892578 C 33.718567 11.811418 32.349197 11.621094 29.878906 11.621094 C 27.175808 11.621094 24.855567 12.357448 23.253906 14.023438 C 21.652246 15.689426 20.861328 18.170128 20.861328 21.373047 L 20.861328 24.046875 L 15.664062 24.046875 L 15.664062 31.566406 L 20.861328 31.566406 L 20.861328 44.470703 C 11.816995 42.554813 5 34.624447 5 25 C 5 13.942438 13.942438 5 25 5 z"></path>
            </svg>{" "}
            ifixit.com.bd
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          spacing={3}
          sx={{ background: "#ddd", p: 0.5, border: "1px solid #c5c5c5" }}
        >
          <Grid size="auto" sx={{ fontSize: "14px" }}>
            {" "}
            {details?.delivery_status === "Not Delivered"
              ? "JOB CARD"
              : "INVOICE"}{" "}
            NO: {details?.repair_id}
          </Grid>
          <Grid size="auto" sx={{ fontSize: "16px", fontWeight: 500 }}>
            REPAIR{" "}
            {details?.delivery_status === "Not Delivered"
              ? "JOB CARD"
              : "INVOICE"}{" "}
          </Grid>

          <Grid size="auto" sx={{ fontSize: "14px" }}>
            DATE:{dayjs(details?.created_at).format("YYYY-MM-DD")}{" "}
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          // spacing={3}
          sx={{ mt: 1 }}
        >
          <Grid size={6} sx={{ borderRight: "1px solid #ddd", pr: 1 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={1}
              sx={{ mt: 1 }}
            >
              <Grid size={4}>
                <Typography variant="small" sx={{}}>
                  Name:
                </Typography>
              </Grid>

              <Grid size={8}>
                <Typography
                  variant="small"
                  sx={{ background: "#ddd", p: 0.5, borderRadius: "4px" }}
                >
                  {details?.customer_data?.[0]?.name}
                </Typography>
              </Grid>
              <Grid size={4}>
                <Typography variant="small" sx={{}}>
                  Number:
                </Typography>
              </Grid>

              <Grid size={8}>
                <Typography
                  variant="small"
                  sx={{ background: "#ddd", p: 0.5, borderRadius: "4px" }}
                >
                  {details?.customer_data?.[0]?.mobile}
                </Typography>
              </Grid>
              <Grid size={4}>
                <Typography variant="small" sx={{}}>
                  Brand:
                </Typography>
              </Grid>

              <Grid size={8}>
                <Typography
                  variant="small"
                  sx={{ background: "#ddd", p: 0.5, borderRadius: "4px" }}
                >
                  {details?.brand_data?.length > 0
                    ? details?.brand_data[0]?.name
                    : "---------"}
                </Typography>
              </Grid>
              <Grid size={4}>
                <Typography variant="small" sx={{}}>
                  Model:
                </Typography>
              </Grid>

              <Grid size={8}>
                <Typography
                  variant="small"
                  sx={{ background: "#ddd", p: 0.5, borderRadius: "4px" }}
                >
                  {details?.model_data?.length > 0
                    ? details?.model_data[0]?.name
                    : "---------"}
                </Typography>
              </Grid>
              <Grid size={4}>
                <Typography variant="small" sx={{}}>
                  Serial:
                </Typography>
              </Grid>

              <Grid size={8}>
                <Typography
                  variant="small"
                  sx={{ background: "#ddd", p: 0.5, borderRadius: "4px" }}
                >
                  {details?.serial?.length > 0 ? details?.serial : "---------"}
                </Typography>
              </Grid>
              <Grid size={4}>
                <Typography variant="small" sx={{}}>
                  User Pass:
                </Typography>
              </Grid>

              <Grid size={8}>
                <Typography
                  variant="small"
                  sx={{ background: "#ddd", p: 0.5, borderRadius: "4px" }}
                >
                  {details?.pass_code?.length > 0
                    ? details?.pass_code
                    : "---------"}
                </Typography>
              </Grid>

              <Grid size={12}>
                <Typography variant="medium" sx={{}}>
                  Pre Status
                </Typography>
              </Grid>
              <Grid size={12}>
                <Grid container spacing={1}>
                  {allIssueCheckList.map((item, index) => {
                    let newstatus = details?.repair_checklist?.checklist.find(
                      (res) => res?.name === item?.name
                    )?.status;
                    console.log("details newstatus", newstatus);

                    return (
                      <Grid
                        key={index}
                        size={6}
                        sx={{
                          display: "flex",

                          alignItems: "center",
                          gap: 1,
                          // backgroundColor: "#F8F9FA",
                          // p: 1,
                          borderRadius: 2,

                          userSelect: "none",
                        }}
                      >
                        <Box
                          // onClick={() => handleCheckboxChange(index)}
                          sx={{ display: "flex", alignItems: "center " }}
                        >
                          {newstatus === "Functional" ? (
                            <>
                              {/* <img
                        src="/check.png"
                        alt=""
                        style={{ width: "25px" }}
                        // onClick={() => handleCheckboxChange(index, "Damaged")}
                      /> */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="17"
                                height="17"
                                viewBox="0 0 20 20"
                                style={{ position: "relative", left: -2 }}
                              >
                                <path
                                  fill="currentColor"
                                  d="m10.6 15.508l6.396-6.396l-.707-.708l-5.689 5.688l-2.85-2.85l-.708.708zM5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1h12.769q.23 0 .423-.192t.192-.424V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192M5 5v14z"
                                  stroke-width="1"
                                  stroke="#35b522"
                                />
                              </svg>
                            </>
                          ) : newstatus === "Damaged" ? (
                            <img
                              src="/cross.png"
                              alt=""
                              style={{ width: "16px" }}
                              // onClick={() => handleCheckboxChange(index, false)}
                            />
                          ) : (
                            <CheckBoxOutlineBlankIcon
                              sx={{
                                color: "#999",
                                width: "16px",
                                height: "16px",
                              }}
                              // onClick={() =>
                              //   handleCheckboxChange(index, "Functional")
                              // }
                            />
                          )}
                        </Box>
                        <Typography
                          variant="small"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          {item.name}
                        </Typography>

                        {/* <img src="/check.png" alt="" style={{ width: "25px" }} /> */}
                      </Grid>
                    );
                  })}

                  {details?.repair_checklist?.checklist
                    ?.filter(
                      (item) =>
                        !allIssueCheckList.some(
                          (check) => check.name === item.name
                        )
                    )
                    .map((item, index) => {
                      return (
                        <Grid
                          key={index}
                          size={6}
                          sx={{
                            display: "flex",

                            alignItems: "center",
                            gap: 1,
                            // backgroundColor: "#F8F9FA",
                            // p: 1,
                            borderRadius: 2,

                            userSelect: "none",
                          }}
                        >
                          <Box
                            // onClick={() => handleCheckboxChange(index)}
                            sx={{ display: "flex", alignItems: "center " }}
                          >
                            {item?.status === "Functional" ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="17"
                                  height="17"
                                  viewBox="0 0 20 20"
                                  style={{ position: "relative", left: -2 }}
                                >
                                  <path
                                    fill="currentColor"
                                    d="m10.6 15.508l6.396-6.396l-.707-.708l-5.689 5.688l-2.85-2.85l-.708.708zM5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1h12.769q.23 0 .423-.192t.192-.424V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192M5 5v14z"
                                    stroke-width="1"
                                    stroke="#35b522"
                                  />
                                </svg>
                              </>
                            ) : item?.status === "Damaged" ? (
                              <img
                                src="/cross.png"
                                alt=""
                                style={{ width: "16px" }}
                                // onClick={() => handleCheckboxChange(index, false)}
                              />
                            ) : (
                              <CheckBoxOutlineBlankIcon
                                sx={{
                                  color: "#999",
                                  width: "16px",
                                  height: "16px",
                                }}
                                // onClick={() =>
                                //   handleCheckboxChange(index, "Functional")
                                // }
                              />
                            )}
                          </Box>
                          <Typography
                            variant="small"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                          >
                            {item.name}
                          </Typography>

                          {/* <img src="/check.png" alt="" style={{ width: "25px" }} /> */}
                        </Grid>
                      );
                    })}
                  <Grid
                    size={6}
                    sx={{
                      display: "flex",

                      alignItems: "center",
                      gap: 1,
                      // backgroundColor: "#F8F9FA",
                      // p: 1,
                      borderRadius: 2,

                      userSelect: "none",
                    }}
                  >
                    <Typography
                      variant="small"
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      BATTERY HEALTH&nbsp;
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center ",
                        fontSize: "12px",
                      }}
                    >
                      <b>
                        {details?.repair_checklist?.battery_health
                          ? details?.repair_checklist?.battery_health + "%"
                          : "-------"}
                      </b>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={6} sx={{ pl: 1 }}>
            <Grid
              container
              justifyContent="space-between"
              direction="column"
              spacing={1}
              sx={{ height: "100%" }}
            >
              <Box sx={{}}>
                {details?.issues?.length > 0 && (
                  <Box>
                    {/* <Typography variant="small" sx={{ fontWeight: 600, mb: 1 }}>
                      Service Info
                    </Typography> */}
                    <TableContainer>
                      <Table
                        aria-label="simple table"
                        sx={{
                          "& td, & th": { fontSize: "12px", py: 0.5, px: 0 },
                        }}
                      >
                        {/* <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{ fontWeight: 600, fontSize: "10px" }}
                            >
                              Service Name
                            </TableCell>

                            <TableCell
                              align="right"
                              sx={{ fontWeight: 600, fontSize: "10px" }}
                            >
                              Cost
                            </TableCell>
                          </TableRow>
                        </TableHead> */}
                        <TableBody>
                          {details?.issues?.length > 0 &&
                            details?.issues?.map((item) => (
                              <TableRow
                                key={item.name}
                                sx={{
                                  "& td, & th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {item.name}
                                </TableCell>

                                <TableCell
                                  align="right"
                                  // sx={{ background: "#ddd" }}
                                >
                                  <Box
                                    sx={{
                                      background: "#ddd",
                                      py: 0.5,
                                      px: 1,
                                      borderRadius: "4px",
                                    }}
                                  >
                                    {item.repair_cost}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}

                          {details?.product_details?.length > 0 &&
                            details?.product_details?.map((item) => (
                              <TableRow
                                key={item.name}
                                sx={{
                                  "& td, & th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {item.name}
                                </TableCell>

                                <TableCell
                                  align="right"
                                  // sx={{ background: "#ddd" }}
                                >
                                  <Box
                                    sx={{
                                      background: "#ddd",
                                      py: 0.5,
                                      px: 1,
                                      borderRadius: "4px",
                                    }}
                                  >
                                    {item.price}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}

                          {/* <TableRow
                            sx={{
                              background: "#eee",
                              "& td, & th": { fontSize: "10px" },
                            }}
                          >
                            <TableCell>Total</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {repairCost}
                            </TableCell>
                          </TableRow> */}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Box>
              <Box sx={{}}>
                <TableContainer
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Table
                    sx={{
                      "& td, & th": { fontSize: "12px", py: 1 },
                      border: "1px solid #ddd",
                    }}
                    aria-label="simple table"
                  >
                    <TableBody sx={{ "& td, & th": { fontSize: "12px" } }}>
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
                          -{" "}
                          {details?.discount_amount
                            ? details?.discount_amount
                            : 0}
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
            </Grid>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Typography variant="small" sx={{ fontWeight: 500, mb: 1 }}>
            <span style={{ color: "red" }}>30-day service warranty:</span> If
            your device encounters the same issues within 30 days of the
            repair,we will fix the issue at our own cost without any question.
          </Typography>
          <Typography variant="small" sx={{ fontWeight: 500, mb: 1 }}>
            <span style={{ color: "red" }}> Service disclaimers:</span> Be sure
            to collect your item within 2 months of servicing.Otherwise,we will
            not be liable if your item is lost,damaged or stolen.
          </Typography>

          <Typography variant="small" sx={{ fontWeight: 500, mb: 1 }}>
            <span style={{ color: "red" }}> Terms and conditions:</span> Please
            also be aware that we can only service your gadgets at your own
            risk. Even though we do our best in 'IFiXIT' to make things better.
            However,in worst case scenario,your gadget may be damaged during
            repairs. We will not be liable if such things happen. Visit:{" "}
            <a
              target="_blank"
              href="https://ifixit.com.bd/warranty-policy"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              https://ifixit.com.bd/warranty-policy
            </a>{" "}
            [Recommended]
          </Typography>
          <Typography variant="small" sx={{ fontWeight: 500, mb: 1 }}>
            ** Warrnaty for display replacement will be void if color line /
            black screen / dead pixel appears in screen.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Invoice;
