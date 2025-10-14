import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  useContext,
} from "react";
import { AuthContext } from "../../context/AuthContext";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { Box, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate, useParams } from "react-router-dom";
import { getDataWithToken } from "../../services/GetDataService";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import Checkbox from "@mui/material/Checkbox";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { designationList, roleList } from "../../data";
import { handlePostData } from "../../services/PostDataService";
import ImageUpload from "../../utils/ImageUpload";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { jwtDecode } from "jwt-decode";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TableContainer } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import dayjs from "dayjs";
import TechnicianList from "./TechnicianList";
import RepairStatusList from "./RepairStatusList";

const AddWarranty = ({}) => {
  const navigate = useNavigate();
  const { rid } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [addDialog, setAddDialog] = useState(false);

  const [tableDataList, setTableDataList] = useState([]);
  const [warrantyList, setWarrantyList] = useState([]);
  const [loading2, setLoading2] = useState(false);

  const myBranchId = jwtDecode(ifixit_admin_panel?.token)?.user?.branch_id;

  const [productList, setProductList] = useState([]);

  const [repairLoading, setRepairLoading] = useState(false);
  const [repairDetails, setRepairDetails] = useState("");

  const [serviceCharge, setServiceCharge] = useState("");
  const [serviceStatus, setServiceStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [warrantyLoading, setWarrantyLoading] = useState(false);
  const [technicianList, setTechnicianList] = useState([]);
  const [technician, setTechnician] = useState("");

  const [technicianLoading, setTechnicianLoading] = useState(false);

  const [repairStatus, setRepairStatus] = useState("");
  const [lastUpdatedRepairStatus, setLastUpdatedRepairStatus] = useState("");
  const [repairStatusRemarks, setRepairStatusRemarks] = useState();
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [repair_status_history_data, setRepair_status_history_data] =
    useState();
  const getBranchId = () => {
    let token = ifixit_admin_panel.token;
    let decodedToken = jwtDecode(token);
    let branch_id = decodedToken?.user?.branch_id;
    return branch_id;
  };
  const getTechnician = async () => {
    setTechnicianLoading(true);

    let branch_id = getBranchId();
    // let url = `/api/v1/device/get-by-parent?parent_name=Primary`;
    let newBranchId;
    // if (ifixit_admin_panel?.user?.is_main_branch) {
    //   newBranchId = selectedBranch;
    // } else {
    //   newBranchId = branch_id;
    // }

    // let url = `/api/v1/user/dropdownlist?designation=Technician&branch_id=${branch_id}`;
    let url = `/api/v1/user/dropdownlist?designation=Technician`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    console.log("technician list", allData?.data.data);

    if (allData.status >= 200 && allData.status < 300) {
      setTechnicianLoading(false);

      const groupedData = {};

      allData?.data.data.forEach((user) => {
        user.branch_data.forEach((branch) => {
          if (!groupedData[branch._id]) {
            groupedData[branch._id] = {
              branch_data: {
                _id: branch._id,
                name: branch.name,
              },
              users: [],
            };
          }
          groupedData[branch._id].users.push(user);
        });
      });

      const finalArray = Object.values(groupedData);

      console.log("finalArray*********************", finalArray);

      setTechnicianList(finalArray);
      // setTechnicianList(allData?.data.data);

      let name = allData?.data.data.filter((i) => i._id === technician);

      // if (allData.data.data.length < 1) {
      //   setMessage("No Data found");
      // } else {
      //   setMessage("");
      // }
    } else {
      setTechnicianLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
  };

  const handleDialogClose = (event, reason) => {
    console.log("handleDialogClose 11111111111");

    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setProductList([]);
      setAddDialog(false);
      clearForm();
    }
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
  const clearForm = () => {
    setTechnician("");
    setRepairStatus("");
    setDeliveryStatus("");
    setServiceCharge("");
    setRemarks("");
  };
  const onWarrantySubmit = async (e) => {
    e.preventDefault();
    if (technician?.length < 1) {
      handleSnakbarOpen("Please select a technician", "error");
      return;
    }
    if (repairStatus?.length < 1) {
      handleSnakbarOpen("Please select repair status", "error");
      return;
    }
    if (deliveryStatus?.length < 1) {
      handleSnakbarOpen("Please select delivery status", "error");
      return;
    }
    if (parseInt(serviceCharge) < 0) {
      handleSnakbarOpen("Please enter service charge", "error");
      return;
    }
    setWarrantyLoading(true);
    let data = {
      repair_id: rid,
      service_charge: serviceCharge,
      delivery_status: deliveryStatus,
      repair_by: technician,
      repair_status: repairStatus,
      repair_status_remarks: repairStatusRemarks,
      remarks,
    };

    let response = await handlePostData("/api/v1/warranty/create", data, false);

    if (response?.status === 401) {
      logout();
      return;
    }
    if (response.status >= 200 && response.status < 300) {
      setWarrantyLoading(false);
      handleSnakbarOpen("Added successfully", "success");
    } else {
      setWarrantyLoading(false);
      handleSnakbarOpen(response?.data?.message, "error");
    }
  };

  const customeTextFeild = {
    boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
    // padding: "15px 20px",

    // "& label.Mui-focused": {
    //   color: "#A0AAB4",
    // },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-input": {
      // padding: "15px 24px 15px 0px",
    },
    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px",
      "& fieldset": {
        borderColor: "",
      },

      "&:hover fieldset": {
        borderColor: "#969696",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#969696",
      },
    },
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

  const getData = async () => {
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
  const getWarantyDetails = async () => {
    let url = `/api/v1/warranty?repair_id=${rid}`;

    let warrantyData = await getDataWithToken(url);
    if (warrantyData?.status === 401) {
      logout();
      return;
    }

    console.log(
      "warrantyData **************************",
      warrantyData?.data?.data
    );

    if (warrantyData.status >= 200 && warrantyData.status < 300) {
      if (warrantyData?.data?.data?.length > 0) {
        let newDetails = warrantyData?.data?.data[0];

        setServiceCharge(newDetails?.service_charge);
        setRemarks(newDetails?.remarks);
        setServiceStatus(newDetails?.warranty_service_status);
      }
    } else {
      handleSnakbarOpen(warrantyData?.data?.message, "error");
    }
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
  const isDateAfterMonths = (createdAt, monthsToAdd) => {
    const newDate = dayjs(createdAt).add(monthsToAdd, "month");
    return newDate.isAfter(dayjs());
  };

  const getRepairDetails = async () => {
    setRepairLoading(true);

    let url = `/api/v1/repair/${encodeURIComponent(rid.trim())}`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data", allData?.data?.data);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setRepairDetails(allData?.data?.data);

      if (allData.data.data.length < 1) {
        // setMessage("No data found");
      }
    } else {
      setRepairLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setRepairLoading(false);
  };
  useEffect(() => {
    // getDropdownList();
    getRepairDetails();
  }, []);

  return (
    <>
      <Button
        variant="outlined"
        disableElevation
        size="small"
        color="secondary"
        // sx={{ py: 1.125, px: 2, borderRadius: "6px" }}
        onClick={() => {
          setAddDialog(true);
          getData();
          getWarrantyData();
          // getWarantyDetails();
          getTechnician();
        }}
        startIcon={<AddOutlinedIcon />}
      >
        Add Warranty
      </Button>
      <Dialog
        open={addDialog}
        onClose={handleDialogClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "16px", // Customize the border-radius here
          },
        }}
        // PaperProps={{
        //   component: "form",
        //   onSubmit: onSubmit,
        // }}
        maxWidth="xl"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontSize: "20px",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            color: "#0F1624",
            position: "relative",
            px: 2,
            borderBottom: "1px solid #EAECF1",
          }}
        >
          Warranty
          <IconButton
            sx={{ position: "absolute", right: 0, top: 0 }}
            onClick={handleDialogClose}
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
        <DialogContent
          sx={{
            maxWidth: "1200px",
            minWidth: "1200px",
            px: 2,
            borderBottom: "1px solid #EAECF1",
            my: 1,
          }}
        >
          <Box
            sx={{
              background: "#fff",
              border: "1px solid #EAECF1",
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "#F9FAFB",
              boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
              mb: 2,
              p: 2,
            }}
          >
            <Box sx={{ margin: "16px" }}>
              <Grid container spacing={2}>
                <Grid size={4}>
                  <Typography
                    variant="medium"
                    color="text.main"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    Invoice No :{" "}
                    <b>
                      {repairDetails?.repair_id
                        ? repairDetails?.repair_id
                        : "---------"}
                    </b>
                  </Typography>
                  <Typography
                    variant="medium"
                    color="text.main"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    Invoice Date :{" "}
                    <b>
                      {dayjs(repairDetails?.created_at).format("DD MMM YYYY")}
                    </b>
                  </Typography>
                </Grid>

                <Grid size={8}>
                  <Typography
                    variant="medium"
                    color="text.main"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    Name :{" "}
                    <b>
                      {repairDetails?.customer_data?.length > 0
                        ? repairDetails?.customer_data[0]?.name
                        : "---------"}
                    </b>
                  </Typography>
                  <Typography
                    variant="medium"
                    color="text.main"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    Number :{" "}
                    <b>
                      {repairDetails?.customer_data?.length > 0
                        ? repairDetails?.customer_data[0]?.mobile
                        : "---------"}
                    </b>
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{
                mb: 2,
                background: "#fff",
                border: "1px solid #EAECF1",
                borderRadius: "12px",
                // overflow: "hidden",
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
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 2, xl: 2 }}>
                  <Typography
                    variant="medium"
                    gutterBottom
                    component="div"
                    sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
                    onClick={() => console.log("tableDataList", tableDataList)}
                  >
                    Attached List ({tableDataList?.length})
                  </Typography>
                </Grid>
              </Grid>
              <div
                style={{
                  overflowX: "auto",

                  minWidth: "100%",

                  // padding: "10px 16px 0px",
                  boxSizing: "border-box",
                }}
              >
                <TableContainer>
                  <Table
                    stickyHeader
                    aria-label="sticky table"
                    sx={{
                      "& th": {
                        padding: "4px 16px",
                        fontSize: "12px",
                      },
                      "& td": {
                        padding: "4px 12px",
                        fontSize: "12px",
                      },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Product Name
                        </TableCell>
                        {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                          Purchase date
                        </TableCell> */}
                        {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                        Branch
                      </TableCell>

                      <TableCell style={{ whiteSpace: "nowrap" }}>
                        Purchase price
                      </TableCell> */}
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          SKU Number
                        </TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Warranty (Months)
                        </TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Is Warranty Available
                        </TableCell>

                        {/* <TableCell style={{ whiteSpace: "nowrap" }}>Device</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Model</TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>Price</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Warranty
                  </TableCell>
                 
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Serial No
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Description
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>*/}

                        {/* <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                        Actions
                      </TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {!loading2 &&
                        tableDataList.length > 0 &&
                        tableDataList.map((item, i) => (
                          <TableRow
                            key={i}
                            // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                          >
                            {/* <TableCell sx={{ width: 50 }}>
                        <img
                          src={
                            item?.images?.length > 0
                              ? item?.images[0]?.url
                              : "/noImage.jpg"
                          }
                          alt=""
                          width={40}
                        />
                      </TableCell> */}
                            <TableCell sx={{ minWidth: "130px" }}>
                              {item?.product?.product_data?.length > 0
                                ? item?.product?.product_data[0]?.name
                                : "---------"}{" "}
                              &nbsp;{" "}
                              {item?.product?.product_variation_data?.length > 0
                                ? item?.product?.product_variation_data[0]?.name
                                : "---------"}
                            </TableCell>

                            {/* <TableCell>
                              {moment(
                                item?.product?.purchase_data[0]?.purchase_date
                              ).format("DD/MM/YYYY")}
                            </TableCell> */}
                            {/*  <TableCell>
                            {item?.branch_data
                              ? item?.branch_data[0]?.name
                              : "---------"}
                          </TableCell>
                          <TableCell sx={{ minWidth: "130px" }}>
                            {item?.purchase_products_data
                              ? item?.purchase_products_data[0]?.unit_price
                              : "---------"}
                          </TableCell> */}
                            <TableCell>{item?.sku_number}</TableCell>
                            <TableCell>
                              {item?.product?.product_data[0]?.warranty}
                            </TableCell>
                            <TableCell style={{ whiteSpace: "nowrap" }}>
                              {isDateAfterMonths(
                                repairDetails?.created_at,

                                item?.product?.product_data[0]?.warranty
                              ) ? (
                                <Button
                                  variant="outlined"
                                  color="success"
                                  size="small"
                                  disabled
                                  sx={{
                                    fontSize: "12px",
                                    pointerEvents: "none", // prevent hover/click
                                    backgroundColor: "transparent",
                                    color: "#35b522", // same as the icon color
                                    borderColor: "#35b522",
                                    "&.Mui-disabled": {
                                      opacity: 1, // prevent default disabled opacity
                                      backgroundColor: "transparent",
                                      color: "#35b522",
                                      borderColor: "#35b522",
                                    },
                                  }}
                                  endIcon={
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                        stroke="#35b522"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  }
                                >
                                  {" "}
                                  Warranty Available
                                </Button>
                              ) : (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  disabled
                                  sx={{
                                    fontSize: "12px",
                                    pointerEvents: "none", // prevent hover/click
                                    backgroundColor: "transparent",
                                    color: "#D92D20", // same as the icon color
                                    borderColor: "#D92D20",
                                    "&.Mui-disabled": {
                                      opacity: 1, // prevent default disabled opacity
                                      backgroundColor: "transparent",
                                      color: "#D92D20",
                                      borderColor: "#D92D20",
                                    },
                                  }}
                                  endIcon={
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                        stroke="#D92D20"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  }
                                >
                                  {" "}
                                  Warranty Not Available
                                </Button>
                              )}
                            </TableCell>

                            {/*  <TableCell align="right">
                         <IconButton
                              onClick={() => {
                                setRemoveSKUDialog(true);
                                setRemoveSkuDetails(item);
                              }}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12.2837 7.5L11.9952 15M8.00481 15L7.71635 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.875 4.96358M16.023 4.82547L15.1332 16.3938C15.058 17.3707 14.2434 18.125 13.2637 18.125H6.73631C5.75655 18.125 4.94198 17.3707 4.86683 16.3938L3.97696 4.82547M16.023 4.82547C15.0677 4.6812 14.1013 4.57071 13.125 4.49527M3.125 4.96358C3.40798 4.91456 3.69198 4.86851 3.97696 4.82547M3.97696 4.82547C4.93231 4.6812 5.89874 4.57071 6.875 4.49527M13.125 4.49527V3.73182C13.125 2.74902 12.3661 1.92853 11.3838 1.8971C10.9244 1.8824 10.463 1.875 10 1.875C9.53696 1.875 9.07565 1.8824 8.61618 1.8971C7.63388 1.92853 6.875 2.74902 6.875 3.73182V4.49527M13.125 4.49527C12.0938 4.41558 11.0516 4.375 10 4.375C8.94836 4.375 7.9062 4.41558 6.875 4.49527"
                                  stroke="#4A5468"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </IconButton> 
                          </TableCell>*/}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </Box>
          <Box
            sx={{
              background: "#fff",
              border: "1px solid #EAECF1",
              borderRadius: "12px",
              // overflow: "hidden",
              backgroundColor: "#F9FAFB",
              boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
              mb: 1,
              p: 2,
            }}
          >
            <form
              onSubmit={onWarrantySubmit}
              style={{
                background: "#fff",
                border: "1px solid #EAECF1",
                borderRadius: "12px",
                // overflow: "hidden",
                padding: "32px 16px",
                boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
              }}
            >
              <Typography
                variant="medium"
                gutterBottom
                component="div"
                sx={{ color: "#0F1624", fontWeight: 600, margin: 0, mb: 2 }}
              >
                Warranty Form
              </Typography>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                {" "}
                <Grid size={12}>
                  <TechnicianList
                    technician={technician}
                    setTechnician={setTechnician}
                    technicianLoading={technicianLoading}
                    setTechnicianLoading={setTechnicianLoading}
                    technicianList={technicianList}
                    setTechnicianList={setTechnicianList}
                  />
                </Grid>
                <Grid size={12}>
                  <RepairStatusList
                    repairStatus={repairStatus}
                    setRepairStatus={setRepairStatus}
                    setLastUpdatedRepairStatus={setLastUpdatedRepairStatus}
                    repairStatusRemarks={repairStatusRemarks}
                    setRepairStatusRemarks={setRepairStatusRemarks}
                    deliveryStatus={deliveryStatus}
                    setDeliveryStatus={setDeliveryStatus}
                    repair_status_history_data={repair_status_history_data}
                    technician={technician}
                    setTechnician={setTechnician}
                    technicianLoading={technicianLoading}
                    setTechnicianLoading={setTechnicianLoading}
                    technicianList={technicianList}
                    setTechnicianList={setTechnicianList}
                  />
                </Grid>
                <Grid size={6}>
                  <Typography
                    variant="medium"
                    color="text.main"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    Service Charge *
                  </Typography>
                  <TextField
                    required
                    size="small"
                    type="number"
                    fullWidth
                    id="serviceCharge"
                    placeholder="Service Charges"
                    variant="outlined"
                    sx={{ ...customeTextFeild }}
                    value={serviceCharge}
                    onChange={(e) => {
                      setServiceCharge(e.target.value);
                    }}
                    onWheel={(e) => e.target.blur()}
                  />
                </Grid>
                <Grid size={6}>
                  <Typography
                    variant="medium"
                    color="text.main"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    Add Note
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    id="membershipId"
                    placeholder="Add Note"
                    variant="outlined"
                    sx={{ ...customeTextFeild }}
                    value={remarks}
                    onChange={(e) => {
                      setRemarks(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ px: 1, mt: 2, textAlign: "right" }}>
                <Button
                  variant="contained"
                  disabled={warrantyLoading}
                  type="submit"
                  // onClick={() => onWarrantySubmit()}
                  sx={{
                    px: 2,
                    py: 1.25,
                    fontSize: "14px",
                    fontWeight: 600,
                    minWidth: "220px",
                    minHeight: "44px",
                  }}
                  // style={{ minWidth: "180px", minHeight: "35px" }}
                  autoFocus
                  disableElevation
                >
                  <PulseLoader
                    color={"#4B46E5"}
                    loading={warrantyLoading}
                    size={10}
                    speedMultiplier={0.5}
                  />{" "}
                  {warrantyLoading === false && "Save Warranty Details"}
                </Button>
              </Box>
              {/* 111 */}
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddWarranty;
