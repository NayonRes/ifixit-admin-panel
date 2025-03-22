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
const AddStockLimit = ({ clearFilter }) => {
  const navigate = useNavigate();
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [addDialog, setAddDialog] = useState(false);
  const [supplierList, setSupplierList] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [branchList, setBranchList] = useState([]);
  const [branch, setBranch] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
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

  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");

  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [details, setDetails] = useState("");
  const [limitDataList, setLimitDataList] = useState();
  const [limitDataLoading, setLimitDataLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setAddDialog(false);
      setBranchList(branchList?.map((item) => ({ ...item, limit: "" })));
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
    try {
      // Create an array of promises
      // const promises = variationList.map((variation) =>
      //   handlePostData("/api/v1/productVariation/create", variation, true)
      // );

      if (branchList.filter((branch) => branch?.limit).length < 1) {
        return handleSnakbarOpen("Please enter the limit", "error");
      }
      setLoading(true);
      const promises = branchList
        .filter((branch) => branch?.limit)
        .map((branch) => {
          let data = {
            product_id: details.product_id,
            product_variation_id: details._id,
            branch_id: branch?._id,
            stock_limit: branch?.limit ? parseInt(branch?.limit) : 0,
          };

          // Call handlePostData for this FormData
          return handlePostData(
            "/api/v1/stockCounterAndLimit/create-limit",
            data,
            false
          );
        });

      // Wait for all promises to resolve
      const responses = await Promise.all(promises);

      // Handle all responses
      if (responses?.status === 401) {
        logout();
        return;
      }
      const allVariationAddedSuccessfully = responses.every(
        (item) => item.data.status >= 200 && item.data.status < 300
      );

      if (allVariationAddedSuccessfully) {
        setLoading(false);
        handleSnakbarOpen("Added successfully", "success");
        setBranchList(branchList?.map((item) => ({ ...item, limit: "" })));
        handleDialogClose();
      } else {
        setLoading(false);
        handleSnakbarOpen("Something went wrong", "error");
      }
      console.log("All spare parts created successfully:", responses);
    } catch (error) {
      setLoading(false);
      console.error("Error creating spare parts:", error);
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

  const getBranchList = async () => {
    setLoading2(true);

    let url = `/api/v1/branch/dropdownlist`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      let newBranchWithLimit = allData?.data?.data?.map((item) => ({
        ...item,
        limit: "",
      }));
      console.log("newBranchWithLimit", newBranchWithLimit);

      setBranchList(newBranchWithLimit);

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

    // let url = `/api/v1/model/device-model?deviceId=${id}`;
    let url = `/api/v1/model/dropdownlist`;
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
  const getBranchLimit = async (product_variation_id) => {
    setLimitDataLoading(true);

    // let url = `/api/v1/model/device-model?deviceId=${id}`;
    let url = `/api/v1/stockCounterAndLimit/branch-limit?product_variation_id=${product_variation_id}`;
    let data = { product_variation_id };
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    console.log("getBranchLimit************************", allData?.data?.data);

    if (allData.status >= 200 && allData.status < 300) {
      setLimitDataLoading(false);
      // setModelList(allData?.data?.data);

      let newBranchList = branchList?.map((item) => {
        let newData = allData?.data?.data?.find(
          (el) => el.branch_id === item?._id
        );
        return { ...item, limit: newData?.stock_limit || 0 }; // Defaults to 0 if stock_limit is undefined
      });

      setBranchList(newBranchList);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLimitDataLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
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
  const handleSelectedProduct = (item) => {
    console.log("item", item);
    setDetails(item);
    getBranchLimit(item?._id);
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

  const handleLimitChange = (index, value) => {
    const updatedList = [...branchList];
    updatedList[index].limit = value;
    setBranchList(updatedList);
  };
  useEffect(() => {
    // getDropdownList();
    getCategoryList();
    getBrandList();
    getDeviceList();
    getModelList();

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
          <Grid size={4}>
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
                  Select Brand
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
                  getProducts(null, null, e.target.value);
                }}
              >
                {deviceList
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
          {/* <Grid size={2}>
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
        </Grid>
      </div>

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
          Add Alert Limit
          <IconButton
            sx={{ position: "absolute", right: 0, top: 0 }}
            onClick={() => setAddDialog(false)}
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
          <Grid container spacing={2}>
            {branchList?.map((item, i) => (
              <Grid size={6}>
                <Typography
                  variant="medium"
                  color="text.main"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {item?.name}
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  fullWidth
                  id="branch"
                  disabled={limitDataLoading}
                  placeholder={
                    limitDataLoading
                      ? "Checking Previous Alert Limit"
                      : "Enter Alert Limit"
                  }
                  variant="outlined"
                  sx={{ ...customeTextFeild }}
                  value={item?.limit}
                  onChange={(e) => handleLimitChange(i, e.target.value)}
                  onWheel={(e) => e.target.blur()}
                />
              </Grid>
            ))}
          </Grid>
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
    </>
  );
};

export default AddStockLimit;
