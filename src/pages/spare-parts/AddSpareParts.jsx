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
import TextEditor from "../../utils/TextEditor";
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
    setRemarks("");
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
    
    formData.append("images", file);

    let response = await handlePostData(
      "/api/v1/sparePart/create",
      formData,
      true
    );

    console.log("response", response);

    if (response.status >= 200 && response.status < 300) {
      handleSnakbarOpen("Added successfully", "success");
      clearFilter(); // this is for get the table list again

      clearForm();
      handleDialogClose();
    } else {
      handleSnakbarOpen(response?.data?.message, "error");
    }

    setLoading(false);
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
    background: "#ffffff",

    "& label.Mui-focused": {
      color: "#E5E5E5",
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px 16px",
    },
    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px",
      "& fieldset": {
        borderColor: "#E5E5E5",
      },

      "&:hover fieldset": {
        borderColor: "#E5E5E5",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#E5E5E5",
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
    // getDropdownList();
  }, []);
  return (
    <>
      <Button
        variant="contained"
        disableElevation
        sx={{ py: 1.125, px: 2, borderRadius: "6px" }}
        onClick={() => {
          setAddDialog(true);
          getCategoryList();
          getBrandList();
          getDeviceList();
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
        Add Spare Parts
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
          Add Spare Parts
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
            <Grid size={4}>
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
            <Grid size={4}>
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
              />
            </Grid>
            <Grid size={4}>
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
            </Grid>

            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Description
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
                value={details}
                onChange={(e) => {
                  setDetails(e.target.value);
                }}
              />
              {/* <TextEditor
                convertedContent={convertedContent}
                setConvertedContent={setConvertedContent}
              /> */}
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
              {/* <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Add Note
              </Typography> */}

              <Box {...getRootProps({ style })}>
                <input {...getInputProps()} />

                <Grid container justifyContent="center">
                  <Box
                    sx={{
                      mb: 1.5,
                      p: 1.125,
                      paddingBottom: "3px",
                      borderRadius: "8px",
                      border: "1px solid #EAECF0",
                      boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M6.66666 13.3333L9.99999 10M9.99999 10L13.3333 13.3333M9.99999 10V17.5M16.6667 13.9524C17.6846 13.1117 18.3333 11.8399 18.3333 10.4167C18.3333 7.88536 16.2813 5.83333 13.75 5.83333C13.5679 5.83333 13.3975 5.73833 13.3051 5.58145C12.2184 3.73736 10.212 2.5 7.91666 2.5C4.46488 2.5 1.66666 5.29822 1.66666 8.75C1.66666 10.4718 2.36286 12.0309 3.48911 13.1613"
                        stroke="#344054"
                        stroke-width="1.66667"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </Box>
                </Grid>
                <Box sx={{ pl: 1.5, textAlign: "center" }}>
                  <Typography
                    variant="base"
                    color="text.fade"
                    sx={{ fontWeight: 400, mb: 0.5 }}
                  >
                    <span style={{ color: "#4238CA", fontWeight: 500 }}>
                      {" "}
                      Click to upload{" "}
                    </span>
                    or drag and drop
                  </Typography>
                  <Typography variant="medium" color="text.fade">
                    PNG, JPG (max. 400x400px)
                  </Typography>
                  {file?.path?.length > 0 && (
                    <Typography
                      variant="medium"
                      color="text.light"
                      sx={{ mt: 1 }}
                    >
                      <b>Uploaded:</b> {file?.path} - {file?.size} bytes
                    </Typography>
                  )}
                </Box>
              </Box>
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
              color={"#353b48"}
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

export default AddSpareParts;
