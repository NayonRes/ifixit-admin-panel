import React, { useState, useEffect, useContext, useRef } from "react";
import { getDataWithToken } from "../../services/GetDataService";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
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
import { Link, useParams } from "react-router-dom";
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
import { designationList, purchaseStatusList, roleList } from "../../data";
// import AddSpareParts from "./AddSpareParts";
import UpdatePurchase from "./UpdatePurchase";
import { handlePutData } from "../../services/PutDataService";
import AddSparePartsVariation from "./AddSparePartsVariation";
import InputAdornment from "@mui/material/InputAdornment";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import BallotOutlinedIcon from "@mui/icons-material/BallotOutlined";

import Chip from "@mui/material/Chip";
import { handlePostData } from "../../services/PostDataService";
import BarcodeGenerate from "../../utils/BarcodeGenerate";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#F9FAFB",
  padding: "16px 12px",
  borderRadius: "8px !important",
  border: "1px solid #EAECF0",
  cursor: "pointer",
}));
const PurchaseDetails = () => {
  const { id } = useParams();
  console.log("id", id);
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [tableDataList, setTableDataList] = useState({});
  const [page, setPage] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [searchProductText, setsearchProductText] = useState("");
  const [productList, setProductList] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [brandId, setBrandId] = useState([]);
  const [categoryId, setCategoryId] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const [detailDialog, setDetailDialog] = useState(false);
  const [details, setDetails] = useState([]);
  const [updateData, setUpdateData] = useState({});
  const [updateVariationLoading, setUpdateVariationLoading] = useState(false);
  const [generateSKUDetails, setGenerateSKUDetails] = useState({});
  const [generateSKULoading, setGenerateSKULoading] = useState(false);
  const [skuLoading, setSkuLoading] = useState(false);
  const [skuList, setSkuList] = useState([]);
  const [generateSkuData, setGenerateSkuData] = useState({});
  const [skuProductName, setSkuProductName] = useState("");

  const customeSelectFeild = {
    boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
    background: "#ffffff",

    "& label.Mui-focused": {
      color: "#E5E5E5",
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-input": {
      // padding: "10px 16px",
    },
    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px",
      "& fieldset": {
        borderColor: "#",
      },

      "&:hover fieldset": {
        borderColor: "#969696",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#969696",
      },
    },
  };
  const getProducts = async (searchText, catId, bId) => {
    setSearchLoading(true);
    let url;
    let newSearchProductText = searchProductText;

    let newCategoryId = categoryId;
    let newBrandId = brandId;
    if (searchText) {
      newSearchProductText = searchText;
    }
    if (catId) {
      newCategoryId = catId;
    }
    if (bId) {
      newBrandId = bId;
    }

    url = `/api/v1/sparePart?name=${newSearchProductText.trim()}&category_id=${newCategoryId}&brand_id=${newBrandId}`;

    let allData = await getDataWithToken(url);
    console.log("(allData?.data?.data products", allData?.data?.data);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setProductList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setSearchLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setSearchLoading(false);
  };

  const handleSelectedProduct = (row, item) => {
    if (selectedProducts.some((res) => res._id === item._id)) {
      setSelectedProducts(
        selectedProducts.filter((res) => res._id !== item._id)
      );
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          ...item,
          spare_parts_variation_id: row._id,
          quantity: "",
          price: "",
        },
      ]);
    }
  };
  const onProductSubmit = async (e) => {
    e.preventDefault();

    setUpdateVariationLoading(true);

    let data = {
      purchase_id: updateData.purchase_id,
      spare_parts_id: updateData.spare_parts_id,
      spare_parts_variation_id: updateData.spare_parts_variation_id,
      quantity: parseInt(updateData.quantity),
      unit_price: parseFloat(updateData.unit_price).toFixed(2),
      purchase_product_status: updateData.purchase_product_status,
    };

    let response = await handlePutData(
      `/api/v1/purchaseProduct/update/${updateData?._id}`,
      data,
      false
    );

    console.log("response", response);
    if (response?.status === 401) {
      logout();
      return;
    }
    if (response.status >= 200 && response.status < 300) {
      setUpdateVariationLoading(false);
      handleSnakbarOpen("Updated successfully", "success");
      getData(false);
      setUpdateData({});
    } else {
      setUpdateVariationLoading(false);
      handleSnakbarOpen(response?.data?.message, "error");
    }

    // }
  };
  const handleGenerateSKU = async (item) => {
    console.log("spare_part_details", item?.spare_part_details);

    setGenerateSKULoading(true);
    setGenerateSKUDetails(item);

    let data = {
      purchase_id: item.purchase_id,
      purchase_product_id: item._id,
      spare_parts_id: item.spare_parts_id,
      spare_parts_variation_id: item.spare_parts_variation_id,
      supplier_id: tableDataList[0]?.supplier_id,
      branch_id: tableDataList[0]?.branch_id,
      brand_id: item?.spare_part_details[0]?.brand_id,
      category_id: item?.spare_part_details[0]?.category_id,
      device_id: item?.spare_part_details[0]?.device_id,
      model_id: item?.spare_part_details[0]?.model_id,
      quantity: parseInt(item.quantity),
    };

    let response = await handlePostData(
      `/api/v1/sparePartsStock/create`,
      data,
      false
    );

    console.log("response", response);
    if (response?.status === 401) {
      logout();
      return;
    }
    if (response.status >= 200 && response.status < 300) {
      setGenerateSKULoading(false);
      handleSnakbarOpen("Generate SKU successfully", "success");
      getData(false);
      setGenerateSKUDetails({});
    } else {
      setGenerateSKUDetails({});
      setGenerateSKULoading(false);
      handleSnakbarOpen(response?.data?.message, "error");
    }

    // }
  };

  const handleDetailClose = () => {
    setDetails({});
    setDetailDialog(false);
  };
  const customeSelectFeildSmall = {
    boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
    background: "#ffffff",

    "& label.Mui-focused": {
      color: "#E5E5E5",
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-input": {
      padding: "6px 16px",
      fontSize: "14px",
    },

    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px",
      "& fieldset": {
        borderColor: "#",
      },

      "&:hover fieldset": {
        borderColor: "#969696",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#969696",
      },
    },
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

  // const customeTextFeild = {
  //   // padding: "15px 20px",
  //   // background: "#FAFAFA",
  //   "& label": {
  //     fontSize: "11px",
  //   },
  //   "& label.Mui-focused": {
  //     color: "#0F1624",
  //   },

  //   "& .MuiInput-underline:after": {
  //     borderBottomColor: "#B2BAC2",
  //   },
  //   "& .MuiOutlinedInput-input": {
  //     padding: "8px 12px",
  //   },
  //   "& .MuiOutlinedInput-root": {
  //     // paddingLeft: "24px",
  //     fontSize: "13px",
  //     "& fieldset": {
  //       // borderColor: "rgba(0,0,0,0)",
  //       borderRadius: "4px",
  //     },

  //     "&:hover fieldset": {
  //       borderColor: "#969696",
  //     },
  //     "&.Mui-focused fieldset": {
  //       borderColor: "#969696",
  //     },
  //   },
  // };

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

    for (let i = 0; i < 1; i++) {
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

  const getData = async (controlLoading) => {
    setLoading(controlLoading ?? true);

    let url = `/api/v1/purchase/${encodeURIComponent(id.trim())}`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data", allData?.data?.data);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setTableDataList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading(false);
  };
  const getSKU = async (item) => {
    console.log("item", item?.spare_part_variation_details[0]?.name);

    setGenerateSkuData(item);
    setSkuProductName(item?.spare_part_variation_details[0]?.name);
    setSkuLoading(true);
    setSkuList([]);

    let url = `/api/v1/sparePartsStock/stock-skus-details?sku_number=${encodeURIComponent(
      ""
    )}&stock_status=${encodeURIComponent(
      ""
    )}&spare_parts_id=${encodeURIComponent(
      item.spare_parts_id
    )}&spare_parts_variation_id=${encodeURIComponent(
      item.spare_parts_variation_id
    )}&branch_id=${encodeURIComponent(
      tableDataList[0]?.branch_id
    )}&purchase_id=${encodeURIComponent(
      item.purchase_id
    )}&purchase_product_id=${encodeURIComponent(item._id)}`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data", allData?.data?.data);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setSkuList(allData?.data?.data);
      setGenerateSkuData({});
      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setSkuLoading(false);
      setGenerateSkuData({});
      setGenerateSKULoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setSkuLoading(false);
  };

  // Handler for updating the updateData object
  const handleInputChange = (field, value) => {
    setUpdateData((prevData) => ({
      ...prevData,
      [field]: value, // Update the specific field
    }));
  };

  useEffect(() => {
    getData();
    // getCategoryList();
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
          marginTop: "40px",
        }}
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 1.5, mb: 1.75 }}
        >
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
            >
              Purchase Details
            </Typography>
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
                    Shipping Charge
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Items Grand total
                  </TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Purchase by
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Purchase Date
                  </TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>

                  <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {!loading && Object.keys(tableDataList).length !== 0 && (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ minWidth: "130px" }}>
                      {tableDataList?.name}
                    </TableCell>

                    <TableCell>
                      {tableDataList?.brand_data[0]?.name
                        ? tableDataList?.brand_data[0]?.name
                        : "---------"}
                    </TableCell>

                    <TableCell>
                      {tableDataList?.category_data[0]?.name
                        ? tableDataList?.category_data[0]?.name
                        : "---------"}
                    </TableCell>
                    <TableCell>
                      {tableDataList?.device_data[0]?.name
                        ? tableDataList?.device_data[0]?.name
                        : "---------"}
                    </TableCell>
                    <TableCell>
                      {tableDataList?.model_data[0]?.name
                        ? tableDataList?.model_data[0]?.name
                        : "---------"}
                    </TableCell>
                    <TableCell>
                      {tableDataList?.price
                        ? tableDataList?.price
                        : "---------"}
                    </TableCell>

                    <TableCell>
                      {tableDataList?.warranty
                        ? tableDataList?.warranty
                        : "---------"}
                    </TableCell>
                    <TableCell>
                      {tableDataList?.sparePart_id
                        ? tableDataList?.sparePart_id
                        : "---------"}
                    </TableCell>

                    <TableCell sx={{ minWidth: "150px" }}>
                      {tableDataList?.description
                        ? tableDataList?.remarks
                        : "---------"}
                    </TableCell>
                    <TableCell sx={{ minWidth: "150px" }}>
                      {tableDataList?.remarks
                        ? tableDataList?.remarks
                        : "---------"}
                    </TableCell>
                    <TableCell>
                      {tableDataList?.status ? (
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
                    <TableCell align="right">
                      <UpdatePurchase getData={getData} row={tableDataList} />
                    </TableCell>
                  </TableRow>
                )} */}

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
                              : "/noImage.png"
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
                        {row?.shipping_charge
                          ? row?.shipping_charge.toFixed(2)
                          : "---------"}
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
                              .toFixed(2) // Formats the final total to 2 decimal places
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

                      <TableCell align="right">
                        <UpdatePurchase getData={getData} row={tableDataList} />
                      </TableCell>
                    </TableRow>
                  ))}

                {!loading && tableDataList.length < 1 ? (
                  <TableRow>
                    <TableCell colSpan={15} style={{ textAlign: "center" }}>
                      <strong> {message}</strong>
                    </TableCell>
                  </TableRow>
                ) : null}
                {loading && pageLoading()}

                {/* {loading && pageLoading()} */}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          padding: "16px 0",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          marginTop: "20px",
        }}
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 1.5, mb: 1.75 }}
          spacing={2}
        >
          {/* <Grid size={{ xs: 6 }} sx={{ textAlign: "right" }}>
          
            <AddSparePartsVariation
              getData={getData}
              tableDataList={tableDataList}
            />
          </Grid> */}

          {/* <Grid size={8}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Search Product *
              </Typography>
              <TextField
                size="small"
                fullWidth
                id="searchProductText"
                placeholder="Search Product"
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                            stroke="#85888E"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ ...customeTextFeild }}
                value={searchProductText}
                onChange={(e) => {
                  setsearchProductText(e.target.value);
                  getProducts(e.target.value);
                }}
              />
            </Grid>
            <Grid size={2}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Category
              </Typography>

              <FormControl
                fullWidth
                size="small"
                sx={{
                  ...customeSelectFeild,
                  "& label.Mui-focused": {
                    color: "rgba(0,0,0,0)",
                  },

                  "& .MuiOutlinedInput-input img": {
                    position: "relative",
                    top: "2px",
                  },
                }}
              >
                {categoryId?.length < 1 && (
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "#b3b3b3", fontWeight: 300 }}
                  >
                    Select Category
                  </InputLabel>
                )}
                <Select
                  labelId="demo-simple-select-label"
                  id="categoryId"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 250, // Set the max height here
                      },
                    },
                  }}
                  value={categoryId}
                  // onChange={(e) => setCategoryId(e.target.value)}

                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    getProducts(null, e.target.value);
                  }}
                >
                  {categoryList
                    ?.filter((obj) => obj.name !== "Primary")
                    ?.map((item) => (
                      <MenuItem key={item?._id} value={item?._id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={2}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Brand
              </Typography>

              <FormControl
                fullWidth
                size="small"
                sx={{
                  ...customeSelectFeild,
                  "& label.Mui-focused": {
                    color: "rgba(0,0,0,0)",
                  },

                  "& .MuiOutlinedInput-input img": {
                    position: "relative",
                    top: "2px",
                  },
                }}
              >
                {brandId?.length < 1 && (
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "#b3b3b3", fontWeight: 300 }}
                  >
                    Select Brand
                  </InputLabel>
                )}
                <Select
                  labelId="demo-simple-select-label"
                  id="brandId"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 250, // Set the max height here
                      },
                    },
                  }}
                  value={brandId}
                  // onChange={(e) => setBrandId(e.target.value)}

                  onChange={(e) => {
                    setBrandId(e.target.value);
                    getProducts(null, null, e.target.value);
                  }}
                >
                  {brandList
                    ?.filter((obj) => obj.name !== "Primary")
                    ?.map((item) => (
                      <MenuItem key={item?._id} value={item?._id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid> */}
          <Grid size={12}>
            <Typography
              variant="base"
              gutterBottom
              sx={{ fontWeight: 500 }}
              onClick={() => console.log(updateData)}
            >
              All Product
            </Typography>
            {/* <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  {!searchLoading &&
                    productList.length > 0 &&
                    productList.map(
                      (row, rowIndex) =>
                        row?.variation_data?.length > 0 &&
                        row.variation_data.map((item, itemIndex) => (
                          <Grid
                            key={`row-${rowIndex}-item-${itemIndex}`}
                            item
                            size={3}
                          >
                            <Item
                              sx={{
                                border:
                                  selectedProducts.some(
                                    (pro) => pro?._id === item?._id
                                  ) && "1px solid #818FF8",
                              }}
                              onClick={() => handleSelectedProduct(row, item)}
                            >
                              {" "}
                              <Box sx={{ flexGrow: 1 }}>
                                <Grid container alignItems="center">
                                  <Grid size="auto" sx={{ width: "40px" }}>
                                    {" "}
                                    <img
                                      src={
                                        item?.images?.length > 0
                                          ? item?.images[0]?.url
                                          : "/noImage.png"
                                      }
                                      alt=""
                                      width={30}
                                      height={40}
                                    />
                                  </Grid>
                                  <Grid
                                    size="auto"
                                    sx={{ width: "Calc(100% - 40px)" }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography
                                        variant="medium"
                                        sx={{
                                          fontWeight: 500,
                                          color: "#344054",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          marginRight: 1, // Optional for spacing
                                        }}
                                      >
                                        {item?.name}
                                      </Typography>
                                      <Checkbox
                                        sx={{
                                          display: selectedProducts.some(
                                            (pro) => pro?._id === item?._id
                                          )
                                            ? "block"
                                            : "none",
                                        }}
                                        size="small"
                                        checked={true}
                                        inputProps={{
                                          "aria-label": "controlled",
                                        }}
                                      />
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Item>
                          </Grid>
                        ))
                    )}
                </Grid>
              </Box> */}

            <Grid size={12}>
              <Box
                sx={{
                  background: "#F9FAFB",
                  border: "1px solid #EAECF0",
                  borderRadius: "12px",
                  overflow: "hidden",
                  padding: "16px 0",
                  boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
                  p: 1.5,
                }}
              >
                <TableContainer>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Product Name
                        </TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Status
                        </TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Quantity
                        </TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Price
                        </TableCell>

                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Subtotal
                        </TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          SKU Actions
                        </TableCell>

                        <TableCell
                          align="right"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableDataList[0]?.purchase_products_data?.length > 0 ? (
                        tableDataList[0]?.purchase_products_data?.map(
                          (item, i) => (
                            <TableRow
                              sx={{
                                background: "#fff",
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell sx={{ minWidth: "130px" }}>
                                {" "}
                                {item?.spare_part_details[0]?.name}
                                <br />
                                <span style={{ color: "#424949" }}>
                                  {item?.spare_part_variation_details[0]?.name}
                                </span>
                              </TableCell>
                              <TableCell sx={{ minWidth: "130px" }}>
                                {updateData._id === item._id ? (
                                  <FormControl
                                    fullWidth
                                    size="small"
                                    sx={{
                                      ...customeSelectFeildSmall,
                                      "& label.Mui-focused": {
                                        color: "rgba(0,0,0,0)",
                                      },

                                      "& .MuiOutlinedInput-input img": {
                                        position: "relative",
                                        top: "2px",
                                      },
                                    }}
                                  >
                                    {updateData?.purchase_product_status
                                      ?.length < 1 && (
                                      <InputLabel
                                        id="demo-simple-select-label"
                                        sx={{
                                          color: "#b3b3b3",
                                          fontWeight: 300,
                                          fontSize: "14px",
                                        }}
                                      >
                                        Select Brand
                                      </InputLabel>
                                    )}
                                    <Select
                                      required
                                      labelId="demo-simple-select-label"
                                      id="purchase_product_status"
                                      MenuProps={{
                                        PaperProps: {
                                          sx: {
                                            maxHeight: 250, // Set the max height here

                                            "& .MuiMenuItem-root": {
                                              fontSize: "14px",
                                            },
                                          },
                                        },
                                      }}
                                      // value={purchaseStatus}
                                      // onChange={(e) =>
                                      //   setPurchaseStatus(e.target.value)
                                      // }

                                      value={
                                        updateData?.purchase_product_status ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          "purchase_product_status",
                                          e.target.value
                                        )
                                      }
                                    >
                                      {purchaseStatusList?.map((item) => (
                                        <MenuItem key={item} value={item}>
                                          {item}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                ) : (
                                  <Chip
                                    sx={{
                                      color:
                                        item.purchase_product_status ===
                                        "Transit"
                                          ? "#7527DA"
                                          : item.purchase_product_status ===
                                            "Hold"
                                          ? "#C81E1E"
                                          : item.purchase_product_status ===
                                            "Received"
                                          ? "#046C4E"
                                          : "#222",
                                      background:
                                        item.purchase_product_status ===
                                        "Transit"
                                          ? "#F5F3FF"
                                          : item.purchase_product_status ===
                                            "Hold"
                                          ? "#FDF2F2"
                                          : item.purchase_product_status ===
                                            "Received"
                                          ? "#F3FAF7"
                                          : "#222",
                                    }}
                                    label={item.purchase_product_status}
                                  />
                                )}
                              </TableCell>
                              <TableCell sx={{ minWidth: "10px" }}>
                                {updateData._id === item._id ? (
                                  <TextField
                                    required
                                    type="number"
                                    size="small"
                                    id="quantity"
                                    placeholder="Quantity"
                                    variant="outlined"
                                    sx={{
                                      ...customeTextFeild,
                                      "& .MuiOutlinedInput-input": {
                                        padding: "6.5px 12px",
                                        fontSize: "14px",
                                      },
                                      minWidth: "150px",
                                    }}
                                    value={updateData?.quantity || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "quantity",
                                        e.target.value
                                      )
                                    }
                                    onWheel={(e) => e.target.blur()}
                                  />
                                ) : (
                                  item.quantity
                                )}
                              </TableCell>
                              <TableCell sx={{ minWidth: "130px" }}>
                                {updateData._id === item._id ? (
                                  <TextField
                                    required
                                    type="number"
                                    size="small"
                                    id="unit_price"
                                    placeholder="Price"
                                    variant="outlined"
                                    sx={{
                                      ...customeTextFeild,
                                      "& .MuiOutlinedInput-input": {
                                        padding: "6.5px 12px",
                                        fontSize: "14px",
                                      },
                                      minWidth: "150px",
                                    }}
                                    value={updateData?.unit_price || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "unit_price",
                                        e.target.value
                                      )
                                    }
                                    onWheel={(e) => e.target.blur()}
                                  />
                                ) : (
                                  item.unit_price
                                )}
                              </TableCell>

                              <TableCell sx={{ minWidth: "130px" }}>
                                {updateData._id === item._id
                                  ? updateData?.quantity &&
                                    updateData?.unit_price
                                    ? parseInt(updateData?.quantity) *
                                      parseFloat(
                                        updateData?.unit_price
                                      ).toFixed(2)
                                    : 0
                                  : item?.quantity && item?.unit_price
                                  ? parseInt(item?.quantity) *
                                    parseFloat(item?.unit_price).toFixed(2)
                                  : 0}
                              </TableCell>
                              <TableCell sx={{ minWidth: "130px" }}>
                                {/* "Received" */}
                                {item.purchase_product_status === "Received" ? (
                                  <>
                                    {item?.is_sku_generated ? (
                                      <Button
                                        variant="outlined"
                                        color="info"
                                        size="small"
                                        disabled={skuLoading}
                                        sx={{
                                          minWidth: "138px",
                                          minHeight: "33px",
                                        }}
                                        startIcon={
                                          item?._id !==
                                            generateSkuData?._id && (
                                            <ListAltOutlinedIcon />
                                          )
                                        }
                                        onClick={() => {
                                          getSKU(item);
                                        }}
                                      >
                                        <PulseLoader
                                          color={"#1e88e5"}
                                          loading={
                                            skuLoading &&
                                            item?._id === generateSkuData?._id
                                          }
                                          size={10}
                                          speedMultiplier={0.5}
                                        />
                                        {item?._id !== generateSkuData?._id &&
                                          "Get SKU"}
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="small"
                                        disabled={generateSKULoading}
                                        sx={{
                                          minWidth: "138px",
                                          minHeight: "33px",
                                        }}
                                        startIcon={
                                          item?._id !==
                                            generateSKUDetails?._id && (
                                            <BallotOutlinedIcon />
                                          )
                                        }
                                        onClick={() => {
                                          handleGenerateSKU(item);
                                        }}
                                      >
                                        <PulseLoader
                                          color={"#7642af"}
                                          loading={
                                            generateSKULoading &&
                                            item?._id ===
                                              generateSKUDetails?._id
                                          }
                                          size={10}
                                          speedMultiplier={0.5}
                                        />
                                        {item?._id !==
                                          generateSKUDetails?._id &&
                                          "Generate SKU"}
                                      </Button>
                                    )}
                                  </>
                                ) : (
                                  "---------"
                                )}
                              </TableCell>
                              <TableCell
                                sx={{
                                  whiteSpace: "nowrap",
                                  textAlign: "right",
                                }}
                              >
                                {updateData._id === item._id ? (
                                  <>
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="text"
                                      disabled={updateVariationLoading}
                                      sx={{ mr: 1 }}
                                      onClick={() => {
                                        setUpdateData({});
                                      }}
                                    >
                                      {" "}
                                      Cancel
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      disabled={updateVariationLoading}
                                      sx={{
                                        minHeight: "33px",
                                        minWidth: "80px",
                                      }}
                                      onClick={onProductSubmit}
                                    >
                                      <PulseLoader
                                        color={"#4B46E5"}
                                        loading={updateVariationLoading}
                                        size={10}
                                        speedMultiplier={0.5}
                                      />{" "}
                                      {updateVariationLoading === false &&
                                        "Update"}
                                    </Button>
                                  </>
                                ) : (
                                  <IconButton
                                    variant="contained"
                                    // color="success"
                                    disableElevation
                                    disabled={
                                      item.purchase_product_status ===
                                      "Received"
                                    }
                                    onClick={() => setUpdateData(item)}
                                    sx={{
                                      opacity:
                                        item.purchase_product_status ===
                                          "Received" && 0.5,
                                    }}
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
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        )
                      ) : (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell colSpan={7} align="center">
                            No Product selected
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <Box
        sx={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",

          padding: "16px",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          marginTop: "20px",
        }}
      >
        <Typography
          variant="base"
          gutterBottom
          sx={{ fontWeight: 500 }}
          onClick={() => console.log(updateData)}
        >
          SKU and Barcode &nbsp;
          {skuList?.length > 0 && `of ${skuProductName} (${skuList?.length})`}
        </Typography>

        <BarcodeGenerate list={skuList} />
      </Box>
    </>
  );
};

export default PurchaseDetails;
