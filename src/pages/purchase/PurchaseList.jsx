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
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Link } from "react-router-dom";
import TableChartIcon from "@mui/icons-material/TableChart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { useSnackbar } from "notistack";
import axios from "axios";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { AuthContext } from "../../context/AuthContext";
import { Box, Collapse, TableContainer } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import { DateField } from "@mui/x-date-pickers/DateField";
import Checkbox from "@mui/material/Checkbox";
import moment from "moment";
import Slide from "@mui/material/Slide";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ReactToPrint from "react-to-print";
import {
  designationList,
  paymentStatusList,
  purchaseStatusList,
  roleList,
} from "../../data";
import AddPurchase from "./AddPurchase";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import Chip from "@mui/material/Chip";
import { jwtDecode } from "jwt-decode";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const PurchaseList = () => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [tableDataList, setTableDataList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [orderID, setOrderID] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState("");
  const [category, SetCategory] = useState("");

  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [filterList, setFilterList] = useState([]);
  const [startingTime, setStartingTime] = useState(null);
  const [endingTime, setEndingTime] = useState(null);

  const [imageDialog, setImageDialog] = useState(false);
  const [images, setImages] = useState([]);
  const [detailDialog, setDetailDialog] = useState(false);
  const [details, setDetails] = useState([]);
  const [brandId, setBrandId] = useState([]);
  const [categoryId, setCategoryId] = useState([]);
  const [deviceId, setDeviceId] = useState([]);
  const [modelId, setModelId] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [modelList, setModelList] = useState([]);

  const [supplierList, setSupplierList] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [branchList, setBranchList] = useState([]);
  const [branch, setBranch] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

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

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
    setDeleteData({});
  };

  const handleDeleteDialog = (i, row) => {
    setDeleteData({ index: i, row: row });
    setDeleteDialog(true);
  };

  const pageLoading = () => {
    let content = [];
    let loadingNumber = 12;

    if (
      ifixit_admin_panel?.user?.permission?.includes("view_purchase_details")
    ) {
      loadingNumber = loadingNumber + 1;
    }
    for (let i = 0; i < 10; i++) {
      content.push(
        <TableRow key={i}>
          {[...Array(13).keys()].map((e, i) => (
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

  const clearFilter = (event) => {
    setSupplier("");
    setBranch("");
    setPurchaseStatus("");
    setPaymentStatus("");

    setStatus("");

    setPage(0);
    const newUrl = `/api/v1/purchase?limit=${rowsPerPage}&page=1`;
    getData(0, rowsPerPage, newUrl);
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

      let newSupplier = supplier;
      let newBranch = branch;
      let newPurchaseStatus = purchaseStatus;
      let newPaymentStatus = paymentStatus;

      let newCategoryId = categoryId;
      let newBrandId = brandId;
      let newModelId = modelId;
      let newDeviceId = deviceId;

      let newStartingTime = "";
      let newEndingTime = "";
      if (status === "None") {
        newStatus = "";
      }
      if (supplier === "None") {
        newSupplier = "";
      }
      if (branch === "None") {
        newBranch = "";
      }
      if (purchaseStatus === "None") {
        newPurchaseStatus = "";
      }
      if (paymentStatus === "None") {
        newPaymentStatus = "";
      }

      if (startingTime !== null) {
        newStartingTime = dayjs(startingTime).format("YYYY-MM-DD");
      }
      if (endingTime !== null) {
        newEndingTime = dayjs(endingTime).format("YYYY-MM-DD");
      }

      url = `/api/v1/purchase?supplier_id=${newSupplier.trim()}&branch_id=${newBranch}&purchase_status=${newPurchaseStatus}&payment_status=${newPaymentStatus}&status=${newStatus}&limit=${newLimit}&page=${
        newPageNO + 1
      }`;
    }
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setTableDataList(allData?.data?.data);
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

  const getBranchList = async () => {
    setLoading2(true);

    let url = `/api/v1/branch/dropdownlist`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setBranchList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };

  const getSupplierList = async () => {
    setLoading2(true);

    let url = `/api/v1/supplier/dropdownlist`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setSupplierList(allData?.data?.data);

      if (allData.data.data.length < 1) {
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
    getSupplierList();
    getBranchList();
  }, []);

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
            Purchase List
          </Typography>
        </Grid>
        <Grid size={6} style={{ textAlign: "right" }}>
          {/* <AddPurchase clearFilter={clearFilter} /> */}
          <Button
            variant="contained"
            disableElevation
            sx={{ py: 1.125, px: 2, borderRadius: "6px" }}
            component={Link}
            to="/add-purchase"
            startIcon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.99996 4.16675V15.8334M4.16663 10.0001H15.8333"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
          >
            Add Purchase
          </Button>
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
          {/* <Grid size={{ xs: 12, sm: 12, md: 12, lg: 2, xl: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
            >
              Details
            </Typography>
          </Grid> */}

          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid
                container
                justifyContent="right"
                alignItems="center"
                spacing={1}
              >
                {/* <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4, xl: 2 }}>
                  <TextField
                    required
                    size="small"
                    fullWidth
                    id="name"
                    placeholder="Full Name"
                    variant="outlined"
                    sx={{ ...customeTextFeild }}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </Grid> */}

                <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4, xl: 2 }}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    size="small"
                    // sx={{ ...customeTextFeild }}
                    sx={{ ...customeTextFeild }}
                  >
                    <InputLabel id="demo-status-outlined-label">
                      Supplier
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-status-outlined-label"
                      id="demo-status-outlined"
                      label="Supplier"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                    >
                      <MenuItem value="None">None</MenuItem>
                      {supplierList?.map((item) => (
                        <MenuItem key={item?._id} value={item?._id}>
                          {item?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
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
                <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4, xl: 2 }}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{
                      ...customeTextFeild,
                    }}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Purchase Status
                    </InputLabel>

                    <Select
                      label="Purchase Status"
                      labelId="demo-simple-select-label"
                      id="purchaseStatus"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 250, // Set the max height here
                          },
                        },
                      }}
                      value={purchaseStatus}
                      onChange={(e) => setPurchaseStatus(e.target.value)}
                    >
                      <MenuItem value="None">None</MenuItem>
                      {purchaseStatusList?.map((item) => (
                        <MenuItem key={item?._id} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4, xl: 2 }}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{
                      ...customeTextFeild,
                    }}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Payment Status
                    </InputLabel>

                    <Select
                      required
                      label="Payment Status"
                      labelId="demo-simple-select-label"
                      id="paymentStatus"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 250, // Set the max height here
                          },
                        },
                      }}
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    >
                      <MenuItem value="None">None</MenuItem>
                      {paymentStatusList?.map((item) => (
                        <MenuItem key={item?._id} value={item}>
                          {item}
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
                      Device
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-status-outlined-label"
                      id="demo-status-outlined"
                      label="Device"
                      value={deviceId}
                      onChange={handleDeviceSelect}
                    >
                      <MenuItem value="None">None</MenuItem>
                      {deviceList?.map((item) => (
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
                      Model
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-status-outlined-label"
                      id="demo-status-outlined"
                      label="Model"
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

                {/* <Grid size={{ xs: 12, sm: 12, md: 4, lg: 3, xl: 2 }}>
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

                <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4, xl: 2 }}>
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
                    Supplier
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Branch</TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Purchase Status
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Payment status
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Payment Method
                  </TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Paid Amount
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Items Grand total
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Shipping Charge
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Purchase by
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Purchase Date
                  </TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>
                  {ifixit_admin_panel?.user?.permission?.includes(
                    "view_purchase_details"
                  ) && (
                    <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  tableDataList.length > 0 &&
                  tableDataList.map((row, i) => (
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
                        {row?.supplier_data[0]?.name
                          ? row?.supplier_data[0]?.name
                          : "---------"}
                        <br />
                        <Typography
                          color="text.light"
                          variant="medium"
                          sx={{ fontWeight: 500 }}
                        >
                          {row?.supplier_data[0]?.mobile
                            ? row?.supplier_data[0]?.mobile
                            : "---------"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ minWidth: "130px" }}>
                        {row?.branch_data[0]?.name
                          ? row?.branch_data[0]?.name
                          : "---------"}
                      </TableCell>

                      <TableCell>
                        {row?.purchase_status ? (
                          <Chip
                            sx={{
                              color:
                                row?.purchase_status === "Transit"
                                  ? "#7527DA"
                                  : row?.purchase_status === "Hold"
                                  ? "#C81E1E"
                                  : row?.purchase_status === "Received"
                                  ? "#046C4E"
                                  : "#222",
                              background:
                                row?.purchase_status === "Transit"
                                  ? "#F5F3FF"
                                  : row?.purchase_status === "Hold"
                                  ? "#FDF2F2"
                                  : row?.purchase_status === "Received"
                                  ? "#F3FAF7"
                                  : "#222",
                            }}
                            label={row?.purchase_status}
                          />
                        ) : (
                          "---------"
                        )}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {row?.paid_amount === 0 ? (
                          <Chip
                            sx={{
                              color: "#C81E1E",
                              background: "#FDF2F2",
                            }}
                            label="Not Paid"
                          />
                        ) : row.purchase_products_data
                            .reduce((total, item) => {
                              const itemTotal =
                                parseFloat(item?.quantity || 0) *
                                parseFloat(item?.unit_price || 0);
                              return total + itemTotal;
                            }, 0)
                            .toFixed(2) > row?.paid_amount ? (
                          <Chip
                            sx={{
                              color: "#7527DA",
                              background: "#F5F3FF",
                            }}
                            label="Partially Paid"
                          />
                        ) : (
                          <Chip
                            sx={{
                              color: "#046C4E",
                              background: "#F3FAF7",
                            }}
                            label="Paid"
                          />
                        )}
                      </TableCell>
                      {/* <TableCell>
                        {row?.payment_status ? (
                          <Chip
                            sx={{
                              color:
                                row?.payment_status === "Transit"
                                  ? "#7527DA"
                                  : row?.payment_status === "Hold"
                                  ? "#C81E1E"
                                  : row?.payment_status === "Paid"
                                  ? "#046C4E"
                                  : "#222",
                              background:
                                row?.payment_status === "Transit"
                                  ? "#F5F3FF"
                                  : row?.payment_status === "Hold"
                                  ? "#FDF2F2"
                                  : row?.payment_status === "Paid"
                                  ? "#F3FAF7"
                                  : "#222",
                            }}
                            label={row?.payment_status}
                          />
                        ) : (
                          "---------"
                        )}
                      </TableCell> */}

                      <TableCell>
                        {row?.payment_method
                          ? row?.payment_method
                          : "---------"}
                      </TableCell>

                      <TableCell>
                        {row?.paid_amount ? row?.paid_amount.toFixed(2) : 0}
                      </TableCell>
                      <TableCell>
                        {row?.purchase_products_data?.length > 0
                          ? row.purchase_products_data
                              .reduce((total, item) => {
                                const itemTotal =
                                  parseFloat(item?.quantity || 0) *
                                  parseFloat(item?.unit_price || 0);
                                return total + itemTotal;
                              }, 0)
                              .toFixed(2)
                          : "---------"}
                      </TableCell>

                      <TableCell>
                        {row?.shipping_charge
                          ? row?.shipping_charge.toFixed(2)
                          : "---------"}
                      </TableCell>

                      <TableCell sx={{ minWidth: "130px" }}>
                        {row?.user_data[0]?.name
                          ? row?.user_data[0]?.name
                          : "---------"}
                      </TableCell>
                      <TableCell sx={{ minWidth: "130px" }}>
                        {moment(row?.purchase_date).format("DD MMM, YYYY")}
                      </TableCell>

                      <TableCell sx={{ minWidth: "150px" }}>
                        {row?.remarks ? row?.remarks : "---------"}
                      </TableCell>
                      <TableCell>
                        {row?.status ? (
                          <>
                            <TaskAltOutlinedIcon
                              style={{
                                color: "#10ac84",
                                height: "16px",
                                position: "relative",
                                top: "4px",
                              }}
                            />{" "}
                            <span
                              style={{
                                color: "#10ac84",
                              }}
                            >
                              Active &nbsp;
                            </span>
                          </>
                        ) : (
                          <>
                            <HighlightOffOutlinedIcon
                              style={{
                                color: "#ee5253",
                                height: "16px",
                                position: "relative",
                                top: "4px",
                              }}
                            />
                            <span
                              style={{
                                color: "#ee5253",
                              }}
                            >
                              Inactive
                            </span>
                          </>
                        )}
                      </TableCell>

                      {/* <TableCell align="center" style={{ minWidth: "130px" }}>
                        <Invoice data={row} />
                      </TableCell> */}
                      {ifixit_admin_panel?.user?.permission?.includes(
                        "view_purchase_details"
                      ) && (
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            color="info"
                            startIcon={<ListAltOutlinedIcon />}
                            component={Link}
                            to={`/purchase/${row?._id}`}
                          >
                            Details
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}

                {!loading && tableDataList.length < 1 ? (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell colSpan={13} style={{ textAlign: "center" }}>
                      <strong> {message}</strong>
                    </TableCell>
                  </TableRow>
                ) : null}
                {loading && pageLoading()}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {tableDataList.length > 0 ? (
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
      <Dialog
        open={detailDialog}
        onClose={handleDetailClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        fullWidth={true}
      >
        {/* <div style={{ padding: "10px", minWidth: "300px" }}> */}
        {/* <DialogTitle id="alert-dialog-title">{"Product Detail"}</DialogTitle> */}
        <DialogContent>
          <Grid container style={{ borderBottom: "1px solid #154360" }}>
            <Grid size={6}>
              <p>User Details</p>
            </Grid>
            <Grid size={6} style={{ textAlign: "right" }}>
              <IconButton onClick={handleDetailClose}>
                <ClearIcon style={{ color: "#205295" }} />
              </IconButton>
            </Grid>
          </Grid>
          <br />
        </DialogContent>

        {/* </div> */}
      </Dialog>
      <Dialog
        open={imageDialog}
        onClose={handleImageClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
      >
        {/* <div style={{ padding: "10px", minWidth: "300px" }}> */}
        <DialogTitle id="alert-dialog-title">{"Images"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div style={{ display: "flex", gap: "10px" }}>
              {images.length > 0
                ? images.map((item) => (
                    <img
                      key={item.url}
                      src={item.url}
                      alt=""
                      width="220px"
                      height="220px"
                    />
                  ))
                : "No Image Available"}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImageClose}>Close</Button>
        </DialogActions>
        {/* </div> */}
      </Dialog>
    </>
  );
};

export default PurchaseList;
