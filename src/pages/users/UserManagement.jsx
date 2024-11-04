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

import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 36,
  height: 20,
  padding: 0,

  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#2ECA45",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 16,
    height: 16,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));

const UserManagement = () => {
  const [permissionList, setPermissionList] = useState([]);
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

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    console.log("2222222222222222222222", event.target.id);

    setChecked(event.target.checked);
  };
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
        // <TableRow key={i}>
        //   {[...Array(7).keys()].map((e, i) => (
        //     <TableCell key={i}>
        //       <Skeleton></Skeleton>
        //     </TableCell>
        //   ))}
        // </TableRow>

        <Grid
          container
          sx={{
            borderBottom: "1px solid #EAECF1",
            borderTop: i === 0 && "1px solid #EAECF1",
            py: 2,
          }}
        >
          <Grid size={6}>
            <Skeleton width={170}></Skeleton>
            <Skeleton width={250}></Skeleton>
          </Grid>
          <Grid size={6}>
            {/* loop */}
            <Skeleton width={320} sx={{ mb: 1.5 }}></Skeleton>
            <Skeleton width={320} sx={{ mb: 1.5 }}></Skeleton>
            <Skeleton width={320} sx={{ mb: 1.5 }}></Skeleton>
            <Skeleton width={320} sx={{ mb: 1.5 }}></Skeleton>
          </Grid>
        </Grid>
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
  const getPermissionData = async (pageNO, limit, newUrl) => {
    try {
      setLoading(true);
      let url = `/api/v1/permission`;
      let allData = await getDataWithToken(url);

      if (allData.status >= 200 && allData.status < 300) {
        setPermissionList(allData?.data?.data);
        // setRowsPerPage(allData?.data?.limit);
        // setTotalData(allData?.data?.totalData);

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

  function toTitleCase(str) {
    return str
      .split("-") // Split by hyphen
      .map(
        (
          word // Capitalize each word
        ) => word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" "); // Join with a space
  }
  useEffect(() => {
    getPermissionData();
    // getData();
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
        <Grid
          sx={{
            width: "264px",
            pr: 6,
            boxSizing: "border-box",
          }}
        >
          <TextField
            required
            size="small"
            fullWidth
            id="name"
            placeholder="Search User"
            variant="outlined"
            sx={{ ...customeTextFeild, background: "#fff", mb: 2 }}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Box
            sx={{ maxHeight: "Calc(100vh - 150px)", overflowY: "auto", pr: 1 }}
          >
            {[...Array(15).keys()]?.map((item, i) => (
              <Box
                sx={{
                  mb: 1,
                  px: 1,
                  py: 1.5,
                  borderRadius: "12px",
                  border: i === 0 && "1px solid #A5B5FC",
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
          </Box>
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
              sx={{ px: 2.5, mb: 1.75 }}
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
                <AddUser />
              </Grid>
            </Grid>

            <Box
              sx={{
                px: 2.5,
                maxHeight: "Calc(100vh - 200px)",
                overflowY: "auto",
              }}
            >
              {!loading &&
                permissionList.length > 0 &&
                permissionList.map((row, i) => (
                  <Grid
                    container
                    sx={{
                      borderBottom: "1px solid #EAECF1",
                      borderTop: i === 0 && "1px solid #EAECF1",
                      py: 2,
                    }}
                  >
                    <Grid size={6}>
                      <Typography variant="medium" sx={{ fontWeight: 600 }}>
                        {toTitleCase(row?.module_name)}
                      </Typography>
                      <FormGroup
                        sx={{
                          "& .MuiTypography-root": {
                            fontSize: "14px !important",
                            fontWeight: "500 !important",
                          },
                        }}
                      >
                        <FormControlLabel
                          control={
                            <IOSSwitch
                              sx={{
                                m: 1,
                              }}
                              id="555555"
                              checked={checked}
                              onChange={handleChange}
                            />
                          }
                          label={"All"}
                        />
                      </FormGroup>
                    </Grid>
                    <Grid size={6}>
                      {row?.permissions?.map((permission) => (
                        <FormGroup
                          sx={{
                            "& .MuiTypography-root": {
                              fontSize: "14px !important",
                              fontWeight: "500 !important",
                            },
                            mb: 1.5,
                          }}
                        >
                          <FormControlLabel
                            control={
                              <IOSSwitch
                                sx={{
                                  m: 1,
                                }}
                                id="555555"
                                checked={checked}
                                onChange={handleChange}
                              />
                            }
                            label={toTitleCase(permission?.name)}
                          />
                        </FormGroup>
                      ))}
                    </Grid>
                  </Grid>
                ))}
              {loading && pageLoading()}
            </Box>
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
    </>
  );
};

export default UserManagement;
