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
import { designationList, roleList } from "../../data";
// import AddSpareParts from "./AddSpareParts";
// import UpdateSpareParts from "./UpdateSpareParts";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import AddServiceFAQ from "../service-faq/AddServiceFAQ";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ServiceList = () => {
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
  const [type, setType] = useState("");
  const [remarks, setRemarks] = useState("");
  const [rating, setRating] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
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
  const checkMultiplePermission = (permissionNames) => {
    return permissionNames.some((item) =>
      ifixit_admin_panel?.user?.permission.includes(item)
    );
  };
  const pageLoading = () => {
    let content = [];

    let loadingNumber = 8;

    if (checkMultiplePermission(["update_service", "view_service_details"])) {
      loadingNumber = loadingNumber + 1;
    }
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

  const handleChangePage = (event, newPage) => {
    console.log("newPage", newPage);
    getData(newPage);
    setPage(newPage);
  };
  const handleDeviceSelect = (e) => {
    setDeviceId(e.target.value);
    setModelId("");
    getModelList(e.target.value);
  };
  const clearFilter = (event) => {
    setName("");
    setNumber("");
    setBrandId("");
    setCategoryId("");
    setDeviceId("");
    setModelId("");
    setStatus("");

    setPage(0);
    const newUrl = `/api/v1/service?limit=${rowsPerPage}&page=1`;
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
      let newCategoryId = categoryId;
      let newBrandId = brandId;
      let newModelId = modelId;
      let newDeviceId = deviceId;

      let newStartingTime = "";
      let newEndingTime = "";
      if (status === "None") {
        newStatus = "";
      }
      if (categoryId === "None") {
        newCategoryId = "";
      }
      if (brandId === "None") {
        newBrandId = "";
      }
      if (modelId === "None") {
        newModelId = "";
      }
      if (deviceId === "None") {
        newDeviceId = "";
      }

      if (startingTime !== null) {
        newStartingTime = dayjs(startingTime).format("YYYY-MM-DD");
      }
      if (endingTime !== null) {
        newEndingTime = dayjs(endingTime).format("YYYY-MM-DD");
      }

      url = `/api/v1/service?name=${name.trim()}&category_id=${newCategoryId}&brand_id=${newBrandId}&device_id=${newDeviceId}&model_id=${newModelId}&startDate=${newStartingTime}&endDate=${newEndingTime}&status=${newStatus}&limit=${newLimit}&page=${
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

  const sortByParentName = (a, b) => {
    const nameA = a.parent_name.toUpperCase();
    const nameB = b.parent_name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  };

  const getBrandList = async () => {
    setLoading2(true);

    let url = `/api/v1/brand/dropdownlist`;
    let allData = await getDataWithToken(url);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setBrandList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };

  const getCategoryList = async () => {
    setLoading2(true);

    let url = `/api/v1/category/dropdownlist`;
    let allData = await getDataWithToken(url);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setCategoryList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };
  const getDeviceList = async () => {
    setLoading2(true);

    let url = `/api/v1/device/dropdownlist`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data", allData?.data?.data);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setDeviceList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };
  const getModelList = async (id) => {
    setLoading2(true);

    let url = `/api/v1/model/device-model?deviceId=${id}`;
    let allData = await getDataWithToken(url);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setModelList(allData?.data?.data);

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
    getCategoryList();
    getDeviceList();
    getBrandList();
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
            Service List
          </Typography>
        </Grid>
        <Grid size={6} style={{ textAlign: "right" }}>
          {ifixit_admin_panel?.user?.permission?.includes("service_list") && (
            <Button
              variant="contained"
              disableElevation
              sx={{ py: 1.125, px: 2, borderRadius: "6px" }}
              component={Link}
              to="/add-service"
              // onClick={() => {
              //   setAddDialog(true);
              //   getCategoryList();
              //   getBrandList();
              //   getDeviceList();
              // }}
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
              Add Service
            </Button>
          )}
          {/* <AddSpareParts clearFilter={clearFilter} /> */}

          {/* <IconButton
            onClick={() => setOpen(!open)}
            // size="large"
            aria-label="show 5 new notifications"
            color="inherit"
          >
            <Badge badgeContent={5} color="error">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.3807 14.2348C13.9595 14.0475 15.4819 13.6763 16.9259 13.1432C15.7286 11.8142 14.9998 10.0547 14.9998 8.125V7.54099C14.9999 7.52734 15 7.51368 15 7.5C15 4.73858 12.7614 2.5 10 2.5C7.23858 2.5 5 4.73858 5 7.5L4.99984 8.125C4.99984 10.0547 4.27106 11.8142 3.07373 13.1432C4.51784 13.6763 6.04036 14.0475 7.61928 14.2348M12.3807 14.2348C11.6 14.3274 10.8055 14.375 9.99984 14.375C9.19431 14.375 8.3999 14.3274 7.61928 14.2348M12.3807 14.2348C12.4582 14.4759 12.5 14.7331 12.5 15C12.5 16.3807 11.3807 17.5 10 17.5C8.61929 17.5 7.5 16.3807 7.5 15C7.5 14.7331 7.54183 14.476 7.61928 14.2348"
                  stroke="#656E81"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Badge>
          </IconButton> */}
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
                      Device
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-status-outlined-label"
                      id="demo-status-outlined"
                      label="Device"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 250, // Set the max height here
                          },
                        },
                      }}
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
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4, xl: 2 }}>
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
                            maxHeight: 250, // Set the max height here
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
                </Grid>
                {/* <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4, xl: 2 }}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    size="small"
                    // sx={{ ...customeTextFeild }}
                    sx={{ ...customeTextFeild }}
                  >
                    <InputLabel id="demo-status-outlined-label">
                      Category
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-status-outlined-label"
                      id="demo-status-outlined"
                      label="Category"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 250, // Set the max height here
                          },
                        },
                      }}
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <MenuItem value="None">None</MenuItem>
                      {categoryList?.map((item) => (
                        <MenuItem key={item?._id} value={item?._id}>
                          {item?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                      Brand
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-status-outlined-label"
                      id="demo-status-outlined"
                      label="Brand"
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                    >
                      <MenuItem value="None">None</MenuItem>
                      {brandList?.map((item) => (
                        <MenuItem key={item?._id} value={item?._id}>
                          {item?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

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
                  <TableCell style={{ maxWidth: "220px" }}>Title</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Order No
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Brand</TableCell>

                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                    Category
                  </TableCell> */}
                  <TableCell style={{ whiteSpace: "nowrap" }}>Device</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Model</TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Branch Name
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Available Service no
                  </TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>
                  {checkMultiplePermission([
                    "update_service",
                    "view_service_details",
                  ]) && (
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

                      <TableCell>{row?.title}</TableCell>
                      <TableCell>{row?.order_no}</TableCell>
                      <TableCell>
                        {row?.brand_data[0]?.name
                          ? row?.brand_data[0]?.name
                          : "---------"}
                      </TableCell>

                      {/* <TableCell>
                        {row?.category_data[0]?.name
                          ? row?.category_data[0]?.name
                          : "---------"}
                      </TableCell> */}
                      <TableCell>
                        {row?.device_data[0]?.name
                          ? row?.device_data[0]?.name
                          : "---------"}
                      </TableCell>
                      <TableCell>
                        {row?.model_data[0]?.name
                          ? row?.model_data[0]?.name
                          : "---------"}
                      </TableCell>

                      <TableCell
                        sx={{ minWidth: "130px", whiteSpace: "norap" }}
                      >
                        {row?.branch_data?.length > 0 &&
                          row?.branch_data?.map((item, i) => (
                            <span>
                              {item?.name}{" "}
                              {row?.branch_data?.length !== i + 1 && ", "}
                            </span>
                          ))}
                        {/* {row?.name} */}
                      </TableCell>

                      <TableCell>{row?.repair_info?.length}</TableCell>

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

                      {checkMultiplePermission([
                        "update_service",
                        // "view_service_details",
                      ]) && (
                        <TableCell align="right">
                          {/* {ifixit_admin_panel?.user?.permission?.includes(
                            "view_service_details"
                          ) && (
                            <>
                              <Button
                                size="small"
                                variant="outlined"
                                color="info"
                                startIcon={<ListAltOutlinedIcon />}
                                component={Link}
                                to={`/service/details/${row?._id}`}
                              >
                                Details
                              </Button>
                              &nbsp;&nbsp;
                            </>
                          )} */}

                          {ifixit_admin_panel?.user?.permission?.includes(
                            "update_service"
                          ) && (
                            <>
                              <AddServiceFAQ serviceId={row?._id} />
                              &nbsp;&nbsp;
                              <Button
                                size="small"
                                variant="outlined"
                                color="text"
                                startIcon={<ListAltOutlinedIcon />}
                                component={Link}
                                to={`/service/update/${row?._id}`}
                              >
                                Update
                              </Button>
                            </>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}

                {!loading && tableDataList.length < 1 ? (
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

export default ServiceList;
