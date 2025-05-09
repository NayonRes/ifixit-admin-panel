import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { getDataWithToken } from "../../services/GetDataService"; 
import { useSnackbar } from "notistack";
import { AuthContext } from "../../context/AuthContext";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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

const SaleSearchForm = ({
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
  steps,
  setSteps,
  serialLoading,
  setSerialLoading,
  serialHistoryList,
  setSerialHistoryList,
  technicianLoading,
  setTechnicianLoading,
  technicianList,
  setTechnicianList,

  previousRepairData,
  setPreviousRepairData,
}) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);

  const getBranchId = () => {
    let token = ifixit_admin_panel.token;
    let decodedToken = jwtDecode(token);
    let branch_id = decodedToken?.user?.branch_id;
    return branch_id;
  };

  const { sid } = useParams();

  

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
  const getSerialHistory = async () => {
    if (!location.pathname.includes("/update-repair")) {
      if (!serial.trim()) {
        handleSnakbarOpen("Please enter serial number", "error");
        return;
      }
    }

    setSerialLoading(true);

    let url = `/api/v1/repair?serial=${serial?.trim()}&limit=100&page=1`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data::::::", allData?.data?.data);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setSerialLoading(false);

      if (sid) {
        setSerialHistoryList(
          allData?.data?.data.filter((res) => res._id !== sid)
        );
      } else {
        setSerialHistoryList(allData?.data?.data);
      }
    } else {
      setSerialLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
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

 

 

  

  

  const handleSearch2 = (e) => {
    let searchValue = e.target.value;
    if (sid) {
      navigate("/add-repair");
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

  

  
  
   
 
  useEffect(() => {
   
   
    
   

    if (location.pathname.includes("/update-repair")) {
      getSerialHistory();
    }
  }, [previousRepairData]);
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
        {/* <button onClick={() => setSteps(1)}>Steps: {steps}</button> */}
        {!sid && (
          <TextField
            type="number"
            required
            size="small"
            fullWidth
            id="searchParams"
            placeholder="Search Number"
            variant="outlined"
            sx={{ ...customeTextFeild, mb: 3 }}
            onClick={() => setSteps("contact")}
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
        )}
        <Typography
          variant="medium"
          color="text.main"
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          Full Name
        </Typography>

        <TextField
          onClick={() => setSteps("contact")}
          size="small"
          fullWidth
          id="name"
          // placeholder="Enter Full Name"
          variant="outlined"
          sx={{
            ...customeTextFeild,
            mb: 3,
            "& .MuiInputBase-input.Mui-disabled": {
              color: "#333", // Change text color
              WebkitTextFillColor: "#333", // Ensures text color changes in WebKit browsers
              // background: "#eee",
              pointerEvents: "none", // ✅ Allows clicks to pass through
              cursor: "pointer",
            },
          }}
          value={contactData?.name}
          disabled
          // onChange={(e) => {
          //   setName(e.target.value);
          // }}
        />
      </div>
    </div>
  );
};

export default SaleSearchForm;
