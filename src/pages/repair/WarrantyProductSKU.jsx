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
import { useNavigate } from "react-router-dom";
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

const WarrantyProductSKU = ({ row }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [addDialog, setAddDialog] = useState(false);

  const [tableDataList, setTableDataList] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);

  const myBranchId = jwtDecode(ifixit_admin_panel?.token)?.user?.branch_id;

  const [searchProductText, setsearchProductText] = useState("");
  const [productList, setProductList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [details, setDetails] = useState("");
  const [removeSkuDetails, setRemoveSkuDetails] = useState();
  const [removeSKUDialog, setRemoveSKUDialog] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [stockStatus, setStockStatus] = useState("");
  const [stockRemarks, setStockRemarks] = useState("");

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#F9FAFB",
    padding: "16px 12px",
    borderRadius: "8px !important",
    border: "1px solid #EAECF0",
    cursor: "pointer",
  }));

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
  const handleRemoveSKUDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setRemoveSKUDialog(false);
      setRemoveSkuDetails({});
    }
  };

  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setProductList([]);
      setAddDialog(false);
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

  const onSubmit = async (e) => {
    e.preventDefault();

    if (productList?.length < 1) {
      handleSnakbarOpen("Please add at least one product", "error");
      return;
    }
    setLoading(true);
    let data = {
      repair_id: row?._id,

      sku_numbers: productList?.map((item) => item.sku_number),
    };
    console.log("data", data);

    let response = await handlePostData(
      "/api/v1/repairAttachedSpareparts/create",
      data,
      false
    );

    console.log("response", response);
    if (response?.status === 401) {
      logout();
      return;
    }
    if (response.status >= 200 && response.status < 300) {
      setLoading(false);
      handleSnakbarOpen("Added successfully", "success");

      handleDialogClose();
    } else {
      setLoading(false);
      handleSnakbarOpen(response?.data?.message, "error");
    }
  };
  const onRemove = async (e) => {
    e.preventDefault();

    setRemoveLoading(true);
    let data = {
      repair_attached_stock_id: removeSkuDetails?._id,

      sku_number: removeSkuDetails?.sku_number,
      remarks: stockRemarks,
      stockStatus: stockStatus,
    };
    console.log("data", data);

    let response = await handlePostData(
      "/api/v1/repairAttachedSpareparts/remove-stock-adjustment",
      data,
      false
    );

    console.log("response", response);
    if (response?.status === 401) {
      logout();
      return;
    }
    if (response.status >= 200 && response.status < 300) {
      setRemoveLoading(false);
      getData();
      handleRemoveSKUDialogClose();
      handleSnakbarOpen("Remove successfully", "success");
    } else {
      setRemoveLoading(false);
      handleSnakbarOpen(response?.data?.message, "error");
    }

    // }
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

  const getProducts = async () => {
    setSearchLoading(true);
    let url;

    url = `/api/v1/stock?sku_number=${parseInt(searchProductText)}`;

    let allData = await getDataWithToken(url);
    console.log("(allData?.data?.data products", allData?.data?.data);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setSearchLoading(false);

      if (allData?.data?.data.length > 0) {
        const isSkuPresent = productList.some(
          (product) =>
            parseInt(product.sku_number) === allData?.data?.data[0]?.sku_number
        );
        console.log("isSkuPresent", isSkuPresent);

        if (!isSkuPresent) {
          if (allData?.data?.data[0]?.branch_id !== myBranchId) {
            handleSnakbarOpen("This is not your branch product", "error");
          } else if (allData?.data?.data[0]?.stock_status === "Available") {
            console.log("*************************");

            setProductList([
              { ...allData?.data?.data[0], note: "" },
              ...productList,
            ]);
            setsearchProductText("");
          } else {
            handleSnakbarOpen(
              "This product is not available for attached",
              "error"
            );
          }
        } else {
          handleSnakbarOpen("This product is already in the list", "error");
        }
      }

      if (allData.data.data.length < 1) {
        handleSnakbarOpen("No product found", "error");
      }
    } else {
      setSearchLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
  };
  const getPreviousProducts = async (sku) => {
    let url;
    let result = {};
    url = `/api/v1/stock?sku_number=${parseInt(sku)}`;

    let allData = await getDataWithToken(url);
    console.log("(allData?.data?.data products", allData?.data?.data);
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
  const handleSelectedProduct = (item) => {
    console.log("item", item);
    setDetails(item);
    setAddDialog(true);

    // if (selectedProducts.some((res) => res._id === item._id)) {
    //   setSelectedProducts(
    //     selectedProducts.filter((res) => res._id !== item._id)
    //   );
    // } else {
    //   setSelectedProducts([
    //     ...selectedProducts,
    //     {
    //       ...item,
    //       product_id: item.product_id,
    //       product_variation_id: item._id,
    //       purchase_product_status: "",
    //       quantity: "",
    //       unit_price: "",
    //     },
    //   ]);
    // }
  };

  const getData = async () => {
    setLoading2(true);

    let url = `/api/v1/repairAttachedSpareparts?repair_id=${row?._id}&is_warranty_claimed_sku=false&status=true`;

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
  const isDateAfterMonths = (createdAt, monthsToAdd) => {
    console.log("createdAt", createdAt);
    console.log("monthsToAdd", monthsToAdd);

    const newDate = dayjs(createdAt).add(monthsToAdd, "month");
    return newDate.isAfter(dayjs());
  };
  useEffect(() => {
    // getDropdownList();
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
        PaperProps={{
          component: "form",
          onSubmit: onSubmit,
        }}
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
              mb: 1,
            }}
          >
            <Box sx={{ padding: "12px", margin: "16px 16px 8px" }}>
              <Grid container spacing={2}>
                <Grid size={4}>
                  <Typography
                    variant="medium"
                    color="text.main"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    Job / Invoice No :{" "}
                    <b>{row?.repair_id ? row?.repair_id : "---------"}</b>
                  </Typography>
                  <Typography
                    variant="medium"
                    color="text.main"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                  >
                    Job / Invoice Date :{" "}
                    <b>{dayjs(row?.created_at).format("DD MMM YYYY")}</b>
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
                      {row?.customer_data?.length > 0
                        ? row?.customer_data[0]?.name
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
                      {row?.customer_data?.length > 0
                        ? row?.customer_data[0]?.mobile
                        : "---------"}
                    </b>
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{
                mx: 1,
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
                    variant="h6"
                    gutterBottom
                    component="div"
                    sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
                    onClick={() => console.log("tableDataList", tableDataList)}
                  >
                    Atteched List ({tableDataList?.length})
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
                  <Table stickyHeader aria-label="sticky table">
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
                            <TableCell style={{ whiteSpace: "nowrap" }}>
                              {isDateAfterMonths(
                                row?.created_at,

                                item?.product?.product_data[0]?.warranty
                              ) ? (
                                <Button
                                  variant="outlined"
                                  color="success"
                                  endIcon={
                                    <svg
                                      width="20"
                                      height="20"
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
                                  endIcon={
                                    <svg
                                      width="20"
                                      height="20"
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
          <div
            style={{
              background: "#fff",
              border: "1px solid #EAECF1",
              borderRadius: "12px",
              // overflow: "hidden",
              padding: "20px",
              boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
            }}
          >
            <Typography
              variant="medium"
              color="text.main"
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              Search SKU Number *
            </Typography>

            <Grid container spacing={2}>
              <Grid size={10}>
                <TextField
                  size="small"
                  fullWidth
                  id="searchProductText"
                  placeholder="Search SKU Number"
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
                  }}
                />
              </Grid>
              <Grid size={2}>
                <Button
                  fullWidth
                  variant="contained"
                  disableElevation
                  color="info"
                  sx={{ py: "4px", minHeight: "40px" }}
                  size="small"
                  startIcon={<SearchIcon />}
                  onClick={() => getProducts()}
                  disabled={searchLoading}
                >
                  <PulseLoader
                    color={"#4B46E5"}
                    loading={searchLoading}
                    size={10}
                    speedMultiplier={0.5}
                  />{" "}
                  {searchLoading === false && "Search"}
                </Button>
              </Grid>

              <Grid size={12}>
                <Box sx={{ flexGrow: 1 }}>
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
                                onClick={() => handleSelectedProduct(item)}
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
                                            : "/noImage.jpg"
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
                </Box>
              </Grid>
            </Grid>
          </div>

          <Box
            sx={{
              mt: 1,
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
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
                >
                  New Added List ({productList?.length})
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
                <Table stickyHeader aria-label="sticky table">
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

                      <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productList.length > 0 &&
                      productList.map((item, i) => (
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
                            {item?.product_data
                              ? item?.product_data[0]?.name
                              : "---------"}{" "}
                            &nbsp;{" "}
                            {item?.product_variation_data
                              ? item?.product_variation_data[0]?.name
                              : "---------"}
                          </TableCell>

                          {/* <TableCell>
                            {moment(
                              item?.purchase_data[0]?.purchase_date
                            ).format("DD/MM/YYYY")}
                          </TableCell> */}
                          {/* <TableCell>
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

                          <TableCell align="right">
                            <IconButton
                              onClick={() =>
                                setProductList(
                                  productList?.filter(
                                    (res) => res.sku_number !== item?.sku_number
                                  )
                                )
                              }
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
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2 }}>
          <Button
            variant="outlined"
            onClick={handleDialogClose}
            sx={{
              px: 2,
              py: 1.25,
              fontSize: "14px",
              fontWeight: 600,
              color: "#344054",
              border: "1px solid #D0D5DD",
              boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            type="submit"
            sx={{
              px: 2,
              py: 1.25,
              fontSize: "14px",
              fontWeight: 600,
              minWidth: "127px",
              minHeight: "44px",
            }}
            // style={{ minWidth: "180px", minHeight: "35px" }}
            autoFocus
            disableElevation
          >
            <PulseLoader
              color={"#4B46E5"}
              loading={loading}
              size={10}
              speedMultiplier={0.5}
            />{" "}
            {loading === false && "Save changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={removeSKUDialog}
        onClose={handleRemoveSKUDialogClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "16px", // Customize the border-radius here
          },
        }}
        PaperProps={{
          component: "form",
          onSubmit: onRemove,
        }}
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
          Remove Spareparts
          <IconButton
            sx={{ position: "absolute", right: 0, top: 0 }}
            onClick={handleRemoveSKUDialogClose}
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
            maxWidth: "600px",
            minWidth: "600px",
            px: 2,
            borderBottom: "1px solid #EAECF1",
            my: 1,
          }}
        >
          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Stock Adjudtment Status *
          </Typography>

          <FormControl
            fullWidth
            size="small"
            sx={{
              ...customeSelectFeild,
              mb: 3,
              "& label.Mui-focused": {
                color: "rgba(0,0,0,0)",
              },

              "& .MuiOutlinedInput-input img": {
                position: "relative",
                top: "2px",
              },
            }}
          >
            {stockStatus.length < 1 && (
              <InputLabel
                id="demo-simple-select-label"
                sx={{ color: "#b3b3b3", fontWeight: 300 }}
              >
                Stock Adjudtment Status
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
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
            >
              <MenuItem value={"Available"}>Available</MenuItem>
              <MenuItem value={"Abnormal"}>Abnormal</MenuItem>
            </Select>
          </FormControl>

          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Note
          </Typography>

          <TextField
            size="small"
            fullWidth
            id="name"
            placeholder="Enter Note"
            variant="outlined"
            multiline
            rows={2}
            sx={{ ...customeTextFeild, mb: 2 }}
            value={stockRemarks}
            onChange={(e) => {
              setStockRemarks(e.target.value);
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 2 }}>
          <Button
            variant="outlined"
            onClick={handleRemoveSKUDialogClose}
            sx={{
              px: 2,
              py: 1.25,
              fontSize: "14px",
              fontWeight: 600,
              color: "#344054",
              border: "1px solid #D0D5DD",
              boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={removeLoading}
            type="submit"
            sx={{
              px: 2,
              py: 1.25,
              fontSize: "14px",
              fontWeight: 600,
              minWidth: "127px",
              minHeight: "44px",
            }}
            // style={{ minWidth: "180px", minHeight: "35px" }}
            autoFocus
            disableElevation
          >
            <PulseLoader
              color={"#F23836"}
              loading={removeLoading}
              size={10}
              speedMultiplier={0.5}
            />{" "}
            {removeLoading === false && "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WarrantyProductSKU;
