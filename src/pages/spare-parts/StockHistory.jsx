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
import {
  Box,
  Collapse,
  TableContainer,
  Card,
  CardContent,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const StockHistory = () => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [tableDataList, setTableDataList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sku_number, setSku_number] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [orderID, setOrderID] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const [status, setStatus] = useState("");
  const [category, SetCategory] = useState("");

  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [filterList, setFilterList] = useState([]);
  const [startingTime, setStartingTime] = useState(null);
  const [endingTime, setEndingTime] = useState(null);

  const [imageDialog, setImageDialog] = useState(false);
  const [images, setImages] = useState([]);
  const [brandId, setBrandId] = useState([]);
  const [categoryId, setCategoryId] = useState([]);
  const [deviceId, setDeviceId] = useState([]);
  const [modelId, setModelId] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [modelList, setModelList] = useState([]);

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

    let loadingNumber = 7;

    if (checkMultiplePermission(["update_service", "view_service_details"])) {
      loadingNumber = loadingNumber + 1;
    }
    for (let i = 0; i < 10; i++) {
      content.push(
        <TableRow key={i}>
          {[...Array(7).keys()].map((e, i) => (
            <TableCell key={i}>
              <Skeleton></Skeleton>
            </TableCell>
          ))}
        </TableRow>
      );
    }
    return content;
  };

  const clearFilter = (event) => {
    setSku_number("");
    setTableDataList([]);
    setMessage("");
  };

  const getData = async () => {
    if (sku_number.trim() === "") {
      handleSnakbarOpen("SKU number is required", "error");
      return;
    }
    setLoading(true);
    let newPageNO = page;
    let url;

    url = `/api/v1/stock/history?sku_number=${sku_number.trim()}`;

    let allData = await getDataWithToken(url);

    if (allData?.status === 401) {
      logout();
      return;
    }
    console.log("allData?.data?.data", allData?.data?.data);

    if (allData.status >= 200 && allData.status < 300) {
      // setRowsPerPage(allData?.data?.limit);

      if (allData.data.data.length > 0) {
        setTableDataList(allData?.data?.data);
      } else {
        setTableDataList([]);
        handleSnakbarOpen("No data found", "error");
      }
    } else {
      setLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading(false);
  };

  useEffect(() => {}, []);

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
            {/* Stock History */}
          </Typography>
        </Grid>
        <Grid size={6} style={{ textAlign: "right" }}></Grid>
      </Grid>
      <Card
        sx={{
          background: "#e8e8e8",
          border: "none",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "none",
          mb: 3,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: "#0F1624",
              fontWeight: 700,
              mb: 3,
              textAlign: "center",
            }}
          >
            Search Stock History
          </Typography>

          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid size={6} md={6} lg={4}>
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                // label="Enter SKU Number"
                placeholder="e.g., XXXXXXXXX"
                value={sku_number}
                onChange={(e) => setSku_number(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    getData();
                  }
                }}
                sx={{
                  // ...customeTextFeild,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#667eea",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 2, color: "#667eea" }}>
                      <SearchIcon
                        sx={{
                          fontSize: "32px",
                          position: "relative",
                          top: "5px",
                        }}
                      />
                    </Box>
                  ),
                }}
              />
            </Grid>

            <Grid size={12} md={6} lg={4}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={getData}
                  disabled={loading || sku_number.trim() === ""}
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "12px",
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0px 4px 16px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                      boxShadow: "0px 6px 20px rgba(102, 126, 234, 0.6)",
                    },
                    "&:disabled": {
                      background: "#e0e0e0",
                      color: "#9e9e9e",
                    },
                  }}
                  startIcon={
                    loading ? (
                      <PulseLoader size={8} color="white" />
                    ) : (
                      <SearchIcon />
                    )
                  }
                >
                  {loading ? "Searching..." : "Search Stock"}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={clearFilter}
                  sx={{
                    borderRadius: "12px",
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    borderColor: "#667eea",
                    color: "#667eea",
                    "&:hover": {
                      borderColor: "#5a6fd8",
                      backgroundColor: "rgba(102, 126, 234, 0.04)",
                    },
                  }}
                  startIcon={<RestartAltIcon />}
                >
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>

          {sku_number.trim() !== "" && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Searching for SKU: <strong>{sku_number}</strong>
              </Typography>
            </Box>
          )}
        </Box>
      </Card>

      {/* Stock Details and Repair History Section */}
      {!loading && tableDataList.length > 0 && tableDataList[0] && (
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ color: "#0F1624", fontWeight: 600, mb: 2 }}
          >
            Stock Details & Repair History
          </Typography>

          <Grid container spacing={3}>
            {/* Stock Information Card */}
            <Grid size={12} md={6}>
              <Card
                sx={{
                  p: 3,
                  height: "100%",
                  // background:
                  //   "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  background: "#fff",
                  color: "#0F1624",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Stock Information
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                    {tableDataList[0]?.product_data?.[0]?.name || "N/A"}
                  </Typography>
                  <Chip
                    label={
                      tableDataList[0]?.product_variation_data?.[0]?.name ||
                      "N/A"
                    }
                    size="small"
                    sx={{
                      mb: 2,
                    }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid size={6}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      SKU Number
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {tableDataList[0]?.sku_number || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Stock Status
                    </Typography>
                    <Chip
                      label={tableDataList[0]?.stock_status || "N/A"}
                      size="small"
                      color={
                        tableDataList[0]?.stock_status === "Attached"
                          ? "success"
                          : tableDataList[0]?.stock_status === "Available"
                          ? "success"
                          : tableDataList[0]?.stock_status === "Returned"
                          ? "info"
                          : tableDataList[0]?.stock_status === "Sold"
                          ? "secondary"
                          : tableDataList[0]?.stock_status === "Abnormal"
                          ? "error"
                          : "default"
                      }
                      variant="filled"
                      sx={{
                        mt: 0.5,
                      }}
                    />
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Branch
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {tableDataList[0]?.branch_data?.[0]?.name || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid size={6}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Warranty
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {tableDataList[0]?.product_data?.[0]?.warranty || "N/A"}{" "}
                      months
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Purchase Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {tableDataList[0]?.purchase_data?.[0]?.purchase_date
                        ? moment(
                            tableDataList[0].purchase_data[0].purchase_date
                          ).format("DD MMM, YYYY")
                        : "N/A"}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Repair History Card */}
            <Grid size={12} md={6}>
              <Card sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, mb: 2, color: "#0F1624" }}
                >
                  Repair History
                </Typography>

                {tableDataList[0]?.repair_attached_spareparts_data?.length >
                0 ? (
                  <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                    {tableDataList[0].repair_attached_spareparts_data.map(
                      (repair, repairIndex) => (
                        <Card
                          key={repairIndex}
                          sx={{
                            mb: 2,
                            p: 2,
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #e9ecef",
                            borderRadius: "8px",
                            borderLeft: "4px solid #667eea",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600 }}
                            >
                              {repair.warranty_id ? "Warranty ID" : "Repair ID"}
                              : {repair.warranty_id || repair.repair_id}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Chip
                                label={
                                  repair.warranty_id ? "Warranty" : "Repair"
                                }
                                size="small"
                                color={
                                  repair.warranty_id ? "warning" : "primary"
                                }
                                variant="outlined"
                              />
                              <Chip
                                label={repair.status ? "Active" : "Inactive"}
                                size="small"
                                color={repair.status ? "success" : "default"}
                              />
                            </Box>
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "text.secondary" }}
                          >
                            <strong>Attached:</strong>{" "}
                            {moment(repair.created_at).format(
                              "DD MMM, YYYY HH:mm A"
                            )}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: "text.secondary" }}
                          >
                            <strong>Created by:</strong> {repair.created_by}
                          </Typography>

                          {repair.warranty_id &&
                            repair.claimed_on_sku_number && (
                              <Typography
                                variant="body2"
                                sx={{ mb: 1, color: "text.secondary" }}
                              >
                                <strong>Claimed on SKU:</strong>{" "}
                                {repair.claimed_on_sku_number}
                              </Typography>
                            )}

                          {repair.is_warranty_claimed_sku && (
                            <Chip
                              label="Warranty Claimed"
                              size="small"
                              color="warning"
                              sx={{ mt: 1 }}
                            />
                          )}
                        </Card>
                      )
                    )}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No repair history found for this item
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default StockHistory;
