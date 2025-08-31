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

import { Box, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
import { handlePostData } from "../../services/PostDataService";
import { handlePutData } from "../../services/PutDataService";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";

import {
  customerTypeList,
  designationList,
  ratingList,
  roleList,
} from "../../data";
import TextEditor from "../../utils/TextEditor";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getModelStyles(name, modelName, theme) {
  return {
    fontWeight: modelName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}
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
  width: "400px",
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
};
const UpdateSpareParts = ({ getData, row }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [updateDialog, setUpdateDialog] = useState(false);
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

  const [message, setMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [model, setModel] = useState([]);
  const [modelNames, setModelNames] = useState([]);
  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setUpdateDialog(false);
    }
  };
  const handleModelChange = (event) => {
    const {
      target: { value },
    } = event;
    setModel(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
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
    setName("");
    setBrandId("");
    setCategoryId("");
    setDeviceId("");
    setModelId("");
    setWarranty("");
    setPrice("");
    setDetails("");
    setFile(null);
    setRemarks("");
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
  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // var formdata = new FormData();
    // formdata.append("name", name);

    // formdata.append("parent_id", parent_id);
    let modelIds = model?.map(
      (item) => modelList.find((obj) => obj.name === item)._id
    );
    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("brand_id", brandId);
    formData.append("category_id", categoryId);
    formData.append("device_id", deviceId);
    formData.append("model_id", modelId);
    formData.append("warranty", warranty);
    // formData.append("price", price);
    formData.append("description", details.trim());
    formData.append("remarks", remarks.trim());
    modelIds?.map((model_id) => formData.append("attachable_models", model_id));
    {
      file !== null && formData.append("images", file);
    }

    let response = await handlePutData(
      `/api/v1/product/update/${row?._id}`,
      formData,
      true
    );

    console.log("response", response);
    if (response?.status === 401) {
      logout();
      return;
    }

    if (response.status >= 200 && response.status < 300) {
      setLoading(false);
      handleSnakbarOpen("Updated successfully", "success");
      getData(false); // this is for get the table list again
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

    let url = `/api/v1/device/leaf-dropdown`;
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
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setModelList(allData?.data?.data);
      setModelNames(
        allData?.data?.data
          ?.filter((obj) => obj.name !== "Primary")
          ?.map?.((item) => item.name)
      );
      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };

  const handleDeviceSelect = (e) => {
    setDeviceId(e.target.value);
    setModelId("");
    getModelList(e.target.value);
  };
  useEffect(() => {
    setName(row?.name);
    setBrandId(row?.brand_id);
    setCategoryId(row?.category_id);
    setDeviceId(row?.device_id);

    setModelId(row?.model_id);
    setModel(row?.attachable_models_data?.map((item) => item?.name));
    setWarranty(row?.warranty);
    // setPrice(row?.price);
    setDetails(row?.description);
    setRemarks(row?.remarks);
    // setStatus(row?.status);
  }, [row]);
  return (
    <>
      {/* <Button
        variant="contained"
        disableElevation
        sx={{ py: 1.125, px: 2, borderRadius: "6px" }}
        onClick={() => setUpdateDialog(true)}
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
        Update Branch
      </Button> */}

      <IconButton
        variant="contained"
        // color="success"
        disableElevation
        onClick={() => {
          setUpdateDialog(true);
          getCategoryList();
          getBrandList();
          getDeviceList();
          {
            deviceId && getModelList(deviceId);
          }
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

      <Dialog
        open={updateDialog}
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
          Update Spare Parts
          <IconButton
            sx={{ position: "absolute", right: 0, top: 0 }}
            onClick={() => setUpdateDialog(false)}
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
            maxWidth: "800px",
            minWidth: "800px",
            px: 2,
            borderBottom: "1px solid #EAECF1",
            my: 1,
          }}
        >
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
                  {brandList?.map((item) => (
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
                  {categoryList?.map((item) => (
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
                  {deviceList?.map((item) => (
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
                Select Origin Model
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

            <Grid size={12}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Select Supported Models
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
                {model?.length < 1 && (
                  <InputLabel
                    id="demo-multiple-chip-label"
                    sx={{ color: "#b3b3b3", fontWeight: 300 }}
                  >
                    Select Models
                  </InputLabel>
                )}
                <Select
                  required
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={model}
                  onChange={handleModelChange}
                  input={<OutlinedInput id="select-multiple-chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {modelNames?.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getModelStyles(name, model, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid size={6}>
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
                Add Note
              </Typography>
              <TextField
                multiline
                rows={1}
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
                data={details}
              />
            </Grid>

            <Grid size={12}>
              {/* <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Add Note
              </Typography> */}
            </Grid>
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
    </>
  );
};

export default UpdateSpareParts;
