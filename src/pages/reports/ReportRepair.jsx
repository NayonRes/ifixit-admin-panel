import React, { useState, useEffect, useContext } from "react";
import { getDataWithToken } from "../../services/GetDataService";
import { AuthContext } from "../../context/AuthContext";

import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import { Link, useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Box, Collapse } from "@mui/material";
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
import ClearIcon from "@mui/icons-material/Clear";
import { designationList, roleList } from "../../data";
import ReportRepairList from "./ReportRepairList";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const ReportRepair = ({ created_by }) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tableDataList, setTableDataList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [orderID, setOrderID] = useState("");
  const [repairNo, setRepairNo] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [status, setStatus] = useState("");
  const [category, SetCategory] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [startingTime, setStartingTime] = useState(dayjs());
  const [endingTime, setEndingTime] = useState(null);

  const [imageDialog, setImageDialog] = useState(false);
  const [images, setImages] = useState([]);
  const [detailDialog, setDetailDialog] = useState(false);
  const [details, setDetails] = useState([]);
  const [cancelProductData, setCancelProductData] = useState({});
  const [cancelProductDialog, setCancelProductDialog] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [modelList, setModelList] = useState();
  const [modelId, setModelId] = useState("");
  const [branch, setBranch] = useState("");
  const handleDetailClickOpen = (obj) => {
    console.log("obj", obj);
    setDetails(obj);
    setDetailDialog(true);
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
    let loadingNumber = 8;

    if (ifixit_admin_panel?.user?.permission?.includes("update_repair")) {
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

  const clearFilter = (event) => {
    console.log("clearFilter");
    setOrderID("");
    setRepairNo("");
    setNumber("");
    setModelId("");
    setBranch("");
    setStatus("");
    SetCategory("");
    setStartingTime(null);
    setEndingTime(null);
    setPage(0);
    const newUrl = `/api/v1/repair?limit=${rowsPerPage}&page=1`;
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
      let newBranch = branch;
      let newStatus = status;
      let newMinPrice = minPrice;
      let newMaxPrice = maxPrice;
      let newStartingTime = "";
      let newEndingTime = "";
      if (branch === "None") {
        newBranch = "";
      }
      if (status === "None") {
        newStatus = "";
      }
      if (minPrice === null) {
        newMinPrice = "";
      }
      if (maxPrice === null) {
        newMaxPrice = "";
      }
      if (startingTime !== null) {
        newStartingTime = dayjs(startingTime).format("YYYY-MM-DD");
      }
      if (endingTime !== null) {
        newEndingTime = dayjs(endingTime).format("YYYY-MM-DD");
      }

      url = `/api/v1/repair?repair_id=${repairNo.trim()}&created_by=${created_by}&customerNo=${number}&branch_id=${newBranch}&startDate=${newStartingTime}&endDate=${newEndingTime}&status=${newStatus}&limit=${newLimit}&page=${
        newPageNO + 1
      }`;
    }
    let allData = await getDataWithToken(url);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData?.status >= 200 && allData?.status < 300) {
      setTableDataList(allData?.data?.data);
      // setRowsPerPage(allData?.data?.limit);
      setTotalData(allData?.data?.totalData);

      if (allData?.data?.data.length < 1) {
        setMessage("No data found");
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
    <>
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
          <Grid size={2}>
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
            >
              Details
            </Typography>
          </Grid>
          <Grid size={10}>
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
                    label="Job / Invoice No"
                    value={repairNo}
                    onChange={(e) => setRepairNo(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2.4, xl: 2 }}>
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
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4, lg: 3, xl: 2 }}>
                  <TextField
                    sx={{ ...customeTextFeild }}
                    id="number"
                    fullWidth
                    size="small"
                    variant="outlined"
                    label="number"
                    inputProps={{ maxLength: 11 }}
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
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
        <ReportRepairList
          loading={loading}
          pageLoading={pageLoading}
          tableDataList={tableDataList}
          clearFilter={clearFilter}
          handleDeleteDialog={handleDeleteDialog}
          message={message}
          totalData={totalData}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
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

export default ReportRepair;
