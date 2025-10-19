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

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import WarrantyProductSKU from "./WarrantyProductSKU";

import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { designationList, roleList, statusList } from "../../data";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { jwtDecode } from "jwt-decode";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const AllWarrantyList = () => {
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

  const [branchList, setBranchList] = useState([]);
  const [filterRepairStatus, setFilterRepairStatus] = useState("");
  const [modelList, setModelList] = useState();
  const [modelId, setModelId] = useState("");
  const [branch, setBranch] = useState("");
  const [warrantyNo, setWarrantyNo] = useState("");

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
      let newBranch = branch;
      let newStartingTime = "";
      let newEndingTime = "";

      if (branch === "None") {
        newBranch = "";
      }
      if (status === "None") {
        newStatus = "";
      }

      if (startingTime !== null) {
        newStartingTime = dayjs(startingTime).format("YYYY-MM-DD");
      }
      if (endingTime !== null) {
        newEndingTime = dayjs(endingTime).format("YYYY-MM-DD");
      }

      url = `/api/v1/warranty?warranty_id=${warrantyNo?.trim()}&&branch_id=${newBranch}&startDate=${newStartingTime}&endDate=${newEndingTime}&status=${newStatus}&limit=${newLimit}&page=${
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

  const clearFilter = (event) => {
    console.log("clearFilter");
    setFilterRepairStatus("");
    setWarrantyNo("");
    setModelId("");
    setBranch("");
    setStatus("");
    setStartingTime(null);
    setEndingTime(null);
    setPage(0);
    const newUrl = `/api/v1/warranty?limit=${rowsPerPage}&page=1`;
    getData(0, rowsPerPage, newUrl);
  };

  const getBranchList = async () => {
    setLoading2(true);

    let url = `/api/v1/branch/dropdownlist`;
    let allData = await getDataWithToken(url);

    if (allData?.status >= 200 && allData?.status < 300) {
      setBranchList(allData?.data?.data);

      if (allData.data?.data?.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };
  useEffect(() => {
    getData();
    getBranchList();
    // getData2();
    // getWarrantyData();
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
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 1.5, mb: 1.75 }}
        >
          <Grid size={12}>
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
            >
              Details
            </Typography>
          </Grid>
          <Grid size={12}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid
                container
                justifyContent="right"
                alignItems="center"
                spacing={1}
              >
                <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4, xl: 2 }}>
                  <TextField
                    sx={{ ...customeTextFeild }}
                    id="Name"
                    fullWidth
                    size="small"
                    variant="outlined"
                    label="Warranty No"
                    value={warrantyNo}
                    onChange={(e) => setWarrantyNo(e.target.value)}
                  />
                </Grid>
                {/* <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4, xl: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From Date"
                    value={startingTime}
                    onChange={(newValue) => setStartingTime(newValue)}
                    format="DD/MM/YYYY"
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: { ...customeTextFeild },
                      }, // ✅ this is the correct way
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4, xl: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To Date"
                    value={endingTime}
                    onChange={(newValue) => setEndingTime(newValue)}
                    format="DD/MM/YYYY"
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: { ...customeTextFeild },
                      }, // ✅ this is the correct way
                    }}
                  />
                </LocalizationProvider>
              </Grid> */}

                {/* <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4, xl: 2 }}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    size="small"
                    // sx={{ ...customeTextFeild }}
                    sx={{ ...customeTextFeild }}
                  >
                    <InputLabel id="demo-status-outlined-label">
                      Model
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-status-outlined-label"
                      id="demo-status-outlined"
                      label="Model"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200, // Controls dropdown height
                          },
                        },
                      }}
                      value={modelId}
                      onChange={(e) => setModelId(e.target.value)}
                    >
                      <MenuItem value="None">None</MenuItem>
                      {modelList?.map((item) => (
                        <MenuItem key={item?._id} value={item?._id}>
                          {item?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid> */}
                {/* <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4, xl: 2 }}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  size="small"
                  // sx={{ ...customeTextFeild }}
                  sx={{ ...customeTextFeild }}
                >
                  <InputLabel id="demo-status-outlined-label">
                    Repair Status
                  </InputLabel>
                  <Select
                    fullWidth
                    labelId="demo-status-outlined-label"
                    id="demo-status-outlined"
                    label="Repair Status"
                    value={filterRepairStatus}
                    onChange={(e) => setFilterRepairStatus(e.target.value)}
                  >
                    <MenuItem value="None">None</MenuItem>
                    {statusList?.map((item) => (
                      <MenuItem key={item?.name} value={item?.name}>
                        {item?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}
                {jwtDecode(ifixit_admin_panel?.token)?.user?.is_main_branch && (
                  <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4, xl: 2 }}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      size="small"
                      // sx={{ ...customeTextFeild }}
                      sx={{ ...customeTextFeild }}
                    >
                      <InputLabel id="demo-status-outlined-label">
                        Branch
                      </InputLabel>
                      <Select
                        fullWidth
                        labelId="demo-status-outlined-label"
                        id="demo-status-outlined"
                        label="Branch"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                      >
                        <MenuItem value="None">None</MenuItem>
                        {branchList?.map((item) => (
                          <MenuItem key={item?._id} value={item?._id}>
                            {item?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                {/* <Grid size={2}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    size="small"
                    // sx={{ ...customeTextFeild }}
                    sx={{ ...customeTextFeild }}
                  >
                    <InputLabel id="demo-status-outlined-label">
                      Status
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-status-outlined-label"
                      id="demo-status-outlined"
                      label="Status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <MenuItem value="None">None</MenuItem>
                      <MenuItem value={true}>Active</MenuItem>
                      <MenuItem value={false}>Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}

                <Grid size={2}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={{ lg: 1, xl: 1 }}>
                      <Grid size={4}>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="info"
                          disableElevation
                          size="small"
                          sx={{ py: "4px" }}
                          onClick={clearFilter}
                        >
                          <RestartAltIcon />
                        </Button>
                      </Grid>
                      <Grid size={8}>
                        <Button
                          fullWidth
                          variant="contained"
                          disableElevation
                          color="info"
                          sx={{ py: "4px" }}
                          size="small"
                          startIcon={<SearchIcon />}
                          onClick={(event) => handleChangePage(event, 0)}
                        >
                          Search
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
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
                          {/* &nbsp; &nbsp;
                          <WarrantyProductSKU
                            warrantyData={row}
                            reload={reload}
                            setReload={setReload}
                          />{" "} */}
                          &nbsp; &nbsp;
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
                            to={`/repair/${row?.repair_data[0]?._id}/update-warranty/${row?._id}`}
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

export default AllWarrantyList;
