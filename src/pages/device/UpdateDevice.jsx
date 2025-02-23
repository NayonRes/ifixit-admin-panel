import React, { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { Box, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import { getDataWithToken } from "../../services/GetDataService";

import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { designationList, roleList } from "../../data";
import { handlePostData } from "../../services/PostDataService";
import { handlePutData } from "../../services/PutDataService";
import ImageUpload from "../../utils/ImageUpload";

const UpdateDevice = ({ clearFilter, row }) => {
  const navigate = useNavigate();
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [name, setName] = useState("");
  const [parent_id, setParent_id] = useState("");
  const [deviceBrandId, setDeviceBrandId] = useState("");

  const [file, setFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [status, setStatus] = useState("");
  const [deviceBrandList, SetDeviceBrandList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderNo, setOrderNo] = useState();
  const [message, setMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const dropzoneRef = useRef(null);

  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setUpdateDialog(false);
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
    setFile(null);
    setIconFile(null);
    setStatus("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    var formdata = new FormData();
    formdata.append("name", name.trim());

    if (deviceBrandId) {
      formdata.append("device_brand_id", deviceBrandId);
    }

    formdata.append("parent_id", parent_id === "None" ? "" : parent_id);

    formdata.append("order_no", orderNo);
    formdata.append("status", status);
    if (file) {
      formdata.append("image", file);
    }
    if (iconFile) {
      formdata.append("icon", iconFile);
    }
    let response = await handlePutData(
      `/api/v1/device/update/${row?._id}`,
      formdata,
      true
    );

    console.log("response", response);
    if (response?.status === 401) {
      logout();
      return;
    }
    if (response.status >= 200 && response.status < 300) {
      handleSnakbarOpen("Updated successfully", "success");
      clearFilter(); // this is for get the table list again
      clearForm();
      handleDialogClose();
    } else {
      setLoading(false);
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

    let url = `/api/v1/deviceBrand/dropdownlist`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      SetDeviceBrandList(allData?.data?.data);

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
  useEffect(() => {
    setName(row?.name);
    setOrderNo(row?.order_no);
    setParent_id(row?.parent_id === null ? "" : row?.parent_id);
    setDeviceBrandId(row?.device_brand_id === null ? "" : row?.device_brand_id);
    setStatus(row?.status);
  }, [updateDialog]);
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
     Update Device
      </Button> */}

      <IconButton
        variant="contained"
        // color="success"
        disableElevation
        onClick={() => {
          setUpdateDialog(true);
          getDropdownList();
          getDeviceList();
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
          Update Device
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
            maxWidth: "400px",
            minWidth: "400px",
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
            Device Name
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
            Select Device Brand
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
            {deviceBrandId?.length < 1 && (
              <InputLabel
                id="demo-simple-select-label"
                sx={{ color: "#b3b3b3", fontWeight: 300 }}
              >
                Select Device Brand
              </InputLabel>
            )}
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
              value={deviceBrandId}
              onChange={(e) => {
                setDeviceBrandId(e.target.value);
              }}
            >
              {deviceBrandList?.map((item) => (
                <MenuItem key={item} value={item?._id}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Select Parent Device
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
                Select Parent Device
              </InputLabel>
            )}
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
              value={parent_id}
              onChange={(e) => {
                setParent_id(e.target.value);
              }}
            >
              <MenuItem value={"None"}>None</MenuItem>
              {deviceList?.map((item) => (
                <MenuItem key={item} value={item?._id}>
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
            {/* {parent_id?.length < 1 && (
              <InputLabel
                id="demo-simple-select-label"
                sx={{ color: "#b3b3b3", fontWeight: 300 }}
              >
                Select Status
              </InputLabel>
            )} */}
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
          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Device Image
          </Typography>
          <Box sx={{ mb: 3 }}>
            <ImageUpload
              file={file}
              setFile={setFile}
              dimension=" Dimensions (1 : 1)"
            />
          </Box>

          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Device Icon
          </Typography>
          <Box>
            <ImageUpload
              file={iconFile}
              setFile={setIconFile}
              dimension=" Dimensions (1 : 1)"
            />
          </Box>
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

export default UpdateDevice;
