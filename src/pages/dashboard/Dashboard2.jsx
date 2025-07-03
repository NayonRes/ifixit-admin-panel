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
  Button,
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
import jwt_decode, { jwtDecode } from "jwt-decode";
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
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ButtonGroup from "@mui/material/ButtonGroup";

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
  const [months, setMonths] = React.useState(3);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [stats, setStats] = useState({});
  const [repairSummary, setRepairSummary] = useState({});
  const [branchId, setBranchId] = useState("");
  const [message, setMessage] = useState("");
  const [startingTime, setStartingTime] = useState(dayjs().subtract(30, "day"));
  const [endingTime, setEndingTime] = useState(dayjs().startOf("day"));

  const customeTextFeild = {
    width: "260px",
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
  const handleChange = (event) => {
    setMonths(event.target.value);
    getRepairSummaryForChart(event.target.value);
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

  const handleBranchChange = (value) => {
    setBranchId(value);
    getStats(startingTime, endingTime, value);
  };
  const getStats = async (formDate, toDate, branch) => {
    if (ifixit_admin_panel.token) {
      setLoading(true);
      let newBranch = branch;
      if (branch === "None") {
        newBranch = "";
      }
      const startDate = formDate ? dayjs(formDate).format("YYYY-MM-DD") : "";
      const endDate = toDate ? dayjs(toDate).format("YYYY-MM-DD") : "";
      let url = `/api/v1/dashboard/stats?branch_id=${newBranch}&startDate=${startDate}&endDate=${endDate}`;
      let statsData = await getDataWithToken(url);

      if (statsData?.status === 401) {
        logout();
        return;
      }

      if (statsData.status >= 200 && statsData.status < 300) {
        setStats(statsData?.data);
      } else {
        setLoading(false);
        handleSnakbarOpen(statsData?.data?.message, "error");
      }
      setLoading(false);
    }
  };
  const getRepairSummary = async (formDate, toDate, branch) => {
    if (ifixit_admin_panel.token) {
      setLoading(true);
      let newBranch = branch;
      if (branch === "None") {
        newBranch = "";
      }
      const startDate = formDate ? dayjs(formDate).format("YYYY-MM-DD") : "";
      const endDate = toDate ? dayjs(toDate).format("YYYY-MM-DD") : "";
      let url = `/api/v1/dashboard/repair-summary`;
      let repairSummaryData = await getDataWithToken(url);

      if (repairSummaryData?.status === 401) {
        logout();
        return;
      }
      if (repairSummaryData.status >= 200 && repairSummaryData.status < 300) {
        setRepairSummary(repairSummaryData?.data?.data);
      } else {
        setLoading(false);
        handleSnakbarOpen(repairSummaryData?.data?.message, "error");
      }
      setLoading(false);
    }
  };
  const getRepairSummaryForChart = async (monthCount) => {
    console.log("monthCount", monthCount);

    if (ifixit_admin_panel.token) {
      setLoading(true);
      setMonths(monthCount);
      const currentMonthStart = dayjs().startOf("month");
      const startDate = currentMonthStart
        .subtract(monthCount, "month")
        .format("YYYY-MM-DD");
      const endDate = currentMonthStart.subtract(1, "day").format("YYYY-MM-DD");

      // const startDate = formDate ? dayjs(formDate).format("YYYY-MM-DD") : "";
      // const endDate = toDate ? dayjs(toDate).format("YYYY-MM-DD") : "";
      let url = `/api/v1/dashboard/repair-chart?startDate=${startDate}&endDate=${endDate}&months=${monthCount}`;
      let repairSummaryData = await getDataWithToken(url);

      if (repairSummaryData?.status === 401) {
        logout();
        return;
      }
      if (repairSummaryData.status >= 200 && repairSummaryData.status < 300) {
        setRepairSummary(repairSummaryData?.data?.data);
      } else {
        setLoading(false);
        handleSnakbarOpen(repairSummaryData?.data?.message, "error");
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
    getStats(startingTime, endingTime, branchId);
    getRepairSummary();
    getBranchList();
    getRepairSummaryForChart(months);
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
            <Typography
              variant="base"
              color="text.main"
              sx={{ fontWeight: 500, ml: 4 }}
            >
              Summary
            </Typography>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1.125, px: 3 }}
            >
              <Grid size={6}>
                {jwtDecode(ifixit_admin_panel?.token)?.user?.is_main_branch && (
                  <Box
                    sx={{
                      // display: "flex",
                      // flexDirection: "column",
                      // alignItems: "center",
                      "& .MuiButton-outlined": {
                        borderColor: "#D0D4DD",
                        color: "#656E81",
                      },
                      "& > *": {
                        m: 1,
                      },
                    }}
                  >
                    <ButtonGroup
                      variant="outlined"
                      aria-label="Basic button group"
                    >
                      <Button
                        sx={{
                          background: branchId === "" && "#D0D4DD",
                        }}
                        onClick={() => {
                          handleBranchChange("");
                        }}
                      >
                        All
                      </Button>
                      {branchList?.map((item) => (
                        <Button
                          sx={{
                            background: branchId === item?._id && "#D0D4DD",
                          }}
                          key={item?._id}
                          onClick={() => {
                            handleBranchChange(item?._id);
                          }}
                        >
                          {" "}
                          {item?.name}
                        </Button>
                      ))}
                    </ButtonGroup>
                  </Box>
                )}
              </Grid>
              <Grid size={6} sx={{ textAlign: "right" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From Date"
                    value={startingTime}
                    onChange={(newValue) => {
                      getStats(newValue, endingTime, branchId);
                      setStartingTime(newValue);
                    }}
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
                &nbsp;&nbsp;&nbsp;
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To Date"
                    value={endingTime}
                    onChange={(newValue) => {
                      getStats(startingTime, newValue, branchId);
                      setEndingTime(newValue);
                    }}
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
            </Grid>
            {/* <Divider /> */}
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
                  variant="h6"
                  color="text.main"
                  sx={{ fontWeight: 600, margin: "0px" }}
                >
                  <CountUp
                    end={stats?.totalExpense || 0}
                    duration={1}
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
                    bgcolor: `#FEF7C3`,
                  }}
                >
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.98743 6.24882C9.54859 5.81001 8.94231 5.53857 8.27265 5.53857C7.60296 5.53857 6.99668 5.81001 6.55787 6.24882C6.11906 6.68763 5.84762 7.29391 5.84762 7.9636C5.84762 8.63329 6.11906 9.23954 6.55787 9.67838C6.99668 10.1172 7.60296 10.3886 8.27265 10.3886C8.94234 10.3886 9.54859 10.1172 9.98743 9.67838C10.4262 9.23954 10.6977 8.63329 10.6977 7.9636C10.6977 7.29391 10.4262 6.68763 9.98743 6.24882ZM11.0611 1.51829C10.4464 1.24869 9.78668 1.06401 9.0969 0.978882V4.27257C9.35334 4.33251 9.59934 4.41794 9.83203 4.52604C10.0647 4.63413 10.2852 4.76535 10.4905 4.91673L12.8007 2.60648C12.2805 2.16454 11.6952 1.79638 11.0611 1.51829ZM15.3371 5.72679C15.5788 6.43935 15.7098 7.20388 15.7098 8.00004C15.7098 8.73932 15.5968 9.45135 15.3872 10.1198C15.1964 10.728 14.9262 11.3002 14.589 11.8242L12.1896 9.42482C12.2702 9.22426 12.3342 9.01585 12.3799 8.80129C12.4352 8.54173 12.4643 8.27363 12.4643 8.00001C12.4643 7.66232 12.42 7.3336 12.3369 7.01944C12.266 6.75148 12.1667 6.49498 12.0426 6.25335L14.3992 3.89673C14.7956 4.45248 15.1136 5.06785 15.3371 5.72679ZM11.2063 14.4155C11.8866 14.0986 12.5076 13.6773 13.0485 13.1725L10.7502 10.8742C10.52 11.0768 10.2648 11.2524 9.98971 11.3959C9.71028 11.5416 9.4109 11.6539 9.0969 11.7275V15.0212C9.84078 14.9294 10.5502 14.7213 11.2063 14.4155ZM2.99665 12.7705C1.848 11.5134 1.14734 9.83907 1.14734 8.00004C1.14734 6.16101 1.848 4.48669 2.99665 3.22957C4.10537 2.01616 5.63103 1.19041 7.34665 0.978913V4.27263C6.52278 4.46538 5.80121 4.92419 5.27762 5.55354C4.72518 6.2176 4.3929 7.07044 4.3929 8.00004C4.3929 8.92963 4.72515 9.78248 5.27762 10.4465C5.80121 11.0759 6.52278 11.5347 7.34665 11.7274V15.0211C5.63103 14.8097 4.10537 13.9839 2.99665 12.7705ZM8.47115 9.14332V9.39932C8.47115 9.52013 8.37321 9.61807 8.2524 9.61807C8.13159 9.61807 8.03365 9.52013 8.03365 9.39932V9.14494H7.7629C7.64209 9.14494 7.54415 9.04701 7.54415 8.92619C7.54415 8.80538 7.64209 8.70744 7.7629 8.70744H8.42337C8.49534 8.70744 8.56096 8.67785 8.60865 8.63013C8.65634 8.58244 8.68593 8.51685 8.68593 8.44485C8.68593 8.37288 8.65631 8.30729 8.60865 8.2596C8.56096 8.21191 8.49534 8.18229 8.42337 8.18229H8.12187C7.92912 8.18229 7.75406 8.10357 7.62731 7.97682C7.50053 7.85004 7.42184 7.67498 7.42184 7.48226C7.42184 7.28951 7.50053 7.11444 7.62731 6.98766C7.73443 6.88054 7.87603 6.80773 8.03365 6.78776V6.52782C8.03365 6.40701 8.13159 6.30907 8.2524 6.30907C8.37321 6.30907 8.47115 6.40701 8.47115 6.52782V6.78219H8.78237C8.90318 6.78219 9.00112 6.88013 9.00112 7.00094C9.00112 7.12176 8.90318 7.21969 8.78237 7.21969H8.1219C8.04993 7.21969 7.98434 7.24932 7.93665 7.29698C7.88896 7.34466 7.85937 7.41029 7.85937 7.48226C7.85937 7.55423 7.88899 7.61982 7.93665 7.66751C7.98434 7.71519 8.04993 7.74482 8.1219 7.74482H8.4234C8.61615 7.74482 8.79121 7.82354 8.918 7.95029C9.04478 8.07707 9.12346 8.25213 9.12346 8.44485C9.12346 8.6376 9.04478 8.81266 8.918 8.93944C8.80178 9.05573 8.64496 9.13151 8.47115 9.14332Z"
                      fill="#EAAA08"
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
                  variant="h6"
                  color="text.main"
                  sx={{ fontWeight: 600, margin: "0px" }}
                >
                  <CountUp
                    end={stats?.totalExpense || 0}
                    duration={1}
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
                    bgcolor: `#EBE9FE`,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.5793 8.35079L11.3046 3.64734H9.08657V5.75937H8.14911V3.64734H4.53852V5.75937H3.60106V3.64734H1.38303L0.890395 12.0805C0.852053 12.7371 1.07948 13.3623 1.5308 13.8407C1.98213 14.3192 2.59292 14.5826 3.25064 14.5826H8.45076C8.14733 13.9919 7.97597 13.3226 7.97597 12.614C7.97597 10.4753 9.53696 8.69468 11.5793 8.35079Z"
                      fill="#6938EF"
                    />
                    <path
                      d="M4.53853 2.74273C4.53853 1.7473 5.34837 0.93746 6.3438 0.93746C7.33923 0.93746 8.1491 1.7473 8.1491 2.74273V3.64734H9.08656V2.74273C9.08656 1.23038 7.85617 0 6.3438 0C4.83143 0 3.60107 1.23038 3.60107 2.74273V3.64734H4.53853V2.74273Z"
                      fill="#6938EF"
                    />
                    <path
                      d="M15.6855 12.614C15.6855 10.747 14.1665 9.22803 12.2995 9.22803C10.4324 9.22803 8.91345 10.747 8.91345 12.614C8.91345 14.4811 10.4324 16 12.2995 16C14.1665 16 15.6855 14.4811 15.6855 12.614ZM11.7925 14.2724L10.2699 12.5503L10.9722 11.9294L11.8228 12.8913L13.5842 11.0668L14.2586 11.7179L11.7925 14.2724Z"
                      fill="#6938EF"
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
                  variant="h6"
                  color="text.main"
                  sx={{ fontWeight: 600, margin: "0px" }}
                >
                  <CountUp
                    end={stats?.totalPurchase || 0}
                    duration={1}
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
                    bgcolor: `#FFE6D5`,
                  }}
                >
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_592_3618)">
                      <path
                        d="M7.35718 11.5C7.35718 13.1348 8.14722 14.5898 9.36206 15.5H3.35718C2.2522 15.5 1.35718 14.605 1.35718 13.5V3.5H4.35718V5H5.35718V3.5H8.35718V5H9.35718V3.5H12.3572V6.5C9.60229 6.5 7.35718 8.74512 7.35718 11.5ZM6.85718 0.5C5.47729 0.5 4.35718 1.62012 4.35718 3V3.5H5.35718V3C5.35718 2.1748 6.03198 1.5 6.85718 1.5C7.68237 1.5 8.35718 2.1748 8.35718 3V3.5H9.35718V3C9.35718 1.62012 8.23706 0.5 6.85718 0.5ZM12.3572 7.5C10.1472 7.5 8.35718 9.29053 8.35718 11.5C8.35718 13.7095 10.1472 15.5 12.3572 15.5C14.5671 15.5 16.3572 13.7095 16.3572 11.5C16.3572 9.29053 14.5671 7.5 12.3572 7.5ZM12.6072 14H11.1072V13H12.6072C13.1584 13 13.6072 12.5513 13.6072 12C13.6072 11.4487 13.1584 11 12.6072 11H11.8142L12.3142 11.5L11.6072 12.207L9.90015 10.5L11.6072 8.79297L12.3142 9.5L11.8142 10H12.6072C13.7102 10 14.6072 10.897 14.6072 12C14.6072 13.103 13.7102 14 12.6072 14Z"
                        fill="#E62E05"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_592_3618">
                        <rect
                          width="16"
                          height="16"
                          fill="white"
                          transform="translate(0.857178)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </Avatar>
                <Typography
                  variant="base"
                  color="text.light"
                  sx={{ fontWeight: 500, mt: 1 }}
                >
                  Purchase Return
                </Typography>
                <Typography
                  variant="h6"
                  color="text.main"
                  sx={{ fontWeight: 600, margin: "0px" }}
                >
                  <CountUp
                    end={stats?.totalReturned || 0}
                    duration={1}
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
                    bgcolor: `#E0E8FF`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                      stroke="#4B46E5"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M3.41003 22C3.41003 18.13 7.26003 15 12 15C12.96 15 13.89 15.13 14.76 15.37"
                      stroke="#4B46E5"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M22 18C22 18.75 21.79 19.46 21.42 20.06C21.21 20.42 20.94 20.74 20.63 21C19.93 21.63 19.01 22 18 22C16.54 22 15.27 21.22 14.58 20.06C14.21 19.46 14 18.75 14 18C14 16.74 14.58 15.61 15.5 14.88C16.19 14.33 17.06 14 18 14C20.21 14 22 15.79 22 18Z"
                      stroke="#4B46E5"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16.4399 18L17.4299 18.99L19.5599 17.02"
                      stroke="#4B46E5"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
                  variant="h6"
                  color="text.main"
                  sx={{ fontWeight: 600, margin: "0px" }}
                >
                  <CountUp end={stats?.totalCustomer || 0} duration={1} />
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
                    bgcolor: `#E04F1630`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M18 18.86H17.24C16.44 18.86 15.68 19.17 15.12 19.73L13.41 21.42C12.63 22.19 11.36 22.19 10.58 21.42L8.87 19.73C8.31 19.17 7.54 18.86 6.75 18.86H6C4.34 18.86 3 17.53 3 15.89V4.97998C3 3.33998 4.34 2.01001 6 2.01001H18C19.66 2.01001 21 3.33998 21 4.97998V15.89C21 17.52 19.66 18.86 18 18.86Z"
                      stroke="#E04F16"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M11.9999 10.0001C13.2868 10.0001 14.33 8.95687 14.33 7.67004C14.33 6.38322 13.2868 5.34009 11.9999 5.34009C10.7131 5.34009 9.66992 6.38322 9.66992 7.67004C9.66992 8.95687 10.7131 10.0001 11.9999 10.0001Z"
                      stroke="#E04F16"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16 15.6601C16 13.8601 14.21 12.4001 12 12.4001C9.79 12.4001 8 13.8601 8 15.6601"
                      stroke="#E04F16"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
                  variant="h6"
                  color="text.main"
                  sx={{ fontWeight: 600, margin: "0px" }}
                >
                  <CountUp end={stats?.totalSupplier || 0} duration={1} />
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
                      <MenuItem value={1}>1 Months</MenuItem>
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
