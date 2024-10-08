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
import AddUser from "./AddUser";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const UserManagement = () => {
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
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [status, setStatus] = useState("");
  const [category, SetCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [filterList, setFilterList] = useState([]);
  const [startingTime, setStartingTime] = useState(null);
  const [endingTime, setEndingTime] = useState(null);

  const [addUserDialog, setAddUserDialog] = useState(false);
  const [images, setImages] = useState([]);
  const [detailDialog, setDetailDialog] = useState(false);
  const [details, setDetails] = useState([]);
  const [cancelProductData, setCancelProductData] = useState({});
  const [cancelProductDialog, setCancelProductDialog] = useState(false);
  const [cancelProductLoading, setCancelProductLoading] = useState(false);
  const componentRef = useRef();
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
  const handleCancelProductClickOpen = (obj) => {
    setCancelProductData(obj);
    setCancelProductDialog(true);
  };
  const handleCancelProductClose = () => {
    setCancelProductData({});
    setCancelProductDialog(false);
  };
  const handleImageClickOpen = (images) => {
    setImages(images);
    setAddUserDialog(true);
  };
  const handleImageClose = () => {
    setImages([]);
    setAddUserDialog(false);
  };

  const handleChange = (event) => {
    SetCategory(event.target.value);
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
  const handleDelete = async () => {
    try {
      setLoading2(true);
      let response = await axios({
        url: `/api/v1/user/delete/${deleteData.row._id}`,
        method: "delete",
      });
      if (response.status >= 200 && response.status < 300) {
        handleSnakbarOpen("Deleted successfully", "success");
        getData();
      }
      setDeleteDialog(false);
      setLoading2(false);
    } catch (error) {
      console.log("error", error);
      setLoading2(false);
      handleSnakbarOpen(error.response.data.message.toString(), "error");
      setDeleteDialog(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    console.log("newPage", newPage);
    getData(newPage);
    setPage(newPage);
  };

  const clearFilter = (event) => {
    console.log("clearFilter");
    setOrderID("");
    setName("");
    setDesignation("");
    setStatus("");
    setEmail("");
    setNumber("");
    SetCategory("");
    setMinPrice("");
    setMaxPrice("");
    setStartingTime(null);
    setEndingTime(null);
    setPage(0);
    const newUrl = `/api/v1/order?limit=${rowsPerPage}&page=1`;
    getData(0, rowsPerPage, newUrl);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log("event.target.value", event.target.value);
    setRowsPerPage(parseInt(event.target.value, rowsPerPage));
    getData(0, event.target.value);
    setPage(0);
  };

  const getData = async (pageNO, limit, newUrl) => {
    try {
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
        url = `/api/v1/user/dropdownlist`;
      }
      let allData = await getDataWithToken(url);

      if (allData.status >= 200 && allData.status < 300) {
        setTableDataList(allData?.data?.data);
        // setRowsPerPage(allData?.data?.limit);
        setTotalData(allData?.data?.totalData);

        if (allData.data.data.length < 1) {
          setMessage("No data found");
        }
      }
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      handleSnakbarOpen(error.response.data.message.toString(), "error");
    }
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
  useEffect(() => {
    getData();
    // getCategoryList();
  }, []);

  return (
    <>
      <Grid container columnSpacing={3} style={{ padding: "24px 0" }}>
        <Grid size={9}>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ color: "#0F1624", fontWeight: 600 }}
          >
            User Management
          </Typography>
        </Grid>
        <Grid size={3} style={{ textAlign: "right" }}>
          {/* <Button
            disableElevation
            variant="outlined"
            size="large"
            // startIcon={<FilterListIcon />}
            onClick={() => setOpen(!open)}
          >
            {open ? <FilterListOffIcon /> : <FilterListIcon />}
          </Button> */}

          <IconButton
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
          </IconButton>
        </Grid>
      </Grid>

      <Grid container>
        <Grid sx={{ width: "264px", pr: 6, boxSizing: "border-box" }}>
          {[...Array(7).keys()]?.map((item) => (
            <Box
              sx={{
                mb: 1,
                px: 1,
                py: 1.5,
                borderRadius: "12px",
                border: "1px solid #A5B5FC",
              }}
            >
              <Grid container alignItems="center">
                <Grid sx={{ width: "38px" }}>
                  <img
                    src={
                      item?.image?.url?.length > 0
                        ? item?.image?.url
                        : "/userpic.png"
                    }
                    alt=""
                    width="30px"
                    height="30px"
                    style={{
                      display: "block",
                      margin: "5px 0px",
                      borderRadius: "100px",
                      // border: "1px solid #d1d1d1",
                    }}
                  />
                </Grid>
                <Grid sx={{ flexGrow: 1 }}>
                  <Typography variant="medium" sx={{ fontWeight: 500 }}>
                    Wade Warren
                  </Typography>
                  <Typography variant="small" sx={{ color: "#475467" }}>
                    Manager
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Grid>
        <Grid sx={{ width: "calc(100% - 264px)" }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid #EAECF1",
              borderRadius: "12px",
              overflow: "hidden",
              padding: "20px 0",
              boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
            }}
          >
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 1.5, mb: 1.75 }}
            >
              <Grid size={6}>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
                >
                  User management settings
                </Typography>
              </Grid>
              <Grid size={6} sx={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  disableElevation
                  sx={{ py: 1.125, px: 2, borderRadius: "6px" }}
                  onClick={() => setAddUserDialog(true)}
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
                  Add User
                </Button>
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
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ whiteSpace: "nowrap" }} colSpan={2}>
                      Name
                    </TableCell>

                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Designation
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Email
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Mobile Number
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Status
                    </TableCell>

                    <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!loading &&
                    tableDataList.length > 0 &&
                    tableDataList.map((row, i) => (
                      <>
                        <TableRow
                          key={row?.user_id}
                          // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                          <TableCell sx={{ width: "30px", pr: 0 }}>
                            {/* {row?.image?.url?.length > 0 ? (
                          <> */}
                            <img
                              src={
                                row?.image?.url?.length > 0
                                  ? row?.image?.url
                                  : "/userpic.png"
                              }
                              alt=""
                              width="30px"
                              height="30px"
                              style={{
                                display: "block",
                                margin: "5px 0px",
                                borderRadius: "100px",
                                // border: "1px solid #d1d1d1",
                              }}
                            />

                            {/* </>
                        ) : (
                          "No Image"
                        )} */}
                          </TableCell>
                          <TableCell>{row?.name}</TableCell>
                          <TableCell>{row?.designation}</TableCell>
                          <TableCell>{row?.number}</TableCell>
                          <TableCell>{row?.email}</TableCell>

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
                          <TableCell align="right">
                            <IconButton
                              variant="contained"
                              // color="success"
                              disableElevation
                              component={Link}
                              to={`/update-category`}
                              state={{ row }}
                            >
                              {/* <EditOutlinedIcon /> */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="Outline"
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
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
                            </IconButton>

                            <IconButton
                              variant="contained"
                              disableElevation
                              onClick={() => handleDeleteDialog(i, row)}
                            >
                              {/* <DeleteOutlineIcon color="error" /> */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="Outline"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                              >
                                <path
                                  d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z"
                                  fill="#F91351"
                                />
                                <path
                                  d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z"
                                  fill="#F91351"
                                />
                                <path
                                  d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"
                                  fill="#F91351"
                                />
                              </svg>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </>
                    ))}

                  {!loading && tableDataList.length < 1 ? (
                    <TableRow>
                      <TableCell colSpan={15} style={{ textAlign: "center" }}>
                        <strong> {message}</strong>
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {loading && pageLoading()}
                </TableBody>
              </Table>
            </div>
            {tableDataList.length > 0 ? (
              <div>
                <TablePagination
                  style={{ display: "block", border: "none" }}
                  rowsPerPageOptions={[10, 20, 50]}
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
        </Grid>
      </Grid>
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
        open={addUserDialog}
        onClose={handleImageClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ width: "400px" }}>
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              fontSize: "20px",
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              color: "#0F1624",
              position: "relative",
              px: 2,
            }}
          >
            Add User
            <IconButton
              sx={{ position: "absolute", right: 0, top: 0 }}
              onClick={() => setAddUserDialog(false)}
            >
              <svg
                width="46"
                height="44"
                viewBox="0 0 46 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M29 16L17 28M17 16L29 28"
                  stroke="#656E81"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ px: 2 }}>
            <DialogContentText id="alert-dialog-description">
              <AddUser />
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 2 }}>
            <Button onClick={handleImageClose}>Close</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default UserManagement;