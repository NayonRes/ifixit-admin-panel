import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Container,
  FormControl,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Box,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import ColumnChart from "../../components/charts/ColumnChart";
import AreaChart from "../../components/charts/AreaChart";
import MenuIcon from "../../components/icons/MenuIcon";
import VerifyIcon from "../../components/icons/VerifyIcon";
import SecurityIcon from "../../components/icons/SecurityIcon";
import ListIcon2 from "../../components/icons/ListIcon2";
import MoneyIcon from "../../components/icons/MoneyIcon";
import UncompletedIcon from "../../components/icons/UncompletedIcon";
import FailedIcon from "../../components/icons/FailedIcon";
import FolderIcon from "../../components/icons/FolderIcon";
import DownloadIcon from "../../components/icons/DownloadIcon";
import MessageIcon from "../../components/icons/MessageIcon";
import MoonIcon from "../../components/icons/MoonIcon";
import { AuthContext } from "../../context/AuthContext";
import { getDataWithToken } from "../../services/GetDataService";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import jwt_decode from "jwt-decode";
import Chart from "react-apexcharts";
import moment from "moment";
import CountUp from "react-countup";
// import makeStyles from "@mui/styles/makeStyles";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { PulseLoader, SyncLoader } from "react-spinners";
import { useSnackbar } from "notistack";

