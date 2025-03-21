import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getDataWithToken } from "../../services/GetDataService";
import IssueList from "./IssueList";
import { useSnackbar } from "notistack";
import { AuthContext } from "../../context/AuthContext";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

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

const styles = {
  issue_list: { display: "flex", flexDirection: "column", gap: 1, mb: 3 },
  issue_list_item: {
    p: 1,
    border: "1px solid #818FF8",
    borderRadius: 1,
    background: "#E0E8FF",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: 45,
    ".issue_list_btn": {
      display: "none",
    },
    "&:hover": {
      cursor: "pointer",
      "& .issue_list_btn": {
        display: "block",
      },
    },
  },
  // issue_list_btn: {
  //   display: "none",
  // },
};

const SearchForm = ({
  contactData,
  setContactData,
  searchPrams,
  setSearchPrams,
  name,
  setName,
  serial,
  setSerial,
  passCode,
  setPassCode,
  brand,
  setBrand,
  brand_id,
  setBrandId,
  device,
  setDevice,
  repairBy,
  setRepairBy,
  repairStatus,
  setRepairStatus,
  deliveryStatus,
  setDeliveryStatus,
  parentList,
  setParentList,
  technician,
  technicianName,
  setTechnicianName,
  allIssue,
  setAllIssue,
  allSpareParts,
  setAllSpareParts,
  set_customer_id,
  setScreenType,
}) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  let repairId = searchParams.get("repairId");

  const [brandList, setBrandList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  // console.log('all is', allIssue)

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

  const getUser = async (searchValue) => {
    let url = `/api/v1/customer?mobile=${searchValue || contactData?.mobile}`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    console.log("allData?.data", allData?.data.data?.[0]);

    if (allData?.status >= 200 && allData?.status < 300) {
      setContactData(allData?.data.data?.[0]);
      set_customer_id(allData?.data.data?.[0]?._id);
    } else {
      handleSnakbarOpen(allData?.data?.message, "error");
    }
  };

  const getParent = async () => {
    // let url = `/api/v1/device/get-by-parent?parent_name=Primary`;
    let url = `/api/v1/device/parent-child-list`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    console.log("primary list", allData?.data.data);
    let p = allData?.data?.data;

    if (allData?.status >= 200 && allData?.status < 300) {
      setParentList(p);
      let items = p.filter((item) => item.parent_name == "Primary");
      let newItems = items[0].items.filter(
        (device) => device.name !== "Primary"
      );
      console.log("hello", newItems);
      setBrandList(newItems);
    } else {
      handleSnakbarOpen(allData?.data?.message, "error");
    }
  };

  const getBrand = async () => {
    let url = `/api/v1/brand`;
    let allData = await getDataWithToken(url);

    if (allData.status >= 200 && allData.status < 300) {
      setBrandList(allData?.data.data);
    } else {
      handleSnakbarOpen(allData?.data?.message, "error");
    }
  };

  const getDevice = async () => {
    let url = `/api/v1/device`;
    let allData = await getDataWithToken(url);

    if (allData?.status >= 200 && allData?.status < 300) {
      setDeviceList(allData?.data.data);
    } else {
      handleSnakbarOpen(allData?.data?.message, "error");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getUser();
    }
  };

  const handleSearch = (e) => {
    let searchValue = e.target.value;

    if (searchValue.length < 11) {
      set_customer_id("");
      setContactData({ name: "" });
      setName("");
      setSerial("");
      setPassCode("");
      setBrandId("");
      setDevice("");
      setAllIssue([]);
      setAllSpareParts([]);
      setTechnicianName("");
      setRepairStatus("");
      setDeliveryStatus("");
      navigate("/repair-search");
      setSearchPrams(searchValue);
    }
    if (searchValue.length === 11) {
      setSearchPrams(searchValue);
      set_customer_id("");
      setContactData(null);
      setName("");
      getUser(searchValue);
    }
  };

  const handleSearch2 = (e) => {
    let searchValue = e.target.value;
    if (repairId) {
      navigate("/repair-search");
    }
    if (searchValue.length < 11) {
      console.log("under 11");
      setContactData({ name: "" });
      // set_customer_id("");
      // setName("");
      // setSerial("");
      // setPassCode("");
      // setBrandId("");
      // setBrand("");
      // setDevice("");
      // setAllIssue([]);
      // setAllSpareParts([]);
      // setTechnicianName("");
      // setRepairStatus("");
      // setDeliveryStatus("");
    }
    if (searchValue.length === 11) {
      console.log("equal 11");
      setContactData({});
      setSerial("");
      setPassCode("");
      setBrandId("");
      setBrand("");
      setDevice("");
      setAllIssue([]);
      setAllSpareParts([]);
      setTechnicianName("");
      setRepairStatus("");
      setDeliveryStatus("");
      setName("");

      getUser(searchValue);
    }
    if (searchValue.length < 12) {
      console.log("less 12");
      setSearchPrams(searchValue);
    }
  };

  const removeItem = (id) => {
    setAllIssue(allIssue.filter((item) => item.id !== id));
  };

  const removeSpareParts = (id) => {
    setAllSpareParts(allSpareParts.filter((item) => item._id !== id));
  };

  const handleBranchClick = () => {
    if (!serial) {
      document.getElementById("serial").focus();
      handleSnakbarOpen("Enter Serial Please", "error");
      return;
    }
    if (!passCode) {
      document.getElementById("passcode").focus();
      handleSnakbarOpen("Enter Pass Code Please", "error");
      return;
    }
  };

  useEffect(() => {
    // getBrand();
    getParent();
    getDevice();
  }, []);
  // useEffect(() => {
  //   if (contactData?.mobile) {
  //     getUser();
  //   }
  // }, []);

  return (
    <div>
      <div
        sx={{
          maxWidth: "400px",
          minWidth: "400px",
          px: 2,
          borderBottom: "1px solid #EAECF1",
          my: 1,
        }}
      >
        {/* {JSON.stringify(allIssue)} */}
        <TextField
          type="number"
          required
          size="small"
          fullWidth
          id="searchParams"
          placeholder="Search"
          variant="outlined"
          sx={{ ...customeTextFeild, mb: 3 }}
          value={searchPrams}
          onChange={handleSearch2}
          // onKeyDown={handleSearch2}
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
                      d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z"
                      stroke="#667085"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </InputAdornment>
              ),
            },
          }}
        />
        <Typography
          variant="medium"
          color="text.main"
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          Full Name
        </Typography>
        <TextField
          required
          size="small"
          fullWidth
          id="name"
          placeholder="Enter Full Name"
          variant="outlined"
          sx={{
            ...customeTextFeild,
            mb: 3,
            "& .MuiInputBase-input.Mui-disabled": {
              color: "#333", // Change text color
              WebkitTextFillColor: "#333", // Ensures text color changes in WebKit browsers
              // background: "#eee",
            },
          }}
          value={contactData?.name}
          disabled
          // onChange={(e) => {
          //   setName(e.target.value);
          // }}
        />
        <Typography
          variant="medium"
          color="text.main"
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          Serial
        </Typography>
        <TextField
          required
          size="small"
          fullWidth
          id="serial"
          placeholder="Enter Serial"
          variant="outlined"
          sx={{ ...customeTextFeild, mb: 3 }}
          value={serial}
          onChange={(e) => {
            setSerial(e.target.value);
          }}
        />
        <Typography
          variant="medium"
          color="text.main"
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          Pass Code
        </Typography>
        <TextField
          required
          size="small"
          fullWidth
          id="passcode"
          placeholder="Enter Pass Code"
          variant="outlined"
          sx={{ ...customeTextFeild, mb: 3 }}
          value={passCode}
          onChange={(e) => {
            setPassCode(e.target.value);
          }}
        />
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
            mb: 3,
          }}
        >
          {brand?.length < 1 && (
            <InputLabel
              id="demo-simple-select-label"
              sx={{ color: "#b3b3b3", fontWeight: 300 }}
            >
              Select Brand
            </InputLabel>
          )}
          <Select
            disabled={!serial || !passCode}
            required
            labelId="demo-simple-select-label"
            id="customer_type"
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 250, // Set the max height here
                },
              },
            }}
            value={brand}
            onClick={handleBranchClick}
            onChange={(e) => {
              setBrand(e.target.value);
              // setScreenType("steper");
            }}
          >
            {brandList?.map((item, index) => (
              <MenuItem
                key={index}
                value={item.name}
                onClick={() => setBrandId(item._id)}
              >
                {item.name}
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
          Device
        </Typography>
        <TextField
          required
          size="small"
          fullWidth
          id="device"
          placeholder="Enter Device"
          variant="outlined"
          sx={{ ...customeTextFeild, mb: 3 }}
          value={device}
          // onChange={(e) => {
          //   setDevice(e.target.value);
          // }}
        />
        {/* working */}
        {allIssue.length > 0 && (
          <Box sx={styles.issue_list}>
            {allIssue.map((item, index) => (
              <Box key={index} sx={styles.issue_list_item}>
                {item.name} | ৳ {item.repair_cost}
                <Box
                  role="button"
                  onClick={() => removeItem(item.id)}
                  className="issue_list_btn"
                  sx={{ mt: "4px" }}
                >
                  <CloseIcon />{" "}
                </Box>
              </Box>
            ))}
          </Box>
        )}
        {allSpareParts.length > 0 && (
          <Box sx={styles.issue_list}>
            {allSpareParts.map((item, index) => (
              <Box key={index} sx={styles.issue_list_item}>
                {item.name} | ৳ {item.price}
                <Box
                  role="button"
                  onClick={() => removeSpareParts(item._id)}
                  className="issue_list_btn"
                  sx={{ mt: "4px" }}
                >
                  <CloseIcon />{" "}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Typography
          variant="medium"
          color="text.main"
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          Repair By
        </Typography>
        <TextField
          required
          size="small"
          fullWidth
          id="repairBy"
          placeholder="Enter Repair By"
          variant="outlined"
          sx={{ ...customeTextFeild, mb: 3 }}
          value={technicianName}
          // onChange={(e) => {
          //   setRepairBy(e.target.value);
          // }}
        />
        <Typography
          variant="medium"
          color="text.main"
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          Repair Status
        </Typography>
        <TextField
          required
          size="small"
          fullWidth
          id="repairStatus"
          placeholder="Enter Repair Status"
          variant="outlined"
          sx={{ ...customeTextFeild, mb: 3 }}
          value={repairStatus}
          // onChange={(e) => {
          //   setRepairStatus(e.target.value);
          // }}
        />
        <Typography
          variant="medium"
          color="text.main"
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          Delivery Status
        </Typography>
        <TextField
          required
          size="small"
          fullWidth
          id="deliveryStatus"
          placeholder="Enter Delivery Status"
          variant="outlined"
          sx={{ ...customeTextFeild, mb: 3 }}
          value={deliveryStatus}
          // onChange={(e) => {
          //   setDeliveryStatus(e.target.value);
          // }}
        />
      </div>
    </div>
  );
};

export default SearchForm;
