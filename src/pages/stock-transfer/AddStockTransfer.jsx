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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { Box, Divider, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { getDataWithToken } from "../../services/GetDataService";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import Checkbox from "@mui/material/Checkbox";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextEditor from "../../utils/TextEditor";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TableContainer } from "@mui/material";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";

import { handlePostData } from "../../services/PostDataService";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px 24px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#EAECF0",
  borderStyle: "dashed",
  backgroundColor: "#fff",
  // color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  borderRadius: "12px",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#F9FAFB",
  padding: "16px 12px",
  borderRadius: "8px !important",
  border: "1px solid #EAECF0",
  cursor: "pointer",
}));
const AddStockTransfer = ({ clearFilter }) => {
  const navigate = useNavigate();
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const myBranchId = jwtDecode(ifixit_admin_panel?.token)?.user?.branch_id;
  const [addDialog, setAddDialog] = useState(false);
  const [supplierList, setSupplierList] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [branchList, setBranchList] = useState([]);
  const [transferFrom, setTransferFrom] = useState(myBranchId);
  const [transferTo, setTransferTo] = useState("");

  const [purchaseDate, setPurchaseDate] = useState(null);
  const [shippingCharge, setShippingCharge] = useState("");

  const [note, setNote] = useState("");

  const [branch, setBranch] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [invoiceNo, setInvoiceNo] = useState("");
  const [searchProductText, setsearchProductText] = useState("");
  const [productList, setProductList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [purchaseBy, setPurchaseBy] = useState("");
  const [userList, setUserList] = useState([]);

  const [brandId, setBrandId] = useState([]);
  const [categoryId, setCategoryId] = useState([]);

  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");

  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [details, setDetails] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
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
    if (transferFrom.length < 1) {
      return handleSnakbarOpen("Please select transfer from", "error");
    }
    if (transferTo.length < 1) {
      return handleSnakbarOpen("Please select transfer to", "error");
    }
    if (productList.length < 1) {
      return handleSnakbarOpen("Please enter product", "error");
    }
    setLoading(true);

    // var formdata = new FormData();
    // formdata.append("name", name);

    // formdata.append("parent_id", parent_id);
    const skus = productList.map((product) => parseInt(product?.sku_number));

    let data = {
      transfer_from: transferFrom,
      transfer_to: transferTo,
      shipping_charge: shippingCharge ? parseInt(shippingCharge) : 0,
      remarks: note,
      transfer_stocks_sku: skus,
    };
    console.log("data", data);

    let response = await handlePostData(
      "/api/v1/transferStock/create",
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
      setProductList([]);
      setTransferFrom("");
      setTransferTo("");
      setShippingCharge("");
      setNote("");
      navigate("/stock-transfer-list");
    } else {
      setLoading(false);
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
  const custopDatePickerFeild = {
    boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
    background: "#ffffff",

    "& .MuiInputBase-root": {
      fontSize: "0.875rem", // Adjust font size for a smaller appearance
      height: "2.5rem",
    },

    "& label.Mui-focused": {
      color: "#E5E5E5",
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },

    "& .MuiOutlinedInput-input": {
      // padding: "10px 16px", (uncomment if needed)
    },

    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px", (uncomment if needed)
      "& fieldset": {
        borderColor: "#", // Update with a specific color if needed
      },

      "&:hover fieldset": {
        borderColor: "#969696",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#969696",
      },
    },
  };
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

  const getProducts = async () => {
    // e.preventDefault();
    setSearchLoading(true);
    let url;

    url = `/api/v1/sparePartsStock?sku_number=${parseInt(searchProductText)}`;

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
          } else if (allData?.data?.data[0]?.stock_status !== "Returned") {
            console.log("*************************");

            setProductList([
              { ...allData?.data?.data[0], note: "" },
              ...productList,
            ]);
            setsearchProductText("");
          } else {
            handleSnakbarOpen("This product is already returned", "error");
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
    //       spare_parts_id: item.spare_parts_id,
    //       spare_parts_variation_id: item._id,
    //       purchase_product_status: "",
    //       quantity: "",
    //       unit_price: "",
    //     },
    //   ]);
    // }
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
    // getDropdownList();
    // getCategoryList();
    // getBrandList();
    getBranchList();
  }, []);
  return (
    <>
      <Box container sx={{ padding: "24px 0" }}>
        <Typography
          variant="h6"
          gutterBottom
          component="div"
          sx={{ color: "#0F1624", fontWeight: 600 }}
        >
          Add Stock Transfer
        </Typography>
      </Box>
      <div>
        <div
          style={{
            background: "#fff",
            border: "1px solid #EAECF1",
            borderRadius: "12px",
            overflow: "hidden",
            padding: "20px",
            boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          }}
        >
          <Grid container spacing={2}>
            {/* <Grid size={6}>
            <Typography
              variant="medium"
              color="text.main"
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              Purchase date*
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                id="purchaseDate"
                sx={{
                  width: "100%",
                  ...custopDatePickerFeild,
                }}
                // label="Controlled picker"
                format="DD/MM/YYYY"
                maxDate={dayjs()}
                value={purchaseDate}
                onChange={(newValue) => {
                  setPurchaseDate(newValue);
                }}
              />
            </LocalizationProvider>
          </Grid> */}

            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Transfer From *
              </Typography>

              <FormControl
                fullWidth
                size="small"
                sx={{
                  ...customeSelectFeild,
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
                {transferFrom.length < 1 && (
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "#b3b3b3", fontWeight: 300 }}
                  >
                    Select Transfer From
                  </InputLabel>
                )}
                <Select
                  disabled
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
                  value={transferFrom}
                  onChange={(e) => setTransferFrom(e.target.value)}
                >
                  {branchList?.map((item) => (
                    <MenuItem key={item?._id} value={item?._id}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Transfer To *
              </Typography>

              <FormControl
                required
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
                {transferTo.length < 1 && (
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "#b3b3b3", fontWeight: 300 }}
                  >
                    Select Transfer To
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
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                >
                  {branchList
                    ?.filter((res) => res._id !== myBranchId)
                    ?.map((item) => (
                      <MenuItem key={item?._id} value={item?._id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Shipping Charges
              </Typography>
              <TextField
                required
                type="number"
                size="small"
                fullWidth
                id="name"
                placeholder="Shipping Charges"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 2 }}
                value={shippingCharge}
                onChange={(e) => {
                  setShippingCharge(e.target.value);
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
                Additional Notes
              </Typography>
              <TextField
                size="small"
                fullWidth
                id="name"
                placeholder="Additional Notes"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 2 }}
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
            </Grid>
          </Grid>
          <Box
            sx={{ background: "#F9FAFB", padding: "12px", margin: "16px 0px" }}
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
                    // getProducts(e.target.value);
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
                  // type="submit"
                >
                  Search
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
                </Box>
              </Grid>
            </Grid>
          </Box>
        </div>

        <Box
          sx={{
            mt: 1,
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
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 2, xl: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
              >
                List ({productList?.length})
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
            <TableContainer sx={{ height: "Calc(100vh - 590px)" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Product Name
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Purchase date
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Branch
                    </TableCell>

                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      Purchase price
                    </TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>
                      SKU Number
                    </TableCell>
                    {/* <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell> */}
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
                  {!loading &&
                    productList.length > 0 &&
                    productList.map((row, i) => (
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
                          {row?.sparepart_data
                            ? row?.sparepart_data[0]?.name
                            : "---------"}{" "}
                          &nbsp;{" "}
                          {row?.spare_parts_variation_data
                            ? row?.spare_parts_variation_data[0]?.name
                            : "---------"}
                        </TableCell>

                        <TableCell>
                          {moment(row?.purchase_data[0]?.purchase_date).format(
                            "DD/MM/YYYY"
                          )}
                        </TableCell>
                        <TableCell>
                          {row?.branch_data
                            ? row?.branch_data[0]?.name
                            : "---------"}
                        </TableCell>
                        <TableCell sx={{ minWidth: "130px" }}>
                          {row?.purchase_products_data
                            ? row?.purchase_products_data[0]?.unit_price
                            : "---------"}
                        </TableCell>
                        <TableCell>{row?.sku_number}</TableCell>
                        {/* <TableCell>
                        {" "}
                        <TextField
                          required
                          size="small"
                          id="name"
                          placeholder="Enter Note"
                          variant="outlined"
                          sx={{
                            ...customeTextFeild,
                            "& .MuiOutlinedInput-input": {
                              padding: "6.5px 12px",
                              fontSize: "14px",
                            },
                            minWidth: "150px",
                          }}
                          value={row?.note || ""}
                          onChange={(e) => {
                            const updatedRows = [...productList];
                            updatedRows[i].note = e.target.value;
                            setProductList(updatedRows);
                          }}
                        />
                      </TableCell> */}
                        <TableCell align="right">
                          <IconButton
                            onClick={() =>
                              setProductList(
                                productList?.filter(
                                  (res) => res.sku_number !== row?.sku_number
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
            <Box
              sx={{
                px: 2,
                pt: 1,
                textAlign: "right",
                borderTop: "1px solid #EAECF0",
              }}
            >
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
                Cancel
              </Button>
              &nbsp;
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

                disableElevation
                onClick={onSubmit}
              >
                <PulseLoader
                  color={"#4B46E5"}
                  loading={loading}
                  size={10}
                  speedMultiplier={0.5}
                />{" "}
                {loading === false && "Submit"}
              </Button>
            </Box>
          </div>
        </Box>
      </div>
    </>
  );
};

export default AddStockTransfer;
