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

import { Alert, Box, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { useTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { handlePutData } from "../../services/PutDataService";
import Products from "./Products";

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

const serviceObject = {
  name: "",
  details: "",
  repair_cost: 0,
  guaranty: "",
  warranty: "",
  repair_image: null,
  selectedProducts: [],
};
const stepObject = {
  title: "",
  details: "",
  step_image: null,
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

function getStyles(name, branchName, theme) {
  return {
    fontWeight: branchName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}
const UpdateService = ({ clearFilter }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const [branchName, setBranchName] = React.useState([]);
  const [addDialog, setAddDialog] = useState(false);
  const [name, setName] = useState("");
  const [convertedContent, setConvertedContent] = useState("");

  const [title, setTitle] = useState();
  const [image, setImage] = useState(null);
  const [brandId, setBrandId] = useState([]);
  const [categoryId, setCategoryId] = useState([]);
  const [deviceId, setDeviceId] = useState([]);
  const [modelId, setModelId] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [branchNames, setBranchNames] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [branchIds, setBranchIds] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [warranty, setWarranty] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [detailsForTextEditorShow, setDetailsForTextEditorShow] = useState("");
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");

  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const [repairServiceList, setRepairServiceList] = useState([serviceObject]);
  const [stepList, setStepList] = useState([stepObject]);

  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [allData, setAllData] = useState([]);
  const [status, setStatus] = useState("");
  const [orderNo, setOrderNo] = useState();

  const handleBranchChange = (event) => {
    const {
      target: { value },
    } = event;
    setBranchName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setAddDialog(false);
    }
    clearForm();
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
    setTitle("");
    setOrderNo();
    setBrandId("");
    setCategoryId("");
    setDeviceId("");
    setModelId("");
    setWarranty("");
    setPrice("");
    setDetails("");
    setFile(null);
    setImage(null);
    setRemarks("");
    setStatus("");
  };

  function fileToBase64(file) {
    console.log("fileToBase64");

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const newRepairServiceList = await Promise.all(
      repairServiceList?.map(async (item) => ({
        ...item,
        repair_image:
          item?.repair_image instanceof File
            ? await fileToBase64(item?.repair_image)
            : item?.repair_image,
        ...(item.selectedProducts?.length > 0
          ? {
              product_id: item.selectedProducts[0].product_id,
              product_variation_id:
                item.selectedProducts[0].product_variation_id,
            }
          : {}),
      }))
    );

    const newStepList = await Promise.all(
      stepList?.map(async (item) => ({
        ...item,
        step_image:
          item?.step_image instanceof File
            ? await fileToBase64(item?.step_image)
            : item?.step_image,
      }))
    );
    console.log("newRepairServiceList", newRepairServiceList);
    console.log("newStepList", newStepList);
    let data = {
      title: title,
      order_no: orderNo,
      status: status,
      model_id: modelId,
      device_id: deviceId,
      brand_id: brandId,
      branch_id: branchName?.map(
        (item) => branchList.find((obj) => obj.name === item)._id
      ),
      steps: newStepList,
      repair_info: newRepairServiceList,
      description: details,
    };
    if (image) {
      data.image = await fileToBase64(image);
    }
    console.log("data", data);

    let response = await handlePutData(
      `/api/v1/service/update/${id}`,
      data,
      false
    );

    console.log("response", response?.data?.data?._id);

    if (response.status >= 200 && response.status < 300) {
      setLoading(false);
      navigate("/service-list");
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

    if (allData.status >= 200 && allData.status < 300) {
      setBranchList(allData?.data?.data);
      if (allData?.data?.data?.map?.length > 0) {
        // {brandList
        //   ?.filter((obj) => obj.name !== "Primary")
        //   ?.map((item) => (
        //     <MenuItem key={item?._id} value={item?._id}>
        //       {item?.name}
        //     </MenuItem>
        //   ))}

        setBranchNames(
          allData?.data?.data
            ?.filter((obj) => obj.name !== "Primary")
            ?.map?.((item) => item.name)
        );
      }

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

  const handleDetailsChange = (index, updatedValue) => {
    setRepairServiceList((prevList) =>
      prevList.map((obj, i) =>
        i === index ? { ...obj, details: updatedValue } : obj
      )
    );
  };
  const handleStepDetailsChange = (index, updatedValue) => {
    setStepList((prevList) =>
      prevList.map((obj, i) =>
        i === index ? { ...obj, details: updatedValue } : obj
      )
    );
  };

  const handleDeviceSelect = (e) => {
    setDeviceId(e.target.value);
    setModelId("");
    getModelList(e.target.value);
  };

  const getData = async () => {
    setLoading3(true);

    let url = `/api/v1/service/${encodeURIComponent(id.trim())}`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data", allData?.data?.data);

    if (allData.status >= 200 && allData.status < 300) {
      setDetailsForTextEditorShow(allData?.data?.data[0]?.description);
      setTitle(allData?.data?.data[0]?.title);
      setOrderNo(allData?.data?.data[0]?.order_no);
      setDetails(allData?.data?.data[0]?.description);
      setModelId(allData?.data?.data[0]?.model_id);
      setStatus(allData?.data?.data[0]?.status);
      setDeviceId(allData?.data?.data[0]?.device_id);
      getModelList(allData?.data?.data[0]?.device_id);
      setBrandId(allData?.data?.data[0]?.brand_id);
      console.log(
        "allData?.data?.data[0]?.description",
        allData?.data?.data[0]?.description
      );

      setStepList(allData?.data?.data[0]?.steps);
      // setRepairServiceList(allData?.data?.data[0]?.repair_info);
      if (
        Array.isArray(allData?.data?.data[0]?.repair_info) &&
        allData.data.data[0].repair_info.length > 0
      ) {
        const updatedRepairInfo = allData.data.data[0].repair_info.map(
          (item) => ({
            ...item,
            selectedProducts: [
              {
                product_id: item?.product_id,
                product_variation_id: item?.product_variation_id,

                brand_id: item?.product_data?.brand_id,
                device_id: item?.product_data?.device_id,
                model_id: item?.product_data?.model_id,
                category_id: item?.product_data?.category_id,
              },
            ],
          })
        );
        setRepairServiceList(updatedRepairInfo);
        console.log("updatedRepairInfo", updatedRepairInfo);
      } else {
        setRepairServiceList([]); // or keep it as-is if you want to retain an empty state
      }

      // setStepList(allData?.data?.data[0]?.steps);

      // branch_data
      setBranchName(
        allData?.data?.data[0]?.branch_data?.map((item) => item?.name)
      );

      setAllData(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading3(false);
  };
  useEffect(() => {
    // getCategoryList();
    getBranchList();
    getBrandList();
    getDeviceList();
    getData();
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
            Update Service
          </Typography>
        </Grid>
        <Grid size={6} style={{ textAlign: "right" }}></Grid>
      </Grid>

      {allData?.length > 0 && (
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
                  onClick={() => {
                    console.log("branchName", branchName);
                    console.log(
                      "branch id ",
                      branchName?.map(
                        (item) =>
                          branchList.find((obj) => obj.name === item)._id
                      )
                    );
                  }}
                >
                  Branch *
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
                  {branchName?.length < 1 && (
                    <InputLabel
                      id="demo-multiple-chip-label"
                      sx={{ color: "#b3b3b3", fontWeight: 300 }}
                    >
                      Branch
                    </InputLabel>
                  )}
                  <Select
                    required
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={branchName}
                    onChange={handleBranchChange}
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
                    {branchNames?.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, branchName, theme)}
                      >
                        {name}
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
                  Service Image * (Size 400 : 300)
                </Typography>

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
                  <Box
                    style={{
                      border: "1px solid #cccccc",
                      borderRadius: "4px",
                      p: 4,
                    }}
                  >
                    <input
                      className="file_input2"
                      id="fileInput"
                      type="file"
                      accept="image/png, image/jpg, image/jpeg, image/webp"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setImage(file);
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid size={6}>
                <Typography
                  variant="medium"
                  color="text.main"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  Service Title *
                </Typography>
                <TextField
                  required
                  size="small"
                  fullWidth
                  id="name"
                  placeholder="Service Title"
                  variant="outlined"
                  sx={{ ...customeTextFeild }}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
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
                  Order No
                </Typography>
                <TextField
                  required
                  type="number"
                  size="small"
                  fullWidth
                  id="orderNo"
                  placeholder="Enter Order No"
                  variant="outlined"
                  sx={{ ...customeTextFeild, mb: 2 }}
                  value={orderNo}
                  onChange={(e) => {
                    setOrderNo(e.target.value);
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
                  Select Status
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
                  <Select
                    // required
                    labelId="demo-simple-select-label"
                    id="baseLanguage"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 250, // Set the max height here
                        },
                      },
                    }}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
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
                  Service Description
                </Typography>

                {/* <TextEditor
                convertedContent={details}
                setConvertedContent={setDetails}
                data={details}
              /> */}

                <TextEditor
                  convertedContent={details}
                  setConvertedContent={setDetails}
                  data={details}
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
                        onClick={() =>
                          console.log("repairServiceList", repairServiceList)
                        }
                      >
                        Services
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
                          setRepairServiceList([
                            ...repairServiceList,
                            serviceObject,
                          ])
                        }
                      >
                        Add Service
                      </Button>
                    </Grid>
                  </Grid>
                  <Box sx={{ px: 2 }}>
                    {repairServiceList?.length > 0 &&
                      repairServiceList?.map((item, i) => (
                        <>
                          <Box
                            sx={{
                              p: 2,
                              // background: "#F9FAFB",
                              mb: 2,
                              borderRadius: "8px",
                              border: "2px solid #F9FAFB",
                            }}
                          >
                            <Alert severity="info" sx={{ mb: 1 }}>
                              {" "}
                              For Single Service : Image Size 100 : 100 & For
                              multiple Service : Image Size 200 : 100
                            </Alert>
                            <Box sx={{ textAlign: "right", mb: 1 }}>
                              <Button
                                variant="contained"
                                color="error"
                                disableElevation
                                startIcon={
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M12.2836 7.5L11.9951 15M8.00475 15L7.71629 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.8749 4.96358M16.023 4.82547L15.1331 16.3938C15.058 17.3707 14.2434 18.125 13.2636 18.125H6.73625C5.75649 18.125 4.94191 17.3707 4.86677 16.3938L3.9769 4.82547M16.023 4.82547C15.0676 4.6812 14.1012 4.57071 13.1249 4.49527M3.12494 4.96358C3.40792 4.91456 3.69192 4.86851 3.9769 4.82547M3.9769 4.82547C4.93225 4.6812 5.89868 4.57071 6.87494 4.49527M13.1249 4.49527V3.73182C13.1249 2.74902 12.3661 1.92853 11.3838 1.8971C10.9243 1.8824 10.463 1.875 9.99994 1.875C9.5369 1.875 9.07559 1.8824 8.61612 1.8971C7.63382 1.92853 6.87494 2.74902 6.87494 3.73182V4.49527M13.1249 4.49527C12.0937 4.41558 11.0516 4.375 9.99994 4.375C8.9483 4.375 7.90614 4.41558 6.87494 4.49527"
                                      stroke="#fff"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                }
                                onClick={() => {
                                  if (repairServiceList.length > 1) {
                                    setRepairServiceList((prevList) =>
                                      prevList.filter((_, index) => index !== i)
                                    );
                                  } else {
                                    handleSnakbarOpen(
                                      "Minimum 1 service have to add",
                                      "error"
                                    );
                                  }
                                }}
                              >
                                {/* <EditOutlinedIcon /> */}
                                Remove
                              </Button>
                            </Box>
                            <Grid container spacing={1}>
                              <Grid size={4}>
                                <Typography
                                  variant="medium"
                                  color="text.main"
                                  gutterBottom
                                  sx={{ fontWeight: 500 }}
                                >
                                  Service Image *
                                </Typography>

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
                                  <Box
                                    style={{
                                      border: "1px solid #cccccc",
                                      borderRadius: "4px",
                                      p: 4,
                                    }}
                                  >
                                    <input
                                      className="file_input2"
                                      // required
                                      id="fileInput"
                                      type="file"
                                      accept="image/png, image/jpg, image/jpeg, image/webp"
                                      onChange={(e) => {
                                        const file = e.target.files[0];
                                        setRepairServiceList((prevList) =>
                                          prevList.map((obj, index) =>
                                            index === i
                                              ? { ...obj, repair_image: file }
                                              : obj
                                          )
                                        );
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid size={4}>
                                <Typography
                                  variant="medium"
                                  color="text.main"
                                  gutterBottom
                                  sx={{ fontWeight: 500 }}
                                >
                                  Service Name *
                                </Typography>
                                <TextField
                                  required
                                  size="small"
                                  fullWidth
                                  id="name"
                                  placeholder="Full Name"
                                  variant="outlined"
                                  sx={{ ...customeTextFeild, mb: 2 }}
                                  value={item.name || ""}
                                  onChange={(e) => {
                                    const updatedValue = e.target.value;
                                    setRepairServiceList((prevList) =>
                                      prevList.map((obj, index) =>
                                        index === i
                                          ? { ...obj, name: updatedValue }
                                          : obj
                                      )
                                    );
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
                                  Service Cost / Assemble cost *
                                </Typography>
                                <TextField
                                  required
                                  size="small"
                                  fullWidth
                                  type="number"
                                  id="repair_cost"
                                  placeholder="Service Cost"
                                  variant="outlined"
                                  sx={{ ...customeTextFeild, mb: 2 }}
                                  value={item.repair_cost}
                                  onChange={(e) => {
                                    const updatedValue = e.target.value;
                                    setRepairServiceList((prevList) =>
                                      prevList.map((obj, index) =>
                                        index === i
                                          ? {
                                              ...obj,
                                              repair_cost: updatedValue,
                                            }
                                          : obj
                                      )
                                    );
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
                                  Service Guaranty
                                </Typography>
                                <TextField
                                  size="small"
                                  fullWidth
                                  id="guaranty"
                                  placeholder="Enter Guaranty"
                                  variant="outlined"
                                  sx={{ ...customeTextFeild, mb: 2 }}
                                  value={item.guaranty || ""}
                                  onChange={(e) => {
                                    const updatedValue = e.target.value;
                                    setRepairServiceList((prevList) =>
                                      prevList.map((obj, index) =>
                                        index === i
                                          ? { ...obj, guaranty: updatedValue }
                                          : obj
                                      )
                                    );
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
                                  Service Warranty
                                </Typography>
                                <TextField
                                  size="small"
                                  fullWidth
                                  id="warranty"
                                  placeholder="Enter Warranty"
                                  variant="outlined"
                                  sx={{ ...customeTextFeild, mb: 2 }}
                                  value={item.warranty || ""}
                                  onChange={(e) => {
                                    const updatedValue = e.target.value;
                                    setRepairServiceList((prevList) =>
                                      prevList.map((obj, index) =>
                                        index === i
                                          ? { ...obj, warranty: updatedValue }
                                          : obj
                                      )
                                    );
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
                                  Service Details
                                </Typography>
                                <TextEditor
                                  convertedContent={item.details}
                                  setConvertedContent={(updatedValue) =>
                                    handleDetailsChange(i, updatedValue)
                                  }
                                  data={item.details}
                                />
                              </Grid>
                            </Grid>
                            <Products
                              previousData={item}
                              selectedProducts={item.selectedProducts}
                              setSelectedProducts={(newProducts) => {
                                setRepairServiceList((prevList) =>
                                  prevList.map((obj, index) =>
                                    index === i
                                      ? {
                                          ...obj,
                                          selectedProducts: newProducts,
                                        }
                                      : obj
                                  )
                                );
                              }}
                            />
                          </Box>
                        </>
                      ))}
                  </Box>
                </div>
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
                        onClick={() => console.log("stepList", stepList)}
                      >
                        Step
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box sx={{ px: 2 }}>
                    {stepList?.length > 0 &&
                      stepList?.map((item, i) => (
                        <>
                          <Box
                            sx={{
                              p: 2,
                              // background: "#F9FAFB",
                              mb: 2,
                              borderRadius: "8px",
                              border: "2px solid #F9FAFB",
                            }}
                          >
                            <Grid container spacing={1}>
                              <Grid size={6}>
                                <Typography
                                  variant="medium"
                                  color="text.main"
                                  gutterBottom
                                  sx={{ fontWeight: 500 }}
                                >
                                  Service Step Image * (Size 100 : 100)
                                </Typography>

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
                                  <Box
                                    style={{
                                      border: "1px solid #cccccc",
                                      borderRadius: "4px",
                                      p: 4,
                                    }}
                                  >
                                    <input
                                      // required
                                      id="fileInput"
                                      type="file"
                                      accept="image/png, image/jpg, image/jpeg, image/webp"
                                      onChange={(e) => {
                                        const file = e.target.files[0];
                                        setStepList((prevList) =>
                                          prevList.map((obj, index) =>
                                            index === i
                                              ? { ...obj, step_image: file }
                                              : obj
                                          )
                                        );
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid size={6}>
                                <Typography
                                  variant="medium"
                                  color="text.main"
                                  gutterBottom
                                  sx={{ fontWeight: 500 }}
                                >
                                  Service Step Title *
                                </Typography>
                                <TextField
                                  size="small"
                                  fullWidth
                                  id="title"
                                  placeholder="Full Title"
                                  variant="outlined"
                                  sx={{ ...customeTextFeild, mb: 2 }}
                                  value={item.title || ""}
                                  onChange={(e) => {
                                    const updatedValue = e.target.value;
                                    setStepList((prevList) =>
                                      prevList.map((obj, index) =>
                                        index === i
                                          ? { ...obj, title: updatedValue }
                                          : obj
                                      )
                                    );
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
                                  Service Step Details *
                                </Typography>
                                <TextEditor
                                  convertedContent={item.details}
                                  setConvertedContent={(updatedValue) =>
                                    handleStepDetailsChange(i, updatedValue)
                                  }
                                  data={item.details}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </>
                      ))}
                  </Box>
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
                to="/service-list"
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
      )}
    </>
  );
};

export default UpdateService;
