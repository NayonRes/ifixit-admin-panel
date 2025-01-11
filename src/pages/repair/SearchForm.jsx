import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { getDataWithToken } from "../../services/GetDataService";

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
  device,
  setDevice,
  repairBy,
  setRepairBy,
  repairStatus,
  setRepairStatus,
  deliveryStatus,
  setDeliveryStatus,
}) => {
  const [brandList, setBrandList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const getUser = async (searchValue) => {
    let url = `/api/v1/customer?name=${name}&mobile=${searchValue}`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data", allData?.data.data?.[0]);
    setContactData(allData?.data.data?.[0]);
  };

  const getBrand = async () => {
    let url = `/api/v1/brand`;
    let allData = await getDataWithToken(url);
    setBrandList(allData?.data.data);
  };

  const getDevice = async () => {
    let url = `/api/v1/device`;
    let allData = await getDataWithToken(url);
    setDeviceList(allData?.data.data);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getUser();
    }
  };

  const handleSearch = (e) => {
    let searchValue = e.target.value;
    if (searchValue.length <= 11) {
      setSearchPrams(searchValue);
    }
    if (searchValue.length === 11) {
      getUser(searchValue);
    }
  };

  useEffect(() => {
    getBrand();
    getDevice();
  }, []);

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
        {searchPrams}
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
          onChange={handleSearch}
          // onKeyDown={handleKeyDown}
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
          {brandList?.length < 1 && (
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
            id="customer_type"
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 250, // Set the max height here
                },
              },
            }}
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
            }}
          >
            {brandList?.map((item) => (
              <MenuItem key={item.brand_id} value={item.brand_id}>
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
        {/* <FormControl
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
          {deviceList?.length < 1 && (
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
            id="device"
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 250, // Set the max height here
                },
              },
            }}
            value={device}
            onChange={(e) => setDevice(e.target.value)}
          >
            {deviceList?.map((item) => (
              <MenuItem key={item} value={item.device_id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
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
          value={repairBy}
          onChange={(e) => {
            setRepairBy(e.target.value);
          }}
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
          onChange={(e) => {
            setRepairStatus(e.target.value);
          }}
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
          onChange={(e) => {
            setDeliveryStatus(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default SearchForm;
