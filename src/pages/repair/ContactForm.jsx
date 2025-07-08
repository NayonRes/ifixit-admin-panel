import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ratingList2, customerTypeList } from "../../data";
import CircleIcon from "@mui/icons-material/Circle";
import { handlePostData } from "../../services/PostDataService";
import { useSnackbar } from "notistack";
import { AuthContext } from "../../context/AuthContext";

const disabledStyles = {
  disabledInput: {
    color: "black",
  },
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
  "& .MuiInputBase-input.Mui-disabled": {
    color: "#333", // Change text color
    WebkitTextFillColor: "#333", // Ensures text color changes in WebKit browsers
    background: "#eee",
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

const ContactForm = ({ searchPrams, contactData, setContactData }) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  console.log("searchPrams", searchPrams);

  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [customerType, setCustomerType] = useState("Walk In");
  const [email, setEmail] = useState("");
  const [remark, setRemark] = useState("");
  const [rating, setRating] = useState("");
  const [color, setColor] = useState("");
  const [membershipId, setMembershipId] = useState("");

  const [ratingList, setRatingList] = useState([
    { _id: 1, name: "Excellent", color: "#6439FF" },
    { _id: 2, name: "Good", color: "#00B781" },
    { _id: 3, name: "Neutral", color: "#79D7BE" },
    { _id: 4, name: "Bad", color: "#F0BB78" },
    { _id: 5, name: "Very Bad", color: "#EB5B00" },
  ]);
  // const [customerTypeList, setCustomerTypeList] = useState([
  //   "Walk In",
  //   "Corporate",
  // ]);

  const handleRatingWithColor = (rating_id) => {
    const selectedRating = ratingList.find((r) => r._id === rating_id);

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircleIcon
          style={{ color: selectedRating.color, height: "20px", width: "20px" }}
        />
        {selectedRating.name}
      </Box>
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
    setFullName("");
    setMobile("");
    setEmail("");
    setCustomerType("");
    setRating("");
    setMembershipId("");
    setRemark("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    let data = {
      name: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      customer_type: customerType.trim(),
      rating: rating,
      membership_id: membershipId.trim(),
      remarks: remark.trim(),
    };

    let response = await handlePostData("/api/v1/customer/create", data, false);

    console.log("response", response);

    if (response?.status === 401) {
      logout();
      return;
    }
    console.log("response?.data?.data-----------new customer");

    if (response.status >= 200 && response.status < 300) {
      setLoading(false);
      handleSnakbarOpen("Added successfully", "success");
      setContactData(response?.data?.data);

      clearForm();
    } else {
      setLoading(false);
      handleSnakbarOpen(response?.data?.message, "error");
    }

    // }
  };

  const getInitData = async () => {
    if (contactData) {
      setFullName(contactData?.name);
      setMobile(contactData?.mobile);
      setCustomerType(contactData?.customer_type);
      setEmail(contactData?.email);
      setRemark(contactData?.remarks);
      setRating(contactData?.rating);
      setMembershipId(contactData?.membership_id);
    }
  };

  useEffect(() => {
    getInitData();
    // console.log('ddd', contactData?._id)
  }, [contactData]);
  useEffect(() => {
    setMobile(searchPrams);
  }, [searchPrams]);

  return (
    <form onSubmit={onSubmit}>
      <Grid container columnSpacing={3} sx={{}}>
        <Grid size={6}>
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
            id="full_name"
            placeholder="Full Name"
            variant="outlined"
            disabled={contactData?._id}
            sx={{ ...customeTextFeild, mb: 3 }}
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
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
            Mobile Number
          </Typography>
          <TextField
            required
            size="small"
            type="number"
            fullWidth
            id="mobile"
            placeholder="Enter Number"
            variant="outlined"
            disabled={contactData?._id}
            sx={{ ...customeTextFeild, mb: 3 }}
            value={mobile}
            // onChange={(e) => {
            //   setMobile(e.target.value);
            // }}

            onChange={(e) => {
              if (e.target.value.length <= 11 && /^\d*$/.test(e.target.value)) {
                setMobile(e.target.value);
              }
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
            Customer Type
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
            {customerType?.length < 1 && (
              <InputLabel
                id="demo-simple-select-label"
                sx={{ color: "#b3b3b3", fontWeight: 300 }}
              >
                Select Customer Type
              </InputLabel>
            )}
            <Select
              inputProps={{
                sx: {
                  color: "red", // Change text color
                  WebkitTextFillColor: "#333",
                  "&.Mui-disabled": {
                    color: "#333",
                    WebkitTextFillColor: "#333",
                    background: "#eee",
                  },
                },
              }}
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
              value={customerType}
              disabled={contactData?._id}
              onChange={(e) => setCustomerType(e.target.value)}
            >
              {customerTypeList?.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
          {customerTypeList?.length < 1 && (
            <InputLabel
              id="demo-simple-select-label"
              sx={{ color: "#b3b3b3", fontWeight: 300 }}
            >
              Select Customer type
            </InputLabel>
          )}
          <Select
            inputProps={{
              sx: {
                color: "red", // Change text color
                WebkitTextFillColor: "#333",
                "&.Mui-disabled": {
                  color: "#333",
                  WebkitTextFillColor: "#333",
                  background: "#eee",
                },
              },
            }}
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
            value={customerType}
            disabled={contactData?._id}
            onChange={(e) => setCustomerType(e.target.value)}
          >
            {customerTypeList?.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
        </Grid>
        <Grid size={6}>
          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Email
          </Typography>
          <TextField
            // required
            type="email"
            size="small"
            fullWidth
            id="email"
            placeholder="Enter Email"
            variant="outlined"
            sx={{ ...customeTextFeild, mb: 3 }}
            value={email}
            disabled={contactData?._id}
            onChange={(e) => {
              setEmail(e.target.value);
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
            Remark
          </Typography>
          <TextField
            // required
            size="small"
            fullWidth
            id="remark"
            placeholder="Enter Remark"
            variant="outlined"
            sx={{ ...customeTextFeild, mb: 3 }}
            value={remark}
            disabled={contactData?._id}
            onChange={(e) => {
              setRemark(e.target.value);
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
            Rating
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
            {rating?.length < 1 && (
              <InputLabel
                id="demo-simple-select-label"
                sx={{ color: "#b3b3b3", fontWeight: 300 }}
              >
                Select Customer Rating
              </InputLabel>
            )}
            <Select
              // required
              labelId="demo-simple-select-label"
              id="type"
              inputProps={{
                sx: {
                  color: "red", // Change text color
                  WebkitTextFillColor: "#333",
                  "&.Mui-disabled": {
                    color: "#333",
                    WebkitTextFillColor: "#333",
                    background: "#eee",
                  },
                },
              }}
              className="custom-disabled-select"
              disabled={contactData?._id}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              {ratingList2?.map((item) => (
                <MenuItem key={item} value={item.name}>
                  {/* <CircleIcon
                        style={{ color: "red", height: "20px", width: "20px" }}
                      />{" "}
                      {item.name} */}

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircleIcon
                      style={{
                        color: ratingList2?.find(
                          (res) => res?.name === item.name
                        )?.color,
                        height: "20px",
                        width: "20px",
                      }}
                    />
                    {item.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* <br />

        

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
          {ratingList?.length < 1 && (
            <InputLabel
              id="demo-simple-select-label"
              sx={{ color: "#b3b3b3", fontWeight: 300 }}
            >
              Select Rating
            </InputLabel>
          )}
          <span
            style={{
              background: color,
              height: 16,
              width: 16,
              borderRadius: "50%",
              marginRight: 10,
              position: "absolute",
              left: 12,
              top: 12,
            }}
          ></span>
          {contactData ? (
            <TextField
              required
              size="small"
              fullWidth
              id="rating"
              placeholder="Enter Remark"
              variant="outlined"
              sx={{ ...customeTextFeild, mb: 3 }}
              value={rating}
            />
          ) : (
            <Select
              required
              labelId="demo-simple-select-label"
              id="rating"
              sx={{
                paddingLeft: 2,
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 250, // Set the max height here
                  },
                },
              }}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              {ratingList?.map((item) => (
                <MenuItem
                  key={item?._id}
                  value={item?._id}
                  onClick={() => setColor(item?.color)}
                >
                  <span
                    style={{
                      background: item?.color,
                      height: 16,
                      width: 16,
                      borderRadius: "50%",
                      marginRight: 10,
                    }}
                  ></span>{" "}
                  {item?.name}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl> */}
        </Grid>
        <Grid size={6}>
          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Membership ID
          </Typography>
          <TextField
            type="text"
            size="small"
            fullWidth
            placeholder="Enter Membership ID"
            variant="outlined"
            sx={{ ...customeTextFeild, mb: 3 }}
            disabled={contactData?._id}
            value={membershipId}
            onChange={(e) => {
              setMembershipId(e.target.value);
            }}
          />
        </Grid>
        {!contactData?._id && (
          <Grid size={12}>
            <Box
              sx={{
                borderTop: "1px solid #EAECF1",
                pt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button variant="contained" sx={buttonStyle} type="submit">
                Add Contact
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default ContactForm;

const buttonStyle = {
  px: 2,
  py: 1.25,
  fontSize: "14px",
  fontWeight: 600,
  minWidth: "127px",
  minHeight: "44px",
};
