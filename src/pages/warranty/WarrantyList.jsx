import React, { useState, useEffect, useContext, useRef } from "react";
import { getDataWithToken } from "../../services/GetDataService";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";
import Skeleton from "@mui/material/Skeleton";

import { Link, useParams } from "react-router-dom";

import { useSnackbar } from "notistack";
import axios from "axios";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { AuthContext } from "../../context/AuthContext";
import { Box, Chip, Collapse, IconButton, TableContainer } from "@mui/material";
import Grid from "@mui/material/Grid2";

import dayjs from "dayjs";

import moment from "moment";
import Slide from "@mui/material/Slide";

import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import AddWarranty from "./AddWarranty";
import { statusList } from "../../data";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import WarrantyProductSKU from "./WarrantyProductSKU";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const WarrantyList = () => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const { rid } = useParams();
  const [tableDataList, setTableDataList] = useState([]);
  const [warrantyDataList, setWarrantyDataList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [status, setStatus] = useState("");

  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [startingTime, setStartingTime] = useState(null);
  const [endingTime, setEndingTime] = useState(null);

  const [imageDialog, setImageDialog] = useState(false);
  const [images, setImages] = useState([]);
  const [detailDialog, setDetailDialog] = useState(false);
  const [details, setDetails] = useState([]);

  const [repairLoading, setRepairLoading] = useState(false);
  const [repairDetails, setRepairDetails] = useState("");
  const [loading2, setLoading2] = useState(false);
  const [warrantyList, setWarrantyList] = useState([]);

  const [removeSKUDialog, setRemoveSKUDialog] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [removeSkuDetails, setRemoveSkuDetails] = useState();
  const [reload, setReload] = useState(false);

  const isDateAfterMonths = (createdAt, monthsToAdd) => {
    const newDate = dayjs(createdAt).add(monthsToAdd, "month");
    return newDate.isAfter(dayjs());
  };
  const handleDetailClose = () => {
    setDetails({});
    setDetailDialog(false);
  };

  const customeTextFeild = {
    // padding: "15px 20px",
    // background: "#FAFAFA",
    "& label": {
      fontSize: "11px",
    },
    "& label.Mui-focused": {
      color: "#0F1624",
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-input": {
      padding: "8px 12px",
    },
    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px",
      fontSize: "13px",
      "& fieldset": {
        // borderColor: "rgba(0,0,0,0)",
        borderRadius: "8px",
      },

      "&:hover fieldset": {
        borderColor: "#969696",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#969696",
      },
    },
  };

  const handleImageClose = () => {
    setImages([]);
    setImageDialog(false);
  };

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
    let loadingNumber = 7;

    for (let i = 0; i < 10; i++) {
      content.push(
        <TableRow key={i}>
          {[...Array(11).keys()].map((e, i) => (
            <TableCell key={i}>
              <Skeleton></Skeleton>
            </TableCell>
          ))}
        </TableRow>
      );
    }
    return content;
  };

  const handleChangePage = (event, newPage) => {
    console.log("newPage", newPage);
    getData(newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log("event.target.value", event.target.value);
    setRowsPerPage(parseInt(event.target.value, rowsPerPage));
    getData(0, event.target.value);
    setPage(0);
  };

  const getData = async (pageNO, limit, newUrl) => {
    setLoading(true);
    let newPageNO = page;
    let url;
    if (pageNO >= 0) {
      newPageNO = pageNO;
    }
    let newLimit = rowsPerPage;
    if (limit) {
      newLimit = limit;
    }
    if (newUrl) {
      url = newUrl;
    } else {
      let newStatus = status;

      let newStartingTime = "";
      let newEndingTime = "";
      if (status === "None") {
        newStatus = "";
      }

      if (startingTime !== null) {
        newStartingTime = dayjs(startingTime).format("YYYY-MM-DD");
      }
      if (endingTime !== null) {
        newEndingTime = dayjs(endingTime).format("YYYY-MM-DD");
      }

      url = `/api/v1/warranty?repair_id=${rid}&startDate=${newStartingTime}&endDate=${newEndingTime}&status=${newStatus}&limit=${newLimit}&page=${
        newPageNO + 1
      }`;
    }
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setWarrantyDataList(allData?.data?.data);
      // setRowsPerPage(allData?.data?.limit);
      setTotalData(allData?.data?.totalData);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading(false);
  };
  const getData2 = async () => {
    setLoading2(true);

    let url = `/api/v1/repairAttachedSpareparts?repair_id=${rid}&is_warranty_claimed_sku=false&status=true`;

    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      const items = allData?.data?.data || [];

      // Using Promise.all to resolve all async operations inside map
      const newData = await Promise.all(
        items.map(async (item) => {
          const product = await getPreviousProducts(item?.sku_number);
          return { ...item, product }; // Merge the product data with existing item
        })
      );

      setTableDataList(newData);
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };

  const getWarrantyData = async () => {
    setLoading2(true);

    let url = `/api/v1/repairAttachedSpareparts?repair_id=${rid}&is_warranty_claimed_sku=true&status=true`;

    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      const items = allData?.data?.data || [];

      // Using Promise.all to resolve all async operations inside map
      const newData = await Promise.all(
        items.map(async (item) => {
          const product = await getPreviousProducts(item?.sku_number);
          return { ...item, product }; // Merge the product data with existing item
        })
      );

      setWarrantyList(newData);
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };

  const getPreviousProducts = async (sku) => {
    let url;
    let result = {};
    url = `/api/v1/stock?sku_number=${parseInt(sku)}`;

    let allData = await getDataWithToken(url);

    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData?.status >= 200 && allData?.status < 300) {
      const products = allData?.data?.data || [];

      return products[0];
    } else {
      handleSnakbarOpen(
        allData?.data?.message || "Something went wrong",
        "error"
      );
      return null;
    }
  };
  useEffect(() => {
    getData();

    getData2();
    getWarrantyData();
  }, [reload]);

  return (
    <>
      <Grid container columnSpacing={3} style={{ padding: "24px 0" }}>
        <Grid size={6}>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ color: "#0F1624", fontWeight: 600 }}
          >
            Warranty List
          </Typography>
        </Grid>
        <Grid size={6} style={{ textAlign: "right" }}>
          {ifixit_admin_panel?.user?.permission?.includes("update_repair") && (
            <>
              {/* <AddWarranty /> */}

              <Button
                variant="outlined"
                disableElevation
                size="small"
                color="secondary"
                component={Link}
                to={`/repair/${rid}/add-warranty`}
                // sx={{ py: 1.125, px: 2, borderRadius: "6px" }}

                startIcon={<AddOutlinedIcon />}
              >
                Add Warranty
              </Button>
            </>
          )}
        </Grid>
      </Grid>

      <Box
        sx={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          mb: 2,
          p: 2,
        }}
      >
        <Box sx={{ margin: "16px" }}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Invoice No :{" "}
                <b>
                  {repairDetails?.repair_id
                    ? repairDetails?.repair_id
                    : "---------"}
                </b>
              </Typography>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Invoice Date :{" "}
                <b>{dayjs(repairDetails?.created_at).format("DD MMM YYYY")}</b>
              </Typography>
            </Grid>

            <Grid size={8}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Name :{" "}
                <b>
                  {repairDetails?.customer_data?.length > 0
                    ? repairDetails?.customer_data[0]?.name
                    : "---------"}
                </b>
              </Typography>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Number :{" "}
                <b>
                  {repairDetails?.customer_data?.length > 0
                    ? repairDetails?.customer_data[0]?.mobile
                    : "---------"}
                </b>
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            mb: 2,
            background: "#fff",
            border: "1px solid #EAECF1",
            borderRadius: "12px",
            // overflow: "hidden",
            padding: "16px 0",
            boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          }}
        >
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 1.5, mb: 1.75 }}
          >
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 2, xl: 2 }}>
              <Typography
                variant="medium"
                gutterBottom
                component="div"
                sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
                onClick={() => console.log("tableDataList", tableDataList)}
              >
                Attached List ({tableDataList?.length})
              </Typography>
            </Grid>
          </Grid>
          <div
            style={{
              overflowX: "auto",

              minWidth: "100%",

              // padding: "10px 16px 0px",
              boxSizing: "border-box",
            }}
          >
            <TableContainer>
              <Table
                stickyHeader
                aria-label="sticky table"
                sx={{
                  "& th": {
                    padding: "4px 16px",
                    fontSize: "12px",
                  },
                  "& td": {
                    padding: "4px 12px",
                    fontSize: "12px",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Product Name
                    </TableCell>
                    {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                          Purchase date
                        </TableCell> */}
                    {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                        Branch
                      </TableCell>

                      <TableCell style={{ whiteSpace: "nowrap" }}>
                        Purchase price
                      </TableCell> */}
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      SKU Number
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Warranty (Months)
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Is Warranty Available
                    </TableCell>

                    {/* <TableCell style={{ whiteSpace: "nowrap" }}>Device</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Model</TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>Price</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Warranty
                  </TableCell>
                 
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Serial No
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Description
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>*/}

                    {/* <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                        Actions
                      </TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!loading2 &&
                    tableDataList.length > 0 &&
                    tableDataList.map((item, i) => (
                      <TableRow
                        key={i}
                        // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        {/* <TableCell sx={{ width: 50 }}>
                        <img
                          src={
                            item?.images?.length > 0
                              ? item?.images[0]?.url
                              : "/noImage.jpg"
                          }
                          alt=""
                          width={40}
                        />
                      </TableCell> */}
                        <TableCell sx={{ minWidth: "130px" }}>
                          {item?.product?.product_data?.length > 0
                            ? item?.product?.product_data[0]?.name
                            : "---------"}{" "}
                          &nbsp;{" "}
                          {item?.product?.product_variation_data?.length > 0
                            ? item?.product?.product_variation_data[0]?.name
                            : "---------"}
                        </TableCell>

                        {/* <TableCell>
                              {moment(
                                item?.product?.purchase_data[0]?.purchase_date
                              ).format("DD/MM/YYYY")}
                            </TableCell> */}
                        {/*  <TableCell>
                            {item?.branch_data
                              ? item?.branch_data[0]?.name
                              : "---------"}
                          </TableCell>
                          <TableCell sx={{ minWidth: "130px" }}>
                            {item?.purchase_products_data
                              ? item?.purchase_products_data[0]?.unit_price
                              : "---------"}
                          </TableCell> */}
                        <TableCell>{item?.sku_number}</TableCell>
                        <TableCell>
                          {item?.product?.product_data[0]?.warranty}
                        </TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          {isDateAfterMonths(
                            repairDetails?.created_at,

                            item?.product?.product_data[0]?.warranty
                          ) ? (
                            <Button
                              variant="outlined"
                              color="success"
                              size="small"
                              disabled
                              sx={{
                                fontSize: "12px",
                                pointerEvents: "none", // prevent hover/click
                                backgroundColor: "transparent",
                                color: "#35b522", // same as the icon color
                                borderColor: "#35b522",
                                "&.Mui-disabled": {
                                  opacity: 1, // prevent default disabled opacity
                                  backgroundColor: "transparent",
                                  color: "#35b522",
                                  borderColor: "#35b522",
                                },
                              }}
                              endIcon={
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                    stroke="#35b522"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              }
                            >
                              {" "}
                              Warranty Available
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              disabled
                              sx={{
                                fontSize: "12px",
                                pointerEvents: "none", // prevent hover/click
                                backgroundColor: "transparent",
                                color: "#D92D20", // same as the icon color
                                borderColor: "#D92D20",
                                "&.Mui-disabled": {
                                  opacity: 1, // prevent default disabled opacity
                                  backgroundColor: "transparent",
                                  color: "#D92D20",
                                  borderColor: "#D92D20",
                                },
                              }}
                              endIcon={
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                    stroke="#D92D20"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              }
                            >
                              {" "}
                              Warranty Not Available
                            </Button>
                          )}
                        </TableCell>

                        {/*  <TableCell align="right">
                         <IconButton
                              onClick={() => {
                                setRemoveSKUDialog(true);
                                setRemoveSkuDetails(item);
                              }}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12.2837 7.5L11.9952 15M8.00481 15L7.71635 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.875 4.96358M16.023 4.82547L15.1332 16.3938C15.058 17.3707 14.2434 18.125 13.2637 18.125H6.73631C5.75655 18.125 4.94198 17.3707 4.86683 16.3938L3.97696 4.82547M16.023 4.82547C15.0677 4.6812 14.1013 4.57071 13.125 4.49527M3.125 4.96358C3.40798 4.91456 3.69198 4.86851 3.97696 4.82547M3.97696 4.82547C4.93231 4.6812 5.89874 4.57071 6.875 4.49527M13.125 4.49527V3.73182C13.125 2.74902 12.3661 1.92853 11.3838 1.8971C10.9244 1.8824 10.463 1.875 10 1.875C9.53696 1.875 9.07565 1.8824 8.61618 1.8971C7.63388 1.92853 6.875 2.74902 6.875 3.73182V4.49527M13.125 4.49527C12.0938 4.41558 11.0516 4.375 10 4.375C8.94836 4.375 7.9062 4.41558 6.875 4.49527"
                                  stroke="#4A5468"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </IconButton> 
                          </TableCell>*/}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>

        <Box
          sx={{
            mt: 1,

            background: "#fff",
            border: "1px solid #EAECF1",
            borderRadius: "12px",
            // overflow: "hidden",
            padding: "16px 0",
            boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          }}
        >
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 1.5, mb: 1.75 }}
          >
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
              <Typography
                variant="medium"
                gutterBottom
                component="div"
                sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
              >
                Previous Warranty Stock List ({warrantyList?.length})
              </Typography>
            </Grid>
          </Grid>
          <div
            style={{
              overflowX: "auto",

              minWidth: "100%",

              // padding: "10px 16px 0px",
              boxSizing: "border-box",
            }}
          >
            <TableContainer>
              <Table
                stickyHeader
                aria-label="sticky table"
                sx={{
                  "& th": {
                    padding: "4px 16px",
                    fontSize: "12px",
                  },
                  "& td": {
                    padding: "2px 12px",
                    fontSize: "12px",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Product Name
                    </TableCell>
                    {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                          Purchase date
                        </TableCell> */}
                    {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                        Branch
                      </TableCell>

                      <TableCell style={{ whiteSpace: "nowrap" }}>
                        Purchase price
                      </TableCell> */}
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      SKU Number
                    </TableCell>

                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Claimed on SKU Number
                    </TableCell>
                    {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                        Is Warranty Available
                      </TableCell> */}

                    {/* <TableCell style={{ whiteSpace: "nowrap" }}>Device</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Model</TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>Price</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Warranty
                  </TableCell>
                 
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Serial No
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Description
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>*/}

                    <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!loading2 &&
                    warrantyList.length > 0 &&
                    warrantyList.map((item, i) => (
                      <TableRow
                        key={i}
                        // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        {/* <TableCell sx={{ width: 50 }}>
                        <img
                          src={
                            item?.images?.length > 0
                              ? item?.images[0]?.url
                              : "/noImage.jpg"
                          }
                          alt=""
                          width={40}
                        />
                      </TableCell> */}
                        <TableCell sx={{ minWidth: "130px" }}>
                          {item?.product?.product_data?.length > 0
                            ? item?.product?.product_data[0]?.name
                            : "---------"}{" "}
                          &nbsp;{" "}
                          {item?.product?.product_variation_data?.length > 0
                            ? item?.product?.product_variation_data[0]?.name
                            : "---------"}
                        </TableCell>

                        {/* <TableCell>
                              {moment(
                                item?.product?.purchase_data[0]?.purchase_date
                              ).format("DD/MM/YYYY")}
                            </TableCell> */}
                        {/*  <TableCell>
                            {item?.branch_data
                              ? item?.branch_data[0]?.name
                              : "---------"}
                          </TableCell>
                          <TableCell sx={{ minWidth: "130px" }}>
                            {item?.purchase_products_data
                              ? item?.purchase_products_data[0]?.unit_price
                              : "---------"}
                          </TableCell> */}
                        <TableCell>{item?.sku_number}</TableCell>
                        <TableCell>{item?.claimed_on_sku_number}</TableCell>
                        {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                            {isDateAfterMonths(
                              repairDetails?.created_at,

                              item?.product?.product_data[0]?.warranty
                            ) ? (
                              <Button
                                variant="outlined"
                                color="success"
                                size="small"
                                endIcon={
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                      stroke="#35b522"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                }
                              >
                                {" "}
                                Warranty Available
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                endIcon={
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                      stroke="#D92D20"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                }
                              >
                                {" "}
                                Warranty Not Available
                              </Button>
                            )}
                          </TableCell> */}

                        <TableCell align="right">
                          <IconButton
                            onClick={() => {
                              setRemoveSKUDialog(true);
                              setRemoveSkuDetails(item);
                            }}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.2837 7.5L11.9952 15M8.00481 15L7.71635 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.875 4.96358M16.023 4.82547L15.1332 16.3938C15.058 17.3707 14.2434 18.125 13.2637 18.125H6.73631C5.75655 18.125 4.94198 17.3707 4.86683 16.3938L3.97696 4.82547M16.023 4.82547C15.0677 4.6812 14.1013 4.57071 13.125 4.49527M3.125 4.96358C3.40798 4.91456 3.69198 4.86851 3.97696 4.82547M3.97696 4.82547C4.93231 4.6812 5.89874 4.57071 6.875 4.49527M13.125 4.49527V3.73182C13.125 2.74902 12.3661 1.92853 11.3838 1.8971C10.9244 1.8824 10.463 1.875 10 1.875C9.53696 1.875 9.07565 1.8824 8.61618 1.8971C7.63388 1.92853 6.875 2.74902 6.875 3.73182V4.49527M13.125 4.49527C12.0938 4.41558 11.0516 4.375 10 4.375C8.94836 4.375 7.9062 4.41558 6.875 4.49527"
                                stroke="#4A5468"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </Box>
      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          padding: "16px 0",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
        }}
      >
        <div
          style={{
            overflowX: "auto",

            minWidth: "100%",
            width: "Calc(100vw - 385px)",
            // padding: "10px 16px 0px",
            boxSizing: "border-box",
          }}
        >
          <TableContainer sx={{ maxHeight: "Calc(100vh - 250px)" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Warranty No
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Paid Amount
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Due Amount
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Discount Amount
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Total Service charge
                  </TableCell>

                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>Price</TableCell>*/}

                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                    Price / <br />
                    Not on sale
                  </TableCell> */}
                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                    Serial No
                  </TableCell> */}
                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                    Description
                  </TableCell> */}
                  <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>
                  {ifixit_admin_panel?.user?.permission?.includes(
                    "view_spare_parts_details"
                  ) && (
                    <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  warrantyDataList.length > 0 &&
                  warrantyDataList.map((row, i) => (
                    <TableRow
                      key={i}
                      // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      {/* <TableCell sx={{ width: 50 }}>
                        <img
                          src={
                            row?.images?.length > 0
                              ? row?.images[0]?.url
                              : "/noImage.jpg"
                          }
                          alt=""
                          width={40}
                        />
                      </TableCell> */}
                      <TableCell sx={{ minWidth: "130px" }}>
                        {row?.warranty_id}
                      </TableCell>

                      {/* <TableCell>
                        {row?.brand_data[0]?.name
                          ? row?.brand_data[0]?.name
                          : "---------"}
                      </TableCell>

                      <TableCell>
                        {row?.category_data[0]?.name
                          ? row?.category_data[0]?.name
                          : "---------"}
                      </TableCell>
                      <TableCell>
                        {row?.device_data[0]?.name
                          ? row?.device_data[0]?.name
                          : "---------"}
                      </TableCell>
                      <TableCell>
                        {row?.model_data[0]?.name
                          ? row?.model_data[0]?.name
                          : "---------"}
                      </TableCell> */}
                      {/* <TableCell>
                        {row?.price ? row?.price : "---------"}
                      </TableCell> */}

                      {/* <TableCell>
                        {row?.product_id ? row?.product_id : "---------"}
                      </TableCell> */}

                      {/* <TableCell sx={{ minWidth: "150px" }}>
                        {row?.description ? row?.description : "---------"}
                      </TableCell> */}
                      <TableCell>
                        {row?.payment_info?.length > 0
                          ? row?.payment_info.reduce(
                              (sum, item) => sum + item.amount,
                              0
                            )
                          : 0}
                      </TableCell>
                      <TableCell sx={{ color: "#D92D20" }}>
                        {row?.due_amount > -1 ? row?.due_amount : "-------"}
                      </TableCell>
                      <TableCell sx={{ color: "#D92D20" }}>
                        {row?.discount_amount > -1
                          ? row?.discount_amount
                          : "-------"}
                      </TableCell>
                      <TableCell>
                        {row?.service_charge > -1
                          ? row?.service_charge
                          : "-------"}
                      </TableCell>

                      <TableCell sx={{ minWidth: "150px" }}>
                        {row?.remarks ? row?.remarks : "---------"}
                      </TableCell>
                      <TableCell>
                        {row?.repair_status_history_data?.length > 0
                          ? (() => {
                              const lastStatus =
                                row.repair_status_history_data[
                                  row.repair_status_history_data.length - 1
                                ];
                              const statusColor =
                                statusList.find(
                                  (el) =>
                                    el.name === lastStatus.repair_status_name
                                )?.color || "";

                              return (
                                <Chip
                                  label={lastStatus.repair_status_name}
                                  variant="outlined"
                                  sx={{
                                    border: "0px",
                                    backgroundColor: statusColor,
                                  }}
                                />
                              );
                            })()
                          : "----------"}
                      </TableCell>
                      {/* <TableCell align="center" style={{ minWidth: "130px" }}>
                        <Invoice data={row} />
                      </TableCell> */}
                      {ifixit_admin_panel?.user?.permission?.includes(
                        "view_spare_parts_details"
                      ) && (
                        <TableCell align="right">
                          &nbsp; &nbsp;
                          <WarrantyProductSKU warrantyData={row} reload={reload} setReload={setReload}/> &nbsp;
                          &nbsp;
                          <Button
                            size="small"
                            variant="outlined"
                            color="info"
                            startIcon={<ListAltOutlinedIcon />}
                            component={Link}
                            to={`/repair/details/${rid}`}
                          >
                            Details
                          </Button>
                          &nbsp; &nbsp;
                          <Button
                            size="small"
                            variant="outlined"
                            color="text"
                            disabled={
                              row?.transfer_status === "Received" ||
                              row?.transfer_status === "Canceled"
                            }
                            sx={{
                              "& svg": {
                                opacity: ["Received", "Canceled"].includes(
                                  row?.transfer_status
                                )
                                  ? 0.5
                                  : 1,
                              },
                            }}
                            startIcon={
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="Outline"
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                              >
                                <path
                                  d="M18.656.93,6.464,13.122A4.966,4.966,0,0,0,5,16.657V18a1,1,0,0,0,1,1H7.343a4.966,4.966,0,0,0,3.535-1.464L23.07,5.344a3.125,3.125,0,0,0,0-4.414A3.194,3.194,0,0,0,18.656.93Zm3,3L9.464,16.122A3.02,3.02,0,0,1,7.343,17H7v-.343a3.02,3.02,0,0,1,.878-2.121L20.07,2.344a1.148,1.148,0,0,1,1.586,0A1.123,1.123,0,0,1,21.656,3.93Z"
                                  fill="#787878"
                                />
                                <path
                                  d="M23,8.979a1,1,0,0,0-1,1V15H18a3,3,0,0,0-3,3v4H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2h9.042a1,1,0,0,0,0-2H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H16.343a4.968,4.968,0,0,0,3.536-1.464l2.656-2.658A4.968,4.968,0,0,0,24,16.343V9.979A1,1,0,0,0,23,8.979ZM18.465,21.122a2.975,2.975,0,0,1-1.465.8V18a1,1,0,0,1,1-1h3.925a3.016,3.016,0,0,1-.8,1.464Z"
                                  fill="#787878"
                                />
                              </svg>
                            }
                            component={Link}
                            to={`/repair/${rid}/update-warranty/${row?._id}`}
                            state={{ row }}
                          >
                            Update
                          </Button>
                          {/* <UpdateSpareParts clearFilter={clearFilter} row={row} /> */}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}

                {!loading && warrantyDataList.length < 1 ? (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell colSpan={7} style={{ textAlign: "center" }}>
                      <strong> {message}</strong>
                    </TableCell>
                  </TableRow>
                ) : null}
                {loading && pageLoading()}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {warrantyDataList.length > 0 ? (
          <div>
            <TablePagination
              style={{ display: "block", border: "none" }}
              rowsPerPageOptions={[]}
              count={totalData}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        ) : (
          <br />
        )}
      </div>
    </>
  );
};

export default WarrantyList;
