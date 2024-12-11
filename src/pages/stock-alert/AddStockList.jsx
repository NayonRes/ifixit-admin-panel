import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
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
import {
  customerTypeList,
  designationList,
  paymentStatusList,
  purchaseStatusList,
  ratingList,
  roleList,
} from "../../data";
import { handlePostData } from "../../services/PostDataService";

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
const AddStockList = ({ clearFilter }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState(null);
  const [addDialog, setAddDialog] = useState(false);
  const [name, setName] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [branchList, setBranchList] = useState([]);
  const [branch, setBranch] = useState("");
  const [convertedContent, setConvertedContent] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paidAmount, setPaidAmount] = useState();
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [shippingCharge, setShippingCharge] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [searchProductText, setsearchProductText] = useState("");
  const [productList, setProductList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [purchaseBy, setPurchaseBy] = useState("");
  const [userList, setUserList] = useState([]);

  const [brandId, setBrandId] = useState([]);
  const [categoryId, setCategoryId] = useState([]);
  const [deviceId, setDeviceId] = useState([]);
  const [modelId, setModelId] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [warranty, setWarranty] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");

  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);

  const [variationList, setVariationList] = useState([]);

  const [message, setMessage] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setAddDialog(false);
    }
    clearForm();
  };

  const dropzoneRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    console.log("onDrop", acceptedFiles);

    // if (!dropzoneRef.current) return;
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // setBase64String(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);
  const onFileDialogCancel = useCallback(() => {
    setFile(null);
    console.log("File dialog was closed without selecting a file");
    // setBase64String(""); // Update state to indicate dialog was cancelled
  }, []);
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    onFileDialogCancel,
    ref: dropzoneRef,
    accept: { "image/*": [] },
    maxFiles: 1,
  });
  const files = acceptedFiles.map((file) => (
    <>
      {file.path} - {file.size} bytes
    </>
  ));
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );
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
    setSupplier("");
    setPurchaseDate(null);
    setPurchaseStatus("");
    setPaymentStatus("");
    setBrandId("");
    setCategoryId("");
    setPrice("");
    setShippingCharge("");
    setBranch("");
    setPurchaseBy("");
    setsearchProductText("");
    setProductList([]);
    setSelectedProducts([]);
    setRemarks("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!purchaseDate) {
      handleSnakbarOpen("Please select a purchase date", "error");
      return;
    }
    let newSelectedProduct = [];
    if (selectedProducts?.length < 1) {
      handleSnakbarOpen("Please select purchase product", "error");
      return;
    } else {
      newSelectedProduct = selectedProducts?.map((item, i) => ({
        spare_parts_id: item.spare_parts_id,
        spare_parts_variation_id: item.spare_parts_variation_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        purchase_product_status: item.purchase_product_status,
      }));
    }

    const formData = new FormData();
    // const selectedDateWithTime = dayjs(purchaseDate).toDate();
    formData.append("supplier_id", supplier);
    formData.append("user_id", purchaseBy);
    formData.append("purchase_date", dayjs(purchaseDate).toDate());
    formData.append("purchase_status", purchaseStatus);
    formData.append("payment_status", paymentStatus);
    formData.append("branch_id", branch);
    formData.append("shipping_charge", parseFloat(shippingCharge).toFixed(2));

    formData.append("remarks", remarks);
    formData.append("selectedProducts", JSON.stringify(selectedProducts));

    let response = await handlePostData(
      "/api/v1/purchase/create",
      formData,
      true
    );

    console.log("response", response?.data?.data?._id);

    if (response.status >= 200 && response.status < 300) {
      // await handleCreateSpareParts(variationList, response?.data?.data?._id);
      setLoading(false);
      handleSnakbarOpen("Added successfully", "success");
      clearFilter();
      clearForm();
      handleDialogClose();
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

  const getBrandList = async () => {
    setLoading2(true);

    let url = `/api/v1/brand/dropdownlist`;
    let allData = await getDataWithToken(url);

    if (allData.status >= 200 && allData.status < 300) {
      setBrandList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    }
    setLoading2(false);
  };

  const getSupplierList = async () => {
    setLoading2(true);

    let url = `/api/v1/supplier/dropdownlist`;
    let allData = await getDataWithToken(url);

    if (allData.status >= 200 && allData.status < 300) {
      setSupplierList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    }
    setLoading2(false);
  };
  const getBranchList = async () => {
    setLoading2(true);

    let url = `/api/v1/branch/dropdownlist`;
    let allData = await getDataWithToken(url);

    if (allData.status >= 200 && allData.status < 300) {
      setBranchList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    }
    setLoading2(false);
  };
  const getUserList = async () => {
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

  const getCategoryList = async () => {
    setLoading2(true);

    let url = `/api/v1/category/dropdownlist`;
    let allData = await getDataWithToken(url);

    if (allData.status >= 200 && allData.status < 300) {
      setCategoryList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    }
    setLoading2(false);
  };
  const getDeviceList = async () => {
    setLoading2(true);

    let url = `/api/v1/device/dropdownlist`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data", allData?.data?.data);

    if (allData.status >= 200 && allData.status < 300) {
      setDeviceList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    }
    setLoading2(false);
  };
  const getModelList = async (id) => {
    setLoading2(true);

    let url = `/api/v1/model/device-model?deviceId=${id}`;
    let allData = await getDataWithToken(url);

    if (allData.status >= 200 && allData.status < 300) {
      setModelList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    }
    setLoading2(false);
  };

  const handleDeviceSelect = (e) => {
    setDeviceId(e.target.value);
    setModelId("");
    getModelList(e.target.value);
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

    if (allData.status >= 200 && allData.status < 300) {
      setProductList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    }
    setSearchLoading(false);
  };
  const handleSelectedProduct = (item) => {
    console.log("item", item);

    if (selectedProducts.some((res) => res._id === item._id)) {
      setSelectedProducts(
        selectedProducts.filter((res) => res._id !== item._id)
      );
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          ...item,
          spare_parts_id: item.spare_parts_id,
          spare_parts_variation_id: item._id,
          purchase_product_status: "",
          quantity: "",
          unit_price: "",
        },
      ]);
    }
  };
  useEffect(() => {
    // getDropdownList();
  }, []);
  return (
    <>
      {/* <Button
        variant="contained"
        disableElevation
        sx={{ py: 1.125, px: 2, borderRadius: "6px" }}
        onClick={() => {
          setAddDialog(true);
          getSupplierList();
          getCategoryList();
          getBranchList();
          getBrandList();
          getUserList();
          // getBrandList();
          // getDeviceList();
          // getDropdownList();
        }}
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
        Add Purchase
      </Button> */}

      <Box container sx={{ padding: "24px 0" }}>
        <Typography
          variant="h6"
          gutterBottom
          component="div"
          sx={{ color: "#0F1624", fontWeight: 600 }}
        >
          Add Stock Alert
        </Typography>
      </Box>

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
         
         
          <Grid size={8}>
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
      </div>
    </>
  );
};

export default AddStockList;
