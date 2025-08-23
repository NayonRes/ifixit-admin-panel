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
import { designationList, iphoneModels, roleList } from "../../data";
import { handlePostData } from "../../services/PostDataService";
import ImageUpload from "../../utils/ImageUpload";

import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";

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
const AddIssue = ({ clearFilter }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [addDialog, setAddDialog] = useState(false);
  const [name, setName] = useState("");
  const [parent_id, setParent_id] = useState("");
  const [deviceList, setDeviceList] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [orderNo, setOrderNo] = useState();
  const dropzoneRef = useRef(null);
  const [modelList, setModelList] = useState([]);
  const [model, setModel] = useState([]);
  const [modelNames, setModelNames] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleModelChange = (event) => {
    const {
      target: { value },
    } = event;
    setModel(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setAddDialog(false);
      setModelNames([]);
      setModel([]);
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

  const clearForm = () => {
    setName("");
    setOrderNo();
    setParent_id("");
    setModelNames([]);
    setModel([]);
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // var formdata = new FormData();
    // formdata.append("name", name);

    // formdata.append("parent_id", parent_id);
    let modelIds = model?.map(
      (item) => modelList.find((obj) => obj.name === item)._id
    );
    let formdata = new FormData();
    formdata.append("name", name.trim());
    formdata.append("order_no", orderNo);
    formdata.append("device_id", parent_id.trim());

    modelIds?.map((model_id) => formdata.append("model_id", model_id));
    // if (file) {
    //   formdata.append("image", file);
    // }

    // let data = {
    //   name: name.trim(),

    //   device_id: parent_id?.length > 0 ? parent_id : null,
    // };

    let response = await handlePostData("/api/v1/issue/create", formdata, true);

    console.log("response", response);
    if (response?.status === 401) {
      logout();
      return;
    }
    if (response.status >= 200 && response.status < 300) {
      handleSnakbarOpen("Added successfully", "success");
      clearFilter();
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

  const getDropdownList = async () => {
    setLoading2(true);

    let url = `/api/v1/device/leaf-dropdown`;
    let allData = await getDataWithToken(url);
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

    let url = `/api/v1/model/dropdownlist`;
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
  useEffect(() => {
    // getDropdownList();
    getModelList();
  }, []);
  return (
    <>
      <Button
        variant="contained"
        disableElevation
        sx={{ py: 1.125, px: 2, borderRadius: "6px" }}
        onClick={() => {
          setAddDialog(true);
          getDropdownList();
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
        Add Issue
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
          Add Model
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
          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Issue Name
          </Typography>
          <TextField
            required
            size="small"
            fullWidth
            id="name"
            placeholder="Full Name"
            variant="outlined"
            sx={{ ...customeTextFeild, mb: 3 }}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
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
            onWheel={(e) => e.target.blur()}
            size="small"
            fullWidth
            id="name"
            placeholder="Enter Order No"
            variant="outlined"
            sx={{ ...customeTextFeild, mb: 2 }}
            value={orderNo}
            onChange={(e) => {
              setOrderNo(e.target.value);
            }}
          />

          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Select Models
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

          {/* <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Select Device
          </Typography>

          <FormControl
            fullWidth
            size="small"
            sx={{
              mb: 3,
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
            {parent_id?.length < 1 && (
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
              id="baseLanguage"
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 250, // Set the max height here
                  },
                },
              }}
              value={parent_id}
              onChange={(e) => setParent_id(e.target.value)}
            >
              {deviceList?.map((item) => (
                <MenuItem key={item} value={item?._id}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          {/* <Box>
            <ImageUpload
              file={file}
              setFile={setFile}
              dimension="Size: (200 : 200)"
            />
          </Box> */}
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

export default AddIssue;
