import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  useContext,
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
import { AuthContext } from "../../context/AuthContext";

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

const blogBodyObject = {
  title: "",
  details: "",

  image: null,
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
const AddBlog = ({ clearFilter }) => {
  const { id } = useParams();
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const [branchName, setBranchName] = React.useState([]);
  const [addDialog, setAddDialog] = useState(false);
  const [name, setName] = useState("");
  const [convertedContent, setConvertedContent] = useState("");

  const [title, setTitle] = useState();
  const [subtitle, setSubtitle] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [image, setImage] = useState(null);
  const [orderNo, setOrderNo] = useState();
  const [details, setDetails] = useState("");
  const [detailsForTextEditorShow, setDetailsForTextEditorShow] = useState("");
  const [status, setStatus] = useState("");
  const [allData, setAllData] = useState({});

  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(false);

  const [blogBodyInfoList, setBlogBodyInfoList] = useState([blogBodyObject]);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [message, setMessage] = useState("");

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
    setSubtitle("");

    setDetails("");
    setFile(null);
    setImage(null);
    setRemarks("");
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

    const newBodyInfo = await Promise.all(
      blogBodyInfoList?.map(async (item) => ({
        ...item,

        image:
          item?.image instanceof File
            ? await fileToBase64(item?.image)
            : item?.image,
      }))
    );

    let data = {
      title: title,
      subtitle: subtitle,

      body_info: newBodyInfo,
      description: details,
      conclusion: conclusion,
      order_no: orderNo,
      status: status,
    };
    if (image) {
      data.image = await fileToBase64(image);
    }
    console.log("data", data);

    let response = await handlePutData(
      `/api/v1/blog/update/${id}`,
      data,
      false
    );

    console.log("response", response?.data?.data?._id);

    if (response?.status === 401) {
      logout();
      return;
    }

    if (response.status >= 200 && response.status < 300) {
      setLoading(false);
      navigate("/blog-list");
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

  const handleDetailsChange = (index, updatedValue) => {
    setBlogBodyInfoList((prevList) =>
      prevList.map((obj, i) =>
        i === index ? { ...obj, details: updatedValue } : obj
      )
    );
  };
  const getData = async () => {
    setLoading3(true);

    let url = `/api/v1/blog/${encodeURIComponent(id.trim())}`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data", allData?.data?.data);
    console.log(
      "allData?.data?.data?.description",
      allData?.data?.data?.description
    );

    if (allData.status >= 200 && allData.status < 300) {
      setDetailsForTextEditorShow(allData?.data?.data?.description);
      setTitle(allData?.data?.data?.title);
      setSubtitle(allData?.data?.data?.subtitle);
      setOrderNo(allData?.data?.data?.order_no);
      setDetails(allData?.data?.data?.description);
      setConclusion(allData?.data?.data?.conclusion);
      setBlogBodyInfoList(allData?.data?.data?.body_info);
      setStatus(allData?.data?.data?.status);
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
            Update Blog
          </Typography>
        </Grid>
        <Grid size={6} style={{ textAlign: "right" }}></Grid>
      </Grid>
      {Object.keys(allData || {}).length > 0 && (
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
                  Blog Thumbnail Image * (Dimension 3 : 2)
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
                  Blog Title *
                </Typography>
                <TextField
                  required
                  size="small"
                  fullWidth
                  id="name"
                  placeholder="Blog Title"
                  variant="outlined"
                  sx={{ ...customeTextFeild, mb: 2 }}
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
                  Blog Subtitle *
                </Typography>
                <TextField
                  required
                  size="small"
                  fullWidth
                  id="subtitle"
                  placeholder="Blog Title"
                  variant="outlined"
                  sx={{ ...customeTextFeild, mb: 2 }}
                  value={subtitle}
                  onChange={(e) => {
                    setSubtitle(e.target.value);
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
                  Blog Description *
                </Typography>

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
                          console.log("blogBodyInfoList", blogBodyInfoList)
                        }
                      >
                        Blog Body
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
                          setBlogBodyInfoList([
                            ...blogBodyInfoList,
                            blogBodyObject,
                          ])
                        }
                      >
                        Add Blog
                      </Button>
                    </Grid>
                  </Grid>
                  <Box sx={{ px: 2 }}>
                    {blogBodyInfoList?.length > 0 &&
                      blogBodyInfoList?.map((item, i) => (
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
                                  if (blogBodyInfoList.length > 1) {
                                    setBlogBodyInfoList((prevList) =>
                                      prevList.filter((_, index) => index !== i)
                                    );
                                  } else {
                                    handleSnakbarOpen(
                                      "Minimum 1 blog have to add",
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
                                  Blog Image * (Dimension 3 : 2)
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
                                        setBlogBodyInfoList((prevList) =>
                                          prevList.map((obj, index) =>
                                            index === i
                                              ? { ...obj, image: file }
                                              : obj
                                          )
                                        );
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid size={8}>
                                <Typography
                                  variant="medium"
                                  color="text.main"
                                  gutterBottom
                                  sx={{ fontWeight: 500 }}
                                >
                                  Blog Image Title *
                                </Typography>
                                <TextField
                                  required
                                  size="small"
                                  fullWidth
                                  id="name"
                                  placeholder="Full Name"
                                  variant="outlined"
                                  sx={{ ...customeTextFeild, mb: 2 }}
                                  value={item.title || ""}
                                  onChange={(e) => {
                                    const updatedValue = e.target.value;
                                    setBlogBodyInfoList((prevList) =>
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
                                  Blog Details
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
                          </Box>
                        </>
                      ))}

                    <Grid size={12}>
                      <Typography
                        variant="medium"
                        color="text.main"
                        gutterBottom
                        sx={{ fontWeight: 500 }}
                      >
                        Blog Conclusion *
                      </Typography>
                      <TextField
                        required
                        size="small"
                        fullWidth
                        multiline
                        rows={4}
                        id="conclusion"
                        placeholder="Blog Conclusion"
                        variant="outlined"
                        sx={{ ...customeTextFeild, mb: 2 }}
                        value={conclusion}
                        onChange={(e) => {
                          setConclusion(e.target.value);
                        }}
                      />
                    </Grid>
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
                to="/blog-list"
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

export default AddBlog;