// import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// const useStyles = makeStyles((theme) => ({
//   chartContainer: {
//     "& text": {
//       fill: theme.palette.text.light,
//     },
//     "& .apexcharts-title": {
//       fill: theme.palette.text.light,
//     },
//   },
// }));
const Dashboard = ({ toggleTheme }) => {
  const theme = useTheme();
  // const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [storeListMessage, setStoreListMessage] = useState("");
  const [storeListLoading, setStoreListLoading] = useState(false);
  const [storeList, setStoreList] = useState([]);
  const [progress, setProgress] = useState(50);
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryList, setSummaryList] = useState([]);
  const [summaryMessage, setSummaryMessage] = useState("");
  const [storeDetailLoading, setStoreDetailLoading] = useState(false);
  const [storeDetails, setStoreDetails] = useState({});
  const [storeDetailMessage, setStoreDetailMessage] = useState("");
  const [totalSummary, setTotalSummary] = useState(0);
  const [totalVerified, setTotalVerified] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [display, setDisplay] = useState(false);
  const [months, setMonths] = React.useState(12);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [stats, setStats] = useState({});
  const [branchId, setBranchId] = useState("");
  const [message, setMessage] = useState("");
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
  const handleChange = (event) => {
    setMonths(event.target.value);
    getSummaryOfaStore(event.target.value);
  };
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "",
        data: [],
      },
      // {
      //   name: "Revenue",
      //   data: [76, 85, 101, 98, 87, 105, 91],
      // },
      //   {
      //     name: "Free Cash Flow",
      //     data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      //   },
    ],
    options: {
      chart: {
        fontFamily: '"Roboto",sans-serif',

        toolbar: {
          show: false, //download button hide
        },
        type: "bar",
        // height: 350,
      },
      legend: {
        show: false,
        // labels: {
        //   colors: ['red', 'blue', 'green', 'purple'], // Change the legend text colors here
        // },
        // container: {
        //   background: ['blue','blue'], // Change the legend box background color here
        // },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "35%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      //   stroke: {
      //     show: true,
      //     width: 2,
      //     colors: ["transparent"],
      //   },
      // xaxis: {
      //   labels: {
      //     style: {
      //       colors: "red", // Change the x-axis label color here
      //     },
      //   },
      //   categories: [],
      // },
      yaxis: {
        labels: {
          style: {
            colors: theme.palette.text.light, // Change the x-axis label color here
          },
        },
        title: {
          // text: "   ",
          text: "Attempted vs Verified",
          style: {
            colors: theme.palette.text.light, // Change the x-axis label color here
          },
        },
      },
      fill: {
        opacity: 1,
        colors: [theme.palette.primary.main, theme.palette.success.main],
      },
      tooltip: {
        theme: "dark",
        // theme: theme.palette.mode === "dark" ? "dark" : "light",
        // fillSeriesColor: true,

        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
    minHeight: 250,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => (prevProgress >= 50 ? 10 : prevProgress + 10));
  //   }, 800);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);
  const pageLoading = () => {
    let content = [];

    for (let i = 0; i < 6; i++) {
      content.push(
        <TableRow key={i}>
          <TableCell>
            <Skeleton></Skeleton>
          </TableCell>
          <TableCell>
            <Skeleton></Skeleton>
          </TableCell>
          <TableCell>
            <Skeleton></Skeleton>
          </TableCell>
          <TableCell>
            <Skeleton></Skeleton>
          </TableCell>
          <TableCell>
            <Skeleton></Skeleton>
          </TableCell>
        </TableRow>
      );
    }
    return content;
  };

  const getSummaryOfaStore = async (month) => {
    setSummaryLoading(true);
    let newMonth = months;
    if (month) {
      newMonth = month;
    }
    let storesSummary = await getDataWithToken(
      `getSummary?storeId=${111}&numberOfMonth=${newMonth}`,
      ifixit_admin_panel,
      logout
    );

    if (storesSummary?.data?.code === 200) {
      let names = [];
      let data1 = [];
      let data2 = [];
      let years = [];
      let newTotalSummary = 0;
      let newTotalVerified = 0;
      if (storesSummary.data.data.summary.length > 0) {
        storesSummary.data.data.summary.map((item) => {
          newTotalSummary = newTotalSummary + parseInt(item.totalSummary);
          newTotalVerified = newTotalVerified + parseInt(item.totalVerified);
          names.push(item.month + " " + item.year);
          years.push(item.year);
          data1.push(item.totalSummary);
          data2.push(item.totalVerified);
        });
      }
      console.log("data1", data1);
      console.log("names ===========================================", names);
      setSummaryList(storesSummary.data.data.summary);
      setTotalSummary(newTotalSummary);
      setTotalVerified(newTotalVerified);
      setChartData({
        ...chartData,
        series: [
          {
            name: "Total Applied",
            data: data1,
          },
          {
            name: "Total Verified",
            data: data2,
          },
        ],
        options: {
          ...chartData.options,
          xaxis: {
            categories: names,
          },
        },
      });
    } else {
      setSummaryMessage(storesSummary.data.message.toString());
    }
    setDisplay(true);
    setSummaryLoading(false);
  };
  const getStoreDetails = async () => {
    setStoreDetailLoading(true);

    let storeData = await getDataWithToken(
      `getStoreInformation?storeId=${111}`,
      ifixit_admin_panel,
      logout
    );

    if (storeData?.data?.code === 200) {
      setStoreDetails(storeData.data.data.storeDetails);
    } else {
      setStoreDetailMessage(storeData.data.message.toString());
    }
    setStoreDetailLoading(false);
  };
  const getStats = async () => {
    if (ifixit_admin_panel.token) {
      setLoading(true);
      let url = `/api/v1/dashboard/stats`;
      let statsData = await getDataWithToken(url);

      if (statsData?.status === 401) {
        logout();
        return;
      }
      if (statsData.status >= 200 && statsData.status < 300) {
        setStats(statsData?.data?.data);
      } else {
        setLoading(false);
        handleSnakbarOpen(statsData?.data?.message, "error");
      }
      setLoading(false);
    }
  };

  const boxStyle = {
    background: "#fff",
    border: "1px solid #EAECF1",
    borderRadius: "12px",
    overflow: "hidden",
    padding: "16px 0",
    boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
  };
  const boxStyle2 = {
    background: "#fff",
    border: "1px solid #EAECF1",
    borderRadius: "12px",
    overflow: "hidden",
    padding: "16px 28px",
    boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
    minWidth: "200px",
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
  useEffect(() => {
    getStats();
    getBranchList();
    // getSummaryOfaStore();
    // getStoreDetails();

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    // setTimeout(() => setDisplay(true), 5);
  }, []);
  return (
    <>
      {/* <ColumnChart /> */}
      {/* {display && (
        <div id="chart">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={215}
          />
        </div>
      )} */}
      <Grid container alignItems="center" spacing={3} sx={{ mb: 3 }}>
        <Grid size={12}>
          <Box
            sx={{
              ...boxStyle,
            }}
          >
            {" "}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1.125, px: 3 }}
            >
              <Grid size="auto">
                <Typography
                  variant="base"
                  color="text.main"
                  sx={{ fontWeight: 500 }}
                >
                  Summary
                </Typography>
              </Grid>
              <Grid size="auto">
                <Typography
                  variant="medium"
                  color="text.main"
                  sx={{ fontWeight: 400 }}
                >
                  Updated 1 month ago
                </Typography>
                <FormControl
                  fullWidth
                  size="small"
                  sx={{
                    // ...customeSelectFeild,
                    "& label.Mui-focused": {
                      color: "rgba(0,0,0,0)",
                    },
                    "& .MuiOutlinedInput-input.Mui-disabled": {
                      color: "#343E54", // Customize the text color when disabled
                      WebkitTextFillColor: "#343E54", // Apply the Webkit text fill color
                    },
                    "& .MuiOutlinedInput-input img": {
                      position: "relative",
                      top: "2px",
                    },
                  }}
                >
                  {branchId.length < 1 && (
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{ color: "#b3b3b3", fontWeight: 300 }}
                    >
                      Select Transfer From
                    </InputLabel>
                  )}
                  <Select
                    required
                    labelId="demo-simple-select-label"
                    id="type"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 250, // Set the max height here
                        },
                      },
                    }}
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                  >
                    {branchList?.map((item) => (
                      <MenuItem key={item?._id} value={item?._id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Divider />
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ mt: 2.5, px: 3 }}
            >
              <Grid
                size="auto"
                sx={{
                  ...boxStyle2,
                }}
              >
                {" "}
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: `#DCFAE6`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                  >
                    <path
                      d="M15.0715 6C15.0723 6.74838 14.8864 7.48514 14.5306 8.14357C14.1749 8.80199 13.6606 9.3613 13.0342 9.77086C12.4078 10.1804 11.6892 10.4273 10.9434 10.4891C10.1975 10.551 9.44807 10.4258 8.7628 10.125L5.50905 13.8887C5.50155 13.8975 5.4928 13.9069 5.48467 13.915C5.10956 14.2901 4.60079 14.5009 4.0703 14.5009C3.5398 14.5009 3.03104 14.2901 2.65592 13.915C2.28081 13.5399 2.07007 13.0311 2.07007 12.5006C2.07007 11.9701 2.28081 11.4614 2.65592 11.0862C2.66467 11.0781 2.67342 11.0694 2.6828 11.0619L6.44655 7.80875C6.10934 7.03738 5.99505 6.18694 6.11664 5.35392C6.23823 4.52089 6.59084 3.73861 7.13446 3.09581C7.67809 2.45301 8.39098 1.97542 9.19226 1.71721C9.99354 1.45901 10.8511 1.43053 11.6678 1.635C11.752 1.6561 11.8292 1.69875 11.8919 1.75875C11.9546 1.81875 12.0006 1.89405 12.0254 1.97722C12.0502 2.0604 12.0529 2.14859 12.0333 2.23313C12.0136 2.31767 11.9723 2.39564 11.9134 2.45937L9.57155 5L9.9253 6.64687L11.5715 7L14.1122 4.655C14.1759 4.59609 14.2539 4.55479 14.3384 4.53515C14.423 4.51551 14.5111 4.51822 14.5943 4.543C14.6775 4.56778 14.7528 4.61379 14.8128 4.67649C14.8728 4.73919 14.9154 4.81644 14.9365 4.90062C15.0263 5.26019 15.0716 5.6294 15.0715 6Z"
                      fill="#079455"
                    />
                  </svg>
                </Avatar>
                <Typography
                  variant="base"
                  color="text.light"
                  sx={{ fontWeight: 500, mt: 1 }}
                >
                  Total Repair
                </Typography>
                <Typography
                  variant="h4"
                  color="text.main"
                  sx={{ fontWeight: 500, margin: "0px" }}
                >
                  $
                  <CountUp
                    end={storeDetails?.totalPending}
                    duration={2}
                    decimals={2}
                  />
                </Typography>
              </Grid>
              <Grid
                size="auto"
                sx={{
                  ...boxStyle2,
                }}
              >
                {" "}
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: `#DCFAE6`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                  >
                    <path
                      d="M15.0715 6C15.0723 6.74838 14.8864 7.48514 14.5306 8.14357C14.1749 8.80199 13.6606 9.3613 13.0342 9.77086C12.4078 10.1804 11.6892 10.4273 10.9434 10.4891C10.1975 10.551 9.44807 10.4258 8.7628 10.125L5.50905 13.8887C5.50155 13.8975 5.4928 13.9069 5.48467 13.915C5.10956 14.2901 4.60079 14.5009 4.0703 14.5009C3.5398 14.5009 3.03104 14.2901 2.65592 13.915C2.28081 13.5399 2.07007 13.0311 2.07007 12.5006C2.07007 11.9701 2.28081 11.4614 2.65592 11.0862C2.66467 11.0781 2.67342 11.0694 2.6828 11.0619L6.44655 7.80875C6.10934 7.03738 5.99505 6.18694 6.11664 5.35392C6.23823 4.52089 6.59084 3.73861 7.13446 3.09581C7.67809 2.45301 8.39098 1.97542 9.19226 1.71721C9.99354 1.45901 10.8511 1.43053 11.6678 1.635C11.752 1.6561 11.8292 1.69875 11.8919 1.75875C11.9546 1.81875 12.0006 1.89405 12.0254 1.97722C12.0502 2.0604 12.0529 2.14859 12.0333 2.23313C12.0136 2.31767 11.9723 2.39564 11.9134 2.45937L9.57155 5L9.9253 6.64687L11.5715 7L14.1122 4.655C14.1759 4.59609 14.2539 4.55479 14.3384 4.53515C14.423 4.51551 14.5111 4.51822 14.5943 4.543C14.6775 4.56778 14.7528 4.61379 14.8128 4.67649C14.8728 4.73919 14.9154 4.81644 14.9365 4.90062C15.0263 5.26019 15.0716 5.6294 15.0715 6Z"
                      fill="#079455"
                    />
                  </svg>
                </Avatar>
                <Typography
                  variant="base"
                  color="text.light"
                  sx={{ fontWeight: 500, mt: 1 }}
                >
                  Total Expense
                </Typography>
                <Typography
                  variant="h4"
                  color="text.main"
                  sx={{ fontWeight: 500, margin: "0px" }}
                >
                  $
                  <CountUp
                    end={storeDetails?.totalPending}
                    duration={2}
                    decimals={2}
                  />
                </Typography>
              </Grid>
              <Grid
                size="auto"
                sx={{
                  ...boxStyle2,
                }}
              >
                {" "}
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: `#DCFAE6`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                  >
                    <path
                      d="M15.0715 6C15.0723 6.74838 14.8864 7.48514 14.5306 8.14357C14.1749 8.80199 13.6606 9.3613 13.0342 9.77086C12.4078 10.1804 11.6892 10.4273 10.9434 10.4891C10.1975 10.551 9.44807 10.4258 8.7628 10.125L5.50905 13.8887C5.50155 13.8975 5.4928 13.9069 5.48467 13.915C5.10956 14.2901 4.60079 14.5009 4.0703 14.5009C3.5398 14.5009 3.03104 14.2901 2.65592 13.915C2.28081 13.5399 2.07007 13.0311 2.07007 12.5006C2.07007 11.9701 2.28081 11.4614 2.65592 11.0862C2.66467 11.0781 2.67342 11.0694 2.6828 11.0619L6.44655 7.80875C6.10934 7.03738 5.99505 6.18694 6.11664 5.35392C6.23823 4.52089 6.59084 3.73861 7.13446 3.09581C7.67809 2.45301 8.39098 1.97542 9.19226 1.71721C9.99354 1.45901 10.8511 1.43053 11.6678 1.635C11.752 1.6561 11.8292 1.69875 11.8919 1.75875C11.9546 1.81875 12.0006 1.89405 12.0254 1.97722C12.0502 2.0604 12.0529 2.14859 12.0333 2.23313C12.0136 2.31767 11.9723 2.39564 11.9134 2.45937L9.57155 5L9.9253 6.64687L11.5715 7L14.1122 4.655C14.1759 4.59609 14.2539 4.55479 14.3384 4.53515C14.423 4.51551 14.5111 4.51822 14.5943 4.543C14.6775 4.56778 14.7528 4.61379 14.8128 4.67649C14.8728 4.73919 14.9154 4.81644 14.9365 4.90062C15.0263 5.26019 15.0716 5.6294 15.0715 6Z"
                      fill="#079455"
                    />
                  </svg>
                </Avatar>
                <Typography
                  variant="base"
                  color="text.light"
                  sx={{ fontWeight: 500, mt: 1 }}
                >
                  Total Purchase
                </Typography>
                <Typography
                  variant="h4"
                  color="text.main"
                  sx={{ fontWeight: 500, margin: "0px" }}
                >
                  $
                  <CountUp
                    end={storeDetails?.totalPending}
                    duration={2}
                    decimals={2}
                  />
                </Typography>
              </Grid>
              <Grid
                size="auto"
                sx={{
                  ...boxStyle2,
                }}
              >
                {" "}
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: `#DCFAE6`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                  >
                    <path
                      d="M15.0715 6C15.0723 6.74838 14.8864 7.48514 14.5306 8.14357C14.1749 8.80199 13.6606 9.3613 13.0342 9.77086C12.4078 10.1804 11.6892 10.4273 10.9434 10.4891C10.1975 10.551 9.44807 10.4258 8.7628 10.125L5.50905 13.8887C5.50155 13.8975 5.4928 13.9069 5.48467 13.915C5.10956 14.2901 4.60079 14.5009 4.0703 14.5009C3.5398 14.5009 3.03104 14.2901 2.65592 13.915C2.28081 13.5399 2.07007 13.0311 2.07007 12.5006C2.07007 11.9701 2.28081 11.4614 2.65592 11.0862C2.66467 11.0781 2.67342 11.0694 2.6828 11.0619L6.44655 7.80875C6.10934 7.03738 5.99505 6.18694 6.11664 5.35392C6.23823 4.52089 6.59084 3.73861 7.13446 3.09581C7.67809 2.45301 8.39098 1.97542 9.19226 1.71721C9.99354 1.45901 10.8511 1.43053 11.6678 1.635C11.752 1.6561 11.8292 1.69875 11.8919 1.75875C11.9546 1.81875 12.0006 1.89405 12.0254 1.97722C12.0502 2.0604 12.0529 2.14859 12.0333 2.23313C12.0136 2.31767 11.9723 2.39564 11.9134 2.45937L9.57155 5L9.9253 6.64687L11.5715 7L14.1122 4.655C14.1759 4.59609 14.2539 4.55479 14.3384 4.53515C14.423 4.51551 14.5111 4.51822 14.5943 4.543C14.6775 4.56778 14.7528 4.61379 14.8128 4.67649C14.8728 4.73919 14.9154 4.81644 14.9365 4.90062C15.0263 5.26019 15.0716 5.6294 15.0715 6Z"
                      fill="#079455"
                    />
                  </svg>
                </Avatar>
                <Typography
                  variant="base"
                  color="text.light"
                  sx={{ fontWeight: 500, mt: 1 }}
                >
                  Purchase On Transit
                </Typography>
                <Typography
                  variant="h4"
                  color="text.main"
                  sx={{ fontWeight: 500, margin: "0px" }}
                >
                  $
                  <CountUp
                    end={storeDetails?.totalPending}
                    duration={2}
                    decimals={2}
                  />
                </Typography>
              </Grid>
              <Grid
                size="auto"
                sx={{
                  ...boxStyle2,
                }}
              >
                {" "}
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: `#DCFAE6`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                  >
                    <path
                      d="M15.0715 6C15.0723 6.74838 14.8864 7.48514 14.5306 8.14357C14.1749 8.80199 13.6606 9.3613 13.0342 9.77086C12.4078 10.1804 11.6892 10.4273 10.9434 10.4891C10.1975 10.551 9.44807 10.4258 8.7628 10.125L5.50905 13.8887C5.50155 13.8975 5.4928 13.9069 5.48467 13.915C5.10956 14.2901 4.60079 14.5009 4.0703 14.5009C3.5398 14.5009 3.03104 14.2901 2.65592 13.915C2.28081 13.5399 2.07007 13.0311 2.07007 12.5006C2.07007 11.9701 2.28081 11.4614 2.65592 11.0862C2.66467 11.0781 2.67342 11.0694 2.6828 11.0619L6.44655 7.80875C6.10934 7.03738 5.99505 6.18694 6.11664 5.35392C6.23823 4.52089 6.59084 3.73861 7.13446 3.09581C7.67809 2.45301 8.39098 1.97542 9.19226 1.71721C9.99354 1.45901 10.8511 1.43053 11.6678 1.635C11.752 1.6561 11.8292 1.69875 11.8919 1.75875C11.9546 1.81875 12.0006 1.89405 12.0254 1.97722C12.0502 2.0604 12.0529 2.14859 12.0333 2.23313C12.0136 2.31767 11.9723 2.39564 11.9134 2.45937L9.57155 5L9.9253 6.64687L11.5715 7L14.1122 4.655C14.1759 4.59609 14.2539 4.55479 14.3384 4.53515C14.423 4.51551 14.5111 4.51822 14.5943 4.543C14.6775 4.56778 14.7528 4.61379 14.8128 4.67649C14.8728 4.73919 14.9154 4.81644 14.9365 4.90062C15.0263 5.26019 15.0716 5.6294 15.0715 6Z"
                      fill="#079455"
                    />
                  </svg>
                </Avatar>
                <Typography
                  variant="base"
                  color="text.light"
                  sx={{ fontWeight: 500, mt: 1 }}
                >
                  Purchase On Hold
                </Typography>
                <Typography
                  variant="h4"
                  color="text.main"
                  sx={{ fontWeight: 500, margin: "0px" }}
                >
                  $
                  <CountUp
                    end={storeDetails?.totalPending}
                    duration={2}
                    decimals={2}
                  />
                </Typography>
              </Grid>
              <Grid
                size="auto"
                sx={{
                  ...boxStyle2,
                }}
              >
                {" "}
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: `#DCFAE6`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                  >
                    <path
                      d="M15.0715 6C15.0723 6.74838 14.8864 7.48514 14.5306 8.14357C14.1749 8.80199 13.6606 9.3613 13.0342 9.77086C12.4078 10.1804 11.6892 10.4273 10.9434 10.4891C10.1975 10.551 9.44807 10.4258 8.7628 10.125L5.50905 13.8887C5.50155 13.8975 5.4928 13.9069 5.48467 13.915C5.10956 14.2901 4.60079 14.5009 4.0703 14.5009C3.5398 14.5009 3.03104 14.2901 2.65592 13.915C2.28081 13.5399 2.07007 13.0311 2.07007 12.5006C2.07007 11.9701 2.28081 11.4614 2.65592 11.0862C2.66467 11.0781 2.67342 11.0694 2.6828 11.0619L6.44655 7.80875C6.10934 7.03738 5.99505 6.18694 6.11664 5.35392C6.23823 4.52089 6.59084 3.73861 7.13446 3.09581C7.67809 2.45301 8.39098 1.97542 9.19226 1.71721C9.99354 1.45901 10.8511 1.43053 11.6678 1.635C11.752 1.6561 11.8292 1.69875 11.8919 1.75875C11.9546 1.81875 12.0006 1.89405 12.0254 1.97722C12.0502 2.0604 12.0529 2.14859 12.0333 2.23313C12.0136 2.31767 11.9723 2.39564 11.9134 2.45937L9.57155 5L9.9253 6.64687L11.5715 7L14.1122 4.655C14.1759 4.59609 14.2539 4.55479 14.3384 4.53515C14.423 4.51551 14.5111 4.51822 14.5943 4.543C14.6775 4.56778 14.7528 4.61379 14.8128 4.67649C14.8728 4.73919 14.9154 4.81644 14.9365 4.90062C15.0263 5.26019 15.0716 5.6294 15.0715 6Z"
                      fill="#079455"
                    />
                  </svg>
                </Avatar>
                <Typography
                  variant="base"
                  color="text.light"
                  sx={{ fontWeight: 500, mt: 1 }}
                >
                  Purchase On Received
                </Typography>
                <Typography
                  variant="h4"
                  color="text.main"
                  sx={{ fontWeight: 500, margin: "0px" }}
                >
                  $
                  <CountUp
                    end={storeDetails?.totalPending}
                    duration={2}
                    decimals={2}
                  />
                </Typography>
              </Grid>
              <Grid
                size="auto"
                sx={{
                  ...boxStyle2,
                }}
              >
                {" "}
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: `#DCFAE6`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                  >
                    <path
                      d="M15.0715 6C15.0723 6.74838 14.8864 7.48514 14.5306 8.14357C14.1749 8.80199 13.6606 9.3613 13.0342 9.77086C12.4078 10.1804 11.6892 10.4273 10.9434 10.4891C10.1975 10.551 9.44807 10.4258 8.7628 10.125L5.50905 13.8887C5.50155 13.8975 5.4928 13.9069 5.48467 13.915C5.10956 14.2901 4.60079 14.5009 4.0703 14.5009C3.5398 14.5009 3.03104 14.2901 2.65592 13.915C2.28081 13.5399 2.07007 13.0311 2.07007 12.5006C2.07007 11.9701 2.28081 11.4614 2.65592 11.0862C2.66467 11.0781 2.67342 11.0694 2.6828 11.0619L6.44655 7.80875C6.10934 7.03738 5.99505 6.18694 6.11664 5.35392C6.23823 4.52089 6.59084 3.73861 7.13446 3.09581C7.67809 2.45301 8.39098 1.97542 9.19226 1.71721C9.99354 1.45901 10.8511 1.43053 11.6678 1.635C11.752 1.6561 11.8292 1.69875 11.8919 1.75875C11.9546 1.81875 12.0006 1.89405 12.0254 1.97722C12.0502 2.0604 12.0529 2.14859 12.0333 2.23313C12.0136 2.31767 11.9723 2.39564 11.9134 2.45937L9.57155 5L9.9253 6.64687L11.5715 7L14.1122 4.655C14.1759 4.59609 14.2539 4.55479 14.3384 4.53515C14.423 4.51551 14.5111 4.51822 14.5943 4.543C14.6775 4.56778 14.7528 4.61379 14.8128 4.67649C14.8728 4.73919 14.9154 4.81644 14.9365 4.90062C15.0263 5.26019 15.0716 5.6294 15.0715 6Z"
                      fill="#079455"
                    />
                  </svg>
                </Avatar>
                <Typography
                  variant="base"
                  color="text.light"
                  sx={{ fontWeight: 500, mt: 1 }}
                >
                  Total Customer
                </Typography>
                <Typography
                  variant="h4"
                  color="text.main"
                  sx={{ fontWeight: 500, margin: "0px" }}
                >
                  $
                  <CountUp
                    end={storeDetails?.totalPending}
                    duration={2}
                    decimals={2}
                  />
                </Typography>
              </Grid>
              <Grid
                size="auto"
                sx={{
                  ...boxStyle2,
                }}
              >
                {" "}
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: `#DCFAE6`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                  >
                    <path
                      d="M15.0715 6C15.0723 6.74838 14.8864 7.48514 14.5306 8.14357C14.1749 8.80199 13.6606 9.3613 13.0342 9.77086C12.4078 10.1804 11.6892 10.4273 10.9434 10.4891C10.1975 10.551 9.44807 10.4258 8.7628 10.125L5.50905 13.8887C5.50155 13.8975 5.4928 13.9069 5.48467 13.915C5.10956 14.2901 4.60079 14.5009 4.0703 14.5009C3.5398 14.5009 3.03104 14.2901 2.65592 13.915C2.28081 13.5399 2.07007 13.0311 2.07007 12.5006C2.07007 11.9701 2.28081 11.4614 2.65592 11.0862C2.66467 11.0781 2.67342 11.0694 2.6828 11.0619L6.44655 7.80875C6.10934 7.03738 5.99505 6.18694 6.11664 5.35392C6.23823 4.52089 6.59084 3.73861 7.13446 3.09581C7.67809 2.45301 8.39098 1.97542 9.19226 1.71721C9.99354 1.45901 10.8511 1.43053 11.6678 1.635C11.752 1.6561 11.8292 1.69875 11.8919 1.75875C11.9546 1.81875 12.0006 1.89405 12.0254 1.97722C12.0502 2.0604 12.0529 2.14859 12.0333 2.23313C12.0136 2.31767 11.9723 2.39564 11.9134 2.45937L9.57155 5L9.9253 6.64687L11.5715 7L14.1122 4.655C14.1759 4.59609 14.2539 4.55479 14.3384 4.53515C14.423 4.51551 14.5111 4.51822 14.5943 4.543C14.6775 4.56778 14.7528 4.61379 14.8128 4.67649C14.8728 4.73919 14.9154 4.81644 14.9365 4.90062C15.0263 5.26019 15.0716 5.6294 15.0715 6Z"
                      fill="#079455"
                    />
                  </svg>
                </Avatar>
                <Typography
                  variant="base"
                  color="text.light"
                  sx={{ fontWeight: 500, mt: 1 }}
                >
                  Total Supplier
                </Typography>
                <Typography
                  variant="h4"
                  color="text.main"
                  sx={{ fontWeight: 500, margin: "0px" }}
                >
                  $
                  <CountUp
                    end={storeDetails?.totalPending}
                    duration={2}
                    decimals={2}
                  />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid size={8} sx={{ minHeight: "100%" }}>
          <Box sx={{ ...boxStyle, p: 3, minHeight: "100%" }}>
            {" "}
            <Grid
              container
              direction="column"
              // justifyContent="space-between"
              // alignItems="center"
              sx={{ minHeight: "410px" }}
            >
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid size="auto">
                  {" "}
                  <Typography
                    variant="base"
                    color="text.main"
                    sx={{ fontWeight: 500 }}
                  >
                    Repair Statistics
                  </Typography>
                  <Typography
                    variant="medium"
                    color="text.main"
                    sx={{ fontWeight: 400 }}
                  >
                    Last {months} months overview
                  </Typography>
                </Grid>
                <Grid size="auto">
                  {/* <IconButton>
                    <MenuIcon color={theme.palette.text.light} />
                  </IconButton> */}
                  <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="demo-simple-select-label">
                      Months
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={months}
                      label="Months"
                      onChange={handleChange}
                    >
                      <MenuItem value={12}>12 Months</MenuItem>
                      <MenuItem value={6}>6 Months</MenuItem>
                      <MenuItem value={3}>3 Months</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container alignItems="end" spacing={3}>
                {/* <Grid  size={4}>
                  <Typography
                    variant="h2"
                    color="text.main"
                    sx={{ mb: 1.5, fontWeight: 600 }}
                  >
                    168.5K
                  </Typography>
                  <Typography
                    variant="medium"
                    color="text.main"
                    sx={{ fontWeight: 400, mb: 2 }}
                  >
                    You informed of this week compared to last week
                  </Typography>
                </Grid> */}
                <Grid size={12}>
                  {/* <img
                    src={
                      theme.palette.mode === "light"
                        ? "/images/Chart1_Light.png"
                        : "/images/Chart1_Dark.png"
                    }
                    width="100%"
                  /> */}
                  {/* <ColumnChart chartData={chartData} /> */}
                  <div style={{ position: "relative" }}>
                    {summaryLoading && (
                      <SyncLoader
                        color={theme.palette.primary.main}
                        loading={true}
                        size={15}
                        speedMultiplier={0.5}
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "30%",
                          zIndex: 100,
                        }}
                      />
                    )}
                    <div
                      id="chart"
                      // className={classes.chartContainer}
                      style={{ opacity: summaryLoading && 0.5 }}
                    >
                      <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="bar"
                        height={380}
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid size={4} sx={{ minHeight: "100%" }}>
          <Box sx={{ ...boxStyle, p: 3, minHeight: "100%" }}>
            {" "}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1.125 }}
            >
              <Grid size="auto">
                {" "}
                <Typography
                  variant="base"
                  color="text.main"
                  sx={{ fontWeight: 500 }}
                >
                  Store Details
                </Typography>
              </Grid>
              {/* <Grid  size="auto">
                <IconButton>
                  <MenuIcon color={theme.palette.text.light} />
                </IconButton>
              </Grid> */}
            </Grid>
            <Alert severity="" color="warning" sx={{ mb: 2 }}>
              Important: Please do not share your Store ID or Store Password
              with anyone.
            </Alert>
            {storeDetailLoading ? (
              <Grid container>
                <Grid size={6}>
                  <Skeleton
                    variant="rectangular"
                    width={160}
                    height={160}
                    style={{ marginBottom: "16px" }}
                  />
                </Grid>
                <Grid size={6}>
                  <Typography variant="small" color="text.main" sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" width="80%" />
                  </Typography>
                  <Typography variant="small" color="text.main" sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" width="80%" />
                  </Typography>
                  <Typography variant="small" color="text.main" sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" width="80%" />
                  </Typography>
                  <Typography variant="small" color="text.main" sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" width="80%" />
                  </Typography>
                  <Typography variant="small" color="text.main" sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" width="80%" />
                  </Typography>
                  <Typography variant="small" color="text.main" sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" width="80%" />
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Grid container>
                <Grid size={6}>
                  <img
                    src={
                      storeDetails.storeImage !== undefined
                        ? storeDetails.storeImage
                        : "/images/no-image.png"
                    }
                    alt="Store Image"
                    width="160px"
                    height="160px"
                    style={{ marginBottom: "16px" }}
                  />
                </Grid>
                <Grid size={6}>
                  <Typography variant="small" color="text.main" sx={{ mb: 2 }}>
                    Store Name: {storeDetails.storeName}
                  </Typography>
                  <Typography variant="small" color="text.main" sx={{ mb: 2 }}>
                    Store Desc: {storeDetails.storeDesc}
                  </Typography>
                  <Typography variant="small" color="text.main" sx={{ mb: 1 }}>
                    Store ID: {storeDetails.storeId}
                  </Typography>

                  <Typography variant="small" color="text.main" sx={{ mb: 1 }}>
                    Password:{" "}
                    {showPassword
                      ? storeDetails.storePassword
                      : "**** **** ****"}
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
                    </IconButton>
                  </Typography>

                  <Typography variant="small" color="text.main" sx={{ mb: 2 }}>
                    Created At:{" "}
                    {moment(storeDetails.storeCreated).format(
                      "DD MMM YYYY | h:mm A"
                    )}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
