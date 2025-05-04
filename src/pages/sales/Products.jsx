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

import { Box, Chip, Divider, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
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
  paymentMethodList,
  paymentStatusList,
  purchaseStatusList,
  ratingList,
  roleList,
} from "../../data";
import { handlePostData } from "../../services/PostDataService";
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
const Products = ({ clearFilter }) => {
  const navigate = useNavigate();
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const myBranchId = jwtDecode(ifixit_admin_panel?.token)?.user?.branch_id;
  const [value, setValue] = useState(null);
  const [addDialog, setAddDialog] = useState(false);
  const [name, setName] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [branchList, setBranchList] = useState([]);
  const [branch, setBranch] = useState(myBranchId);
  const [convertedContent, setConvertedContent] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paidAmount, setPaidAmount] = useState();
  const [paymentMethod, setPaymentMethod] = useState("");
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
    setPaymentMethod("");
    setPaidAmount("");
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
      setLoading(false);
      return;
    }
    let newSelectedProduct = [];
    if (selectedProducts?.length < 1) {
      handleSnakbarOpen("Please select purchase product", "error");
      setLoading(false);
      return;
    } else {
      newSelectedProduct = selectedProducts?.map((item, i) => ({
        product_id: item.product_id,
        product_variation_id: item.product_variation_id,
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
    formData.append("payment_method", paymentMethod);
    formData.append("paid_amount", paidAmount ? paidAmount : 0);
    formData.append("shipping_charge", parseFloat(shippingCharge).toFixed(2));

    formData.append("remarks", remarks);
    formData.append("selectedProducts", JSON.stringify(selectedProducts));

    let response = await handlePostData(
      "/api/v1/purchase/create",
      formData,
      true
    );

    console.log("response", response?.data?.data?._id);
    if (response?.status === 401) {
      logout();
      return;
    }
    if (response.status >= 200 && response.status < 300) {
      // await handleCreateSpareParts(variationList, response?.data?.data?._id);
      setLoading(false);
      handleSnakbarOpen("Added successfully", "success");
      // clearFilter();
      clearForm();
      handleDialogClose();
      navigate("/purchase-list");
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
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setBrandList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };

  const getSupplierList = async () => {
    setLoading2(true);

    let url = `/api/v1/supplier/dropdownlist`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setSupplierList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
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
  const getUserList = async () => {
    setLoading2(true);

    let url = `/api/v1/user/dropdownlist`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setUserList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };

  const getCategoryList = async () => {
    setLoading2(true);

    let url = `/api/v1/category/dropdownlist`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setCategoryList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };
  const getDeviceList = async () => {
    setLoading2(true);

    let url = `/api/v1/device/dropdownlist`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data", allData?.data?.data);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setDeviceList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };
  const getModelList = async (id) => {
    setLoading2(true);

    let url = `/api/v1/model/device-model?deviceId=${id}`;
    // let url = `/api/v1/model/dropdownlist`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setModelList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };
  const getLastPurchaseItem = async (id) => {
    setLoading2(true);

    let url = `/api/v1/purchaseProduct/last-purchase?product_variation_id=${id}`;
    let allData = await getDataWithToken(url);
    console.log("last purchase item", allData?.data?.data[0]?.unit_price);
    let last_purchase_price = allData?.data?.data[0]?.unit_price;
    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      // setModelList(allData?.data?.data);
      // return allData?.data?.data[0]?.unit_price;
      // if (allData.data.data.length < 1) {
      //   setMessage("No data found");
      // }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
    return last_purchase_price;
  };

  const handleDeviceSelect = (e) => {
    setDeviceId(e.target.value);
    setModelId("");
    // getModelList(e.target.value);
  };

  const getProducts = async (searchText, bId, dId, mId, catId) => {
    setSearchLoading(true);
    let url;
    let newSearchProductText = searchProductText;
    let newBrandId = brandId;
    let newDeviceId = deviceId;
    let newModelId = modelId;
    let newCategoryId = categoryId;
    if (searchText) {
      newSearchProductText = searchText;
    }
    if (bId) {
      newBrandId = bId;
    }
    if (dId) {
      newDeviceId = dId;
    }
    if (mId) {
      newModelId = mId;
    }
    if (catId) {
      newCategoryId = catId;
    }

    url = `/api/v1/product?name=${newSearchProductText.trim()}&category_id=${newCategoryId}&brand_id=${newBrandId}&device_id=${newDeviceId}&model_id=${newModelId}`;

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
  const handleSelectedProduct = async (item, row) => {
    console.log("item", item);

    // product_id: element._id,
    //     product_variation_id: element.product_variation_id,
    //     quantity: element.quantity,
    //     unit_price: element.unit_price,
    //     purchase_product_status: element.purchase_product_status,
    if (selectedProducts.some((res) => res._id === item._id)) {
      setSelectedProducts(
        selectedProducts.filter((res) => res._id !== item._id)
      );
    } else {
      const lastPurchasePrice = await getLastPurchaseItem(item._id);
      setSelectedProducts([
        ...selectedProducts,
        {
          ...item,
          spare_parts_name: row.name,
          product_id: item.product_id,
          product_variation_id: item._id,
          purchase_product_status: "",
          quantity: "",
          unit_price: "",
          last_purchase_price: lastPurchasePrice,
        },
      ]);
    }
  };
  useEffect(() => {
    getSupplierList();
    getCategoryList();
    getBranchList();
    getBrandList();
    getUserList();
    // getBrandList();
    getDeviceList();
    // getModelList();
    // getDropdownList();
  }, []);
  return (
    <>
      <Grid container columnSpacing={3} style={{ padding: "24px 0" }}>
        <Grid size={6}>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ color: "#0F1624", fontWeight: 600 }}
          >
            Search Product
          </Typography>
        </Grid>
        <Grid size={6} style={{ textAlign: "right" }}></Grid>
      </Grid>
      <div
        style={{
          // borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}></Grid>
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
                    getProducts(null, e.target.value);
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
            <Grid size={2}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Device
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
                {deviceId?.length < 1 && (
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "#b3b3b3", fontWeight: 300 }}
                  >
                    Select Device
                  </InputLabel>
                )}
                <Select
                  labelId="demo-simple-select-label"
                  id="deviceId"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 250, // Set the max height here
                      },
                    },
                  }}
                  value={deviceId}
                  // onChange={(e) => setBrandId(e.target.value)}

                  onChange={(e) => {
                    setDeviceId(e.target.value);
                    getModelList(e.target.value);
                    getProducts(null, null, e.target.value);
                  }}
                >
                  {deviceList
                    .filter(
                      (item) => !item.name.toLowerCase().includes("series")
                    )
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
                Model
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
                {modelId?.length < 1 && (
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "#b3b3b3", fontWeight: 300 }}
                  >
                    Select Model
                  </InputLabel>
                )}
                <Select
                  labelId="demo-simple-select-label"
                  id="modelId"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 250, // Set the max height here
                      },
                    },
                  }}
                  value={modelId}
                  // onChange={(e) => setCategoryId(e.target.value)}

                  onChange={(e) => {
                    setModelId(e.target.value);
                    getProducts(null, null, null, e.target.value);
                  }}
                >
                  {modelList
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
                    getProducts(null, null, null, null, e.target.value);
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
            <Grid size={12}>
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
            <Grid size={12}>
              <Typography variant="base" gutterBottom sx={{ fontWeight: 500 }}>
                All Product
              </Typography>
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
                              onClick={() => handleSelectedProduct(item, row)}
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
                                        {" "}
                                        {row?.name}
                                        <br />
                                        <span style={{ color: "#424949" }}>
                                          {item?.name}
                                        </span>
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
            <Grid size={12}>
              <Divider />
            </Grid>
            {/* <Grid size={3}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Device
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
                {deviceId?.length < 1 && (
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "#b3b3b3", fontWeight: 300 }}
                  >
                    Select Device
                  </InputLabel>
                )}
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="deviceId"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 250, // Set the max height here
                      },
                    },
                  }}
                  value={deviceId}
                  onChange={handleDeviceSelect}
                >
                  {deviceList?.map((item) => (
                    <MenuItem key={item?._id} value={item?._id}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
            {/* <Grid size={3}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Model
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
                {modelId?.length < 1 && (
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{ color: "#b3b3b3", fontWeight: 300 }}
                  >
                    Select Model
                  </InputLabel>
                )}
                <Select
                  disabled={deviceId?.length < 1}
                  required
                  labelId="demo-simple-select-label"
                  id="modelId"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 250, // Set the max height here
                      },
                    },
                  }}
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                >
                  {modelList?.map((item) => (
                    <MenuItem key={item?._id} value={item?._id}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
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
                          Last Purchase Price
                        </TableCell>

                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Subtotal
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
                      {selectedProducts?.length > 0 ? (
                        selectedProducts?.map((item, i) => (
                          <TableRow
                            sx={{
                              background: "#fff",
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell sx={{ minWidth: "200px" }}>
                              {" "}
                              {item?.spare_parts_name}
                              <br />
                              <span style={{ color: "#424949" }}>
                                {item.name}
                              </span>
                            </TableCell>
                            <TableCell sx={{ minWidth: "180px" }}>
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
                                {item.purchase_product_status?.length < 1 && (
                                  <InputLabel
                                    id="demo-simple-select-label"
                                    sx={{
                                      color: "#b3b3b3",
                                      fontWeight: 300,
                                      fontSize: "14px",
                                    }}
                                  >
                                    Select Status
                                  </InputLabel>
                                )}
                                <Select
                                  required
                                  labelId="demo-simple-select-label"
                                  id="purchaseStatus"
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

                                  value={item.purchase_product_status || ""} // Assuming 'value' is the key for the number field
                                  onChange={(e) => {
                                    const updatedValue = e.target.value;
                                    setSelectedProducts((prevList) =>
                                      prevList.map((obj, index) =>
                                        index === i
                                          ? {
                                              ...obj,
                                              purchase_product_status:
                                                updatedValue,
                                            }
                                          : obj
                                      )
                                    );
                                  }}
                                >
                                  {purchaseStatusList?.map((item) => (
                                    <MenuItem key={item?._id} value={item}>
                                      {item}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </TableCell>
                            <TableCell sx={{ minWidth: "130px" }}>
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
                                value={item.quantity || ""} // Assuming 'value' is the key for the number field
                                onChange={(e) => {
                                  const updatedValue = e.target.value;
                                  setSelectedProducts((prevList) =>
                                    prevList.map((obj, index) =>
                                      index === i
                                        ? { ...obj, quantity: updatedValue }
                                        : obj
                                    )
                                  );
                                }}
                                onWheel={(e) => e.target.blur()}
                              />
                            </TableCell>
                            <TableCell sx={{ minWidth: "130px" }}>
                              <TextField
                                required
                                type="number"
                                size="small"
                                id="price"
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
                                value={item.unit_price || ""} // Assuming 'value' is the key for the number field
                                onChange={(e) => {
                                  const updatedValue = e.target.value;
                                  setSelectedProducts((prevList) =>
                                    prevList.map((obj, index) =>
                                      index === i
                                        ? { ...obj, unit_price: updatedValue }
                                        : obj
                                    )
                                  );
                                }}
                                onWheel={(e) => e.target.blur()}
                              />
                            </TableCell>
                            <TableCell sx={{ minWidth: "130px" }}>
                              <Chip
                                label={
                                  item?.last_purchase_price
                                    ? item?.last_purchase_price
                                    : "N/A"
                                }
                                sx={{
                                  background: "#FDE8E8",
                                  color: "#E02424",
                                  px: 2,
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ minWidth: "130px" }}>
                              {item?.quantity && item?.unit_price
                                ? parseInt(item?.quantity) *
                                  parseFloat(item?.unit_price).toFixed(2)
                                : 0}
                            </TableCell>

                            <TableCell
                              sx={{ minWidth: "130px", textAlign: "right" }}
                            >
                              <IconButton
                                variant="contained"
                                // color="success"
                                disableElevation
                                onClick={() => {
                                  setSelectedProducts((prevList) =>
                                    prevList.filter((_, index) => index !== i)
                                  );
                                }}
                              >
                                {/* <EditOutlinedIcon /> */}

                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12.2836 7.5L11.9951 15M8.00475 15L7.71629 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.8749 4.96358M16.023 4.82547L15.1331 16.3938C15.058 17.3707 14.2434 18.125 13.2636 18.125H6.73625C5.75649 18.125 4.94191 17.3707 4.86677 16.3938L3.9769 4.82547M16.023 4.82547C15.0676 4.6812 14.1012 4.57071 13.1249 4.49527M3.12494 4.96358C3.40792 4.91456 3.69192 4.86851 3.9769 4.82547M3.9769 4.82547C4.93225 4.6812 5.89868 4.57071 6.87494 4.49527M13.1249 4.49527V3.73182C13.1249 2.74902 12.3661 1.92853 11.3838 1.8971C10.9243 1.8824 10.463 1.875 9.99994 1.875C9.5369 1.875 9.07559 1.8824 8.61612 1.8971C7.63382 1.92853 6.87494 2.74902 6.87494 3.73182V4.49527M13.1249 4.49527C12.0937 4.41558 11.0516 4.375 9.99994 4.375C8.9483 4.375 7.90614 4.41558 6.87494 4.49527"
                                    stroke="#4A5468"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell colSpan={6} align="center">
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

          <Box
            sx={{ p: 2, marginTop: "1px solid #EAECF0", textAlign: "right" }}
          >
            <Button
              variant="outlined"
              sx={{
                mr: 2,
                px: 2,
                py: 1.25,
                fontSize: "14px",
                fontWeight: 600,
                color: "#344054",
                border: "1px solid #D0D5DD",
                boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
              }}
              component={Link}
              to="/purchase-list"
            >
              Cancel
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
          </Box>
        </form>
      </div>
    </>
  );
};

export default Products;
