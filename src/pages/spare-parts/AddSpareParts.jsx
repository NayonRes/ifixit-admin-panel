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

import { Box, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { getDataWithToken } from "../../services/GetDataService";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import EmailIcon from "@mui/icons-material/Email";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
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
import {
  customerTypeList,
  designationList,
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
const form = {
  padding: "50px",
  background: "#fff",
  borderRadius: "10px",
  width: "800px",
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
};

const variationObject = {
  name: "",
  price: 0,
  file: null,
};
const AddSpareParts = ({ clearFilter }) => {
  const navigate = useNavigate();

  const [addDialog, setAddDialog] = useState(false);
  const [name, setName] = useState("");
  const [convertedContent, setConvertedContent] = useState("");

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
    setName("");
    setBrandId("");
    setCategoryId("");
    setDeviceId("");
    setModelId("");
    setWarranty("");
    setPrice("");
    setDetails("");
    setFile(null);
    setVariationList([]);
    setRemarks("");
  };

  const handleCreateSpareParts = async (variationList, spare_parts_id) => {
    try {
      // Create an array of promises
      // const promises = variationList.map((variation) =>
      //   handlePostData("/api/v1/sparePartVariation/create", variation, true)
      // );

      const promises = variationList.map((variation) => {
        // Prepare FormData

        // name: "",
        // price: 0,
        // file: null,
        const formData = new FormData();
        formData.append("spare_parts_id", spare_parts_id);
        formData.append("name", variation?.name?.trim());
        formData.append("price", parseFloat(variation?.price).toFixed(2));
        {
          variation?.file !== null &&
            variation?.file !== undefined &&
            formData.append("image", variation?.file);
        }

        // Call handlePostData for this FormData
        return handlePostData(
          "/api/v1/sparePartVariation/create",
          formData,
          true
        );
      });

      // Wait for all promises to resolve
      const responses = await Promise.all(promises);

      // Handle all responses

      const allVariationAddedSuccessfully = responses.every(
        (item) => item.data.status >= 200 && item.data.status < 300
      );

      if (allVariationAddedSuccessfully) {
        handleSnakbarOpen("Added successfully", "success");
        clearFilter();

        clearForm();
        handleDialogClose();
      } else {
        handleSnakbarOpen("Something went wrong", "error");
      }
      console.log("All spare parts created successfully:", responses);
    } catch (error) {
      console.error("Error creating spare parts:", error);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // var formdata = new FormData();
    // formdata.append("name", name);

    // formdata.append("parent_id", parent_id);

    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("brand_id", brandId);
    formData.append("category_id", categoryId);
    formData.append("device_id", deviceId);
    formData.append("model_id", modelId);
    formData.append("warranty", warranty);
    formData.append("price", price);
    formData.append("description", details.trim());
    formData.append("remarks", remarks.trim());
    // formData.append("variationList", variationList);
    // formData.append("variationList", JSON.stringify(variationList));

    // Append each object in variationList
    // variationList.forEach((variation, index) => {
    //   formData.append(`variationList[${index}][key1]`, variation.name); // Append other keys
    //   formData.append(`variationList[${index}][key2]`, variation.price); // Example key
    //   if (variation.file) {
    //     formData.append(`variationList[${index}][image]`, variation.file); // Append file
    //   }
    // });

    let response = await handlePostData(
      "/api/v1/sparePart/create",
      formData,
      true
    );

    console.log("response", response?.data?.data?._id);

    if (response.status >= 200 && response.status < 300) {
      await handleCreateSpareParts(variationList, response?.data?.data?._id);
      setLoading(false);
      navigate("/spare-parts-list")
      // handleSnakbarOpen("Added successfully", "success");
      // clearFilter();

      // clearForm();
      // handleDialogClose();
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
  useEffect(() => {
    getCategoryList();
    getBrandList();
    getDeviceList();
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
            Add Spare Parts
          </Typography>
        </Grid>
        <Grid size={6} style={{ textAlign: "right" }}></Grid>
      </Grid>

      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          padding: "16px",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
        }}
      >
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Spare Parts Name
              </Typography>
              <TextField
                required
                size="small"
                fullWidth
                id="name"
                placeholder="Full Name"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 2 }}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Grid>
            <Grid size={6}>
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
                  required
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
                  onChange={(e) => setBrandId(e.target.value)}
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
            <Grid size={6}>
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
                  required
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
                  onChange={(e) => setCategoryId(e.target.value)}
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
            <Grid size={6}>
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
            <Grid size={6}>
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
            </Grid>
            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Warranty
              </Typography>
              <TextField
                size="small"
                type="number"
                fullWidth
                id="warranty"
                placeholder="Warranty"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 2 }}
                value={warranty}
                onChange={(e) => {
                  setWarranty(e.target.value);
                }}
                onWheel={(e) => e.target.blur()}
              />
            </Grid>
            {/* <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Price
              </Typography>
              <TextField
                required
                size="small"
                type="number"
                fullWidth
                id="price"
                placeholder="Price"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 2 }}
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </Grid> */}

            <Grid size={12}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Description
              </Typography>
              {/* <TextField
                multiline
                rows={2}
                size="small"
                fullWidth
                id="membershipId"
                placeholder="Add Note"
                variant="outlined"
                sx={{ ...customeTextFeild }}
                value={details}
                onChange={(e) => {
                  setDetails(e.target.value);
                }}
              /> */}
              <TextEditor
                convertedContent={details}
                setConvertedContent={setDetails}
              />
            </Grid>
            <Grid size={12}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Add Note
              </Typography>
              <TextField
                multiline
                rows={2}
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
            <Grid size={12}>
              <div
                style={{
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
                  <Grid size={{ xs: 6 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      component="div"
                      sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
                    >
                      Variations
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }} sx={{ textAlign: "right" }}>
                    <Button
                      color="text"
                      size="small"
                      sx={{ border: "1px solid #F2F3F7", px: 2 }}
                      startIcon={
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 4.16699V15.8337M4.16669 10.0003H15.8334"
                            stroke="black"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      }
                      onClick={() =>
                        setVariationList([...variationList, variationObject])
                      }
                    >
                      Add Variation
                    </Button>
                  </Grid>
                </Grid>

                <TableContainer>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Value
                        </TableCell>
                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Sell Price
                        </TableCell>

                        <TableCell style={{ whiteSpace: "nowrap" }}>
                          Variation Image
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
                      {variationList?.length > 0 ? (
                        variationList?.map((item, i) => (
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell sx={{ minWidth: "130px" }}>
                              {" "}
                              <TextField
                                required
                                size="small"
                                id="name"
                                placeholder="Variation Name"
                                variant="outlined"
                                sx={{
                                  ...customeTextFeild,
                                  "& .MuiOutlinedInput-input": {
                                    padding: "6.5px 12px",
                                    fontSize: "14px",
                                  },
                                  minWidth: "150px",
                                }}
                                value={item.name || ""}
                                onChange={(e) => {
                                  const updatedValue = e.target.value;
                                  setVariationList((prevList) =>
                                    prevList.map((obj, index) =>
                                      index === i
                                        ? { ...obj, name: updatedValue }
                                        : obj
                                    )
                                  );
                                }}
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
                                value={item.price || ""} // Assuming 'value' is the key for the number field
                                onChange={(e) => {
                                  const updatedValue = e.target.value;
                                  setVariationList((prevList) =>
                                    prevList.map((obj, index) =>
                                      index === i
                                        ? { ...obj, price: updatedValue }
                                        : obj
                                    )
                                  );
                                }}
                                onWheel={(e) => e.target.blur()}
                              />
                            </TableCell>
                            <TableCell sx={{ minWidth: "130px" }}>
                              <Box sx={{ position: "relative" }}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  style={{
                                    position: "absolute",
                                    top: 8,
                                    left: 90,
                                  }}
                                >
                                  <path
                                    d="M3.33333 13.5352C2.32834 12.8625 1.66666 11.7168 1.66666 10.4167C1.66666 8.46369 3.15959 6.85941 5.06645 6.68281C5.45651 4.31011 7.51687 2.5 10 2.5C12.4831 2.5 14.5435 4.31011 14.9335 6.68281C16.8404 6.85941 18.3333 8.46369 18.3333 10.4167C18.3333 11.7168 17.6717 12.8625 16.6667 13.5352M6.66666 13.3333L10 10M10 10L13.3333 13.3333M10 10V17.5"
                                    stroke="#344054"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>

                                <input
                                  id="fileInput"
                                  type="file"
                                  accept="image/png, image/jpg, image/jpeg"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    setVariationList((prevList) =>
                                      prevList.map((obj, index) =>
                                        index === i ? { ...obj, file } : obj
                                      )
                                    );
                                  }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{ minWidth: "130px", textAlign: "right" }}
                            >
                              <IconButton
                                variant="contained"
                                // color="success"
                                disableElevation
                                onClick={() => {
                                  setVariationList((prevList) =>
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
                          <TableCell colSpan={4} align="center">
                            No variation added
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
           
          </Grid>
          <Box
            sx={{ p: 2, marginTop: "1px solid #EAECF0", textAlign: "right" }}
          >
            <Button
              variant="outlined"
              onClick={handleDialogClose}
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
              to="/spare-parts-list"
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

export default AddSpareParts;
