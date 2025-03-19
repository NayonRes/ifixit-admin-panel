import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  useContext,
} from "react";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { Box, Divider, Skeleton, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { getDataWithToken } from "../../services/GetDataService";

import InputAdornment from "@mui/material/InputAdornment";

import Checkbox from "@mui/material/Checkbox";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import { handlePostData } from "../../services/PostDataService";
import { AuthContext } from "../../context/AuthContext";

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

const SparePars = ({
  allSpareParts,
  setAllSpareParts,
  getBranchId,
  partsDeviceId,
}) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [addDialog, setAddDialog] = useState(false);
  const [supplier, setSupplier] = useState("");
  const [branchList, setBranchList] = useState([]);
  const [branch, setBranch] = useState("");
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
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");

  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);

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
  const { acceptedFiles, isFocused, isDragAccept, isDragReject } = useDropzone({
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
    formData.append("paid_amount", paidAmount);
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

  // const getBrandList = async () => {
  //   setLoading2(true);

  //   let url = `/api/v1/brand/dropdownlist`;
  //   let allData = await getDataWithToken(url);

  //   if (allData.status >= 200 && allData.status < 300) {
  //     setBrandList(allData?.data?.data);

  //     if (allData.data.data.length < 1) {
  //       setMessage("No data found");
  //     }
  //   }
  //   setLoading2(false);
  // };

  // const getBranchList = async () => {
  //   setLoading2(true);

  //   let url = `/api/v1/branch/dropdownlist`;
  //   let allData = await getDataWithToken(url);

  //   if (allData.status >= 200 && allData.status < 300) {
  //     setBranchList(allData?.data?.data);

  //     if (allData.data.data.length < 1) {
  //       setMessage("No data found");
  //     }
  //   }
  //   setLoading2(false);
  // };
  // const getUserList = async () => {
  //   setLoading2(true);

  //   let url = `/api/v1/user/dropdownlist`;
  //   let allData = await getDataWithToken(url);

  //   if (allData.status >= 200 && allData.status < 300) {
  //     setUserList(allData?.data?.data);

  //     if (allData.data.data.length < 1) {
  //       setMessage("No data found");
  //     }
  //   }
  //   setLoading2(false);
  // };

  // const getCategoryList = async () => {
  //   setLoading2(true);

  //   let url = `/api/v1/category/dropdownlist`;
  //   let allData = await getDataWithToken(url);

  //   if (allData.status >= 200 && allData.status < 300) {
  //     setCategoryList(allData?.data?.data);

  //     if (allData.data.data.length < 1) {
  //       setMessage("No data found");
  //     }
  //   }
  //   setLoading2(false);
  // };
  // const getDeviceList = async () => {
  //   setLoading2(true);

  //   let url = `/api/v1/device/dropdownlist`;
  //   let allData = await getDataWithToken(url);
  //   console.log("allData?.data?.data", allData?.data?.data);

  //   if (allData.status >= 200 && allData.status < 300) {
  //     setDeviceList(allData?.data?.data);

  //     if (allData.data.data.length < 1) {
  //       setMessage("No data found");
  //     }
  //   }
  //   setLoading2(false);
  // };
  // const getModelList = async (id) => {
  //   setLoading2(true);

  //   // let url = `/api/v1/model/device-model?deviceId=${id}`;
  //   let url = `/api/v1/model/dropdownlist`;
  //   let allData = await getDataWithToken(url);

  //   if (allData.status >= 200 && allData.status < 300) {
  //     setModelList(allData?.data?.data);

  //     if (allData.data.data.length < 1) {
  //       setMessage("No data found");
  //     }
  //   }
  //   setLoading2(false);
  // };

  const getProducts = async () => {
    setLoading(true);
    // let url;
    // let newSearchProductText = searchProductText;
    // let newBrandId = brandId;
    // let newDeviceId = deviceId;
    // let newModelId = modelId;
    // let newCategoryId = categoryId;
    // if (searchText) {
    //   newSearchProductText = searchText;
    // }
    // if (bId) {
    //   newBrandId = bId;
    // }
    // if (dId) {
    //   newDeviceId = dId;
    // }
    // if (mId) {
    //   newModelId = mId;
    // }
    // if (catId) {
    //   newCategoryId = catId;
    // }

    let branch_id = getBranchId();

    // let url = `/api/v1/product?brand_id=${brand_id}&model_id=${deviceId}&device_id=${partsDeviceId}&branch_id=${branch_id}`;

    let url = `/api/v1/product?model_id=${partsDeviceId}&branch_id=${branch_id}`;

    // url = `/api/v1/product?name=${newSearchProductText.trim()}&category_id=${newCategoryId}&brand_id=${newBrandId}&device_id=${newDeviceId}&model_id=${newModelId}`;

    let allData = await getDataWithToken(url);
    // console.log("(allData?.data?.data products", allData?.data?.data);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      console.log("lll", allData?.data?.data);
      setProductList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    }
    setLoading(false);
  };
  const handleSelectedProduct = (item, row) => {
    // console.log("item", item);
    if (selectedProducts.some((res) => res._id === item._id)) {
      setSelectedProducts(
        selectedProducts.filter((res) => res._id !== item._id)
      );
      setAllSpareParts(selectedProducts.filter((res) => res._id !== item._id));
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          ...item,
          product_full_name: `${row?.name} - ${item?.name}`,
          product_id: item.product_id,
          product_variation_id: item._id,
          purchase_product_status: "",
          quantity: "",
          unit_price: "",
        },
      ]);
      setAllSpareParts([
        ...selectedProducts,
        {
          ...item,
          product_full_name: `${row?.name} - ${item?.name}`,
          product_id: item.product_id,
          product_variation_id: item._id,
          purchase_product_status: "",
          quantity: "",
          unit_price: "",
        },
      ]);
    }

    console.log("all selectedProducts", selectedProducts);
  };
  useEffect(() => {
    // getCategoryList();
    // getBranchList();
    // getBrandList();
    // getUserList();
    // getBrandList();
    // getDeviceList();
    // getModelList();
    // getDropdownList();
  }, []);

  useEffect(() => {
    if (allSpareParts.length > 0) {
      setSelectedProducts(allSpareParts);
    }
  }, [allSpareParts]);

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Grid container spacing={3}>
      {/* <Grid size={12}>
        <Typography
          variant="base"
          gutterBottom
          sx={{ fontWeight: 500, mt: 3 }}
          onClick={() => console.log(selectedProducts)}
        >
          Search Product
        </Typography>
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
      </Grid> */}
      <Grid size={12}>
        {/* <Typography variant="base" gutterBottom sx={{ fontWeight: 500 }}>
          All Product
        </Typography> */}
        <Box sx={{ flexGrow: 1, mt: 3 }}>
          <Grid container spacing={2}>
            {!loading &&
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
                                  {row?.name}

                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 2,
                                      alignItems: "center",
                                      mt: 0.5,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{ color: "#424949" }}
                                    >
                                      {item?.name}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 2,
                                      alignItems: "center",
                                      mt: 0.5,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{ color: "#3E3BC3" }}
                                    >
                                      {item.price}TK
                                    </Typography>
                                  </Box>
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
            {loading && (
              <Grid size={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                  }}
                >
                  <Skeleton height={200} sx={{ flex: 1 }} />
                  <Skeleton height={200} sx={{ flex: 1 }} />
                  <Skeleton height={200} sx={{ flex: 1 }} />
                  <Skeleton height={200} sx={{ flex: 1 }} />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
      {/* <Grid size={12}>
        <Divider />
      </Grid> */}
    </Grid>
  );
};

export default SparePars;
