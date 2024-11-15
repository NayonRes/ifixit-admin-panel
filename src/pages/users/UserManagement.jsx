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
  const { enqueueSnackbar } = useSnackbar();
  const [userList, setUserList] = useState([]);
  const [userData, setUserData] = useState();
  const [name, setName] = useState("");
  const [permissionList, setPermissionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [loading2, setLoading2] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    console.log("2222222222222222222222", event.target.id);

    setChecked(event.target.checked);
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

  const getPermissionData = async (pageNO, limit, newUrl) => {
    try {
      setLoading(true);
      let url = `/api/v1/permission`;
      let allData = await getDataWithToken(url);

      if (allData.status >= 200 && allData.status < 300) {
        transformPermissionData(allData?.data?.data);

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

  const transformPermissionData = (permissions) => {
    const groupedData = permissions.reduce((acc, permissionsItem) => {
      const { module_name } = permissionsItem;

      // Find the module group in the accumulator
      let moduleGroup = acc.find((group) => group.module === module_name);

      // If not found, create a new group
      if (!moduleGroup) {
        moduleGroup = { module: module_name, permissions: [] }; // Changed to 'permissions'
        acc.push(moduleGroup);
      }

      // Add the permission to the group
      moduleGroup.permissions.push(permissionsItem); // Changed to 'permissions'

      return acc;
    }, []);
    console.log("groupedData", groupedData);

    setPermissionList(groupedData);
  };

  const handlePermission = (name) => {
    console.log("name", name);

    if (selectedPermissions?.includes(name)) {
      setSelectedPermissions(
        selectedPermissions.filter((permission) => permission !== name)
      );
      return;
    }
    setSelectedPermissions([...selectedPermissions, name]);
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

  const getDropdownList = async () => {
    setLoading2(true);

    let url = `/api/v1/user/dropdownlist`;
    let allData = await getDataWithToken(url);

    if (allData.status >= 200 && allData.status < 300) {
      setUserList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    }
    setLoading2(false);
  };

  useEffect(() => {
    getPermissionData();
    getDropdownList();
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
            {!loading2 &&
              userList?.length > 0 &&
              userList?.map((item, i) => (
                <Box
                  sx={{
                    mb: 1,
                    px: 1,
                    py: 1.5,
                    borderRadius: "12px",
                    cursor: "pointer",
                    border: item?._id === userData?._id && "1px solid #A5B5FC",
                    background: item?._id === userData?._id && "#fff",
                    boxShadow:
                      item?._id === userData?._id &&
                      "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
                  }}
                  onClick={() => setUserData(item)}
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
                        {item?.name}
                      </Typography>
                      <Typography variant="small" sx={{ color: "#475467" }}>
                        {item?.designation}
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
                  onClick={() => {
                    console.log("selectedPermissions", selectedPermissions);
                  }}
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
                        {row?.module}
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
                                checked={
                                  selectedPermissions?.includes(
                                    permission?.permission_name
                                  )
                                    ? true
                                    : false
                                }
                                onChange={() => {
                                  handlePermission(permission?.permission_name);
                                }}
                              />
                            }
                            label={permission?.name}
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
    </>
  );
};

export default UserManagement;
