import React, { useState, useEffect, useContext, useRef } from "react";
import { getDataWithToken } from "../../services/GetDataService";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Link, useParams } from "react-router-dom";
import TableChartIcon from "@mui/icons-material/TableChart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { useSnackbar } from "notistack";
import axios from "axios";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { AuthContext } from "../../context/AuthContext";
import { Box, Collapse, TableContainer } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import { DateField } from "@mui/x-date-pickers/DateField";
import Checkbox from "@mui/material/Checkbox";
import moment from "moment";
import Slide from "@mui/material/Slide";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ReactToPrint from "react-to-print";
import { designationList, roleList } from "../../data";
import AddSpareParts from "./AddSpareParts";
import UpdateSpareParts from "./UpdateSpareParts";
import { handlePutData } from "../../services/PutDataService";
import AddSparePartsVariation from "./AddSparePartsVariation";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const SparePartsDetails = () => {
  const { id } = useParams();
  console.log("id", id);
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [tableDataList, setTableDataList] = useState({});
  const [page, setPage] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [orderID, setOrderID] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState("");

  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [filterList, setFilterList] = useState([]);
  const [startingTime, setStartingTime] = useState(null);
  const [endingTime, setEndingTime] = useState(null);

  const [imageDialog, setImageDialog] = useState(false);
  const [images, setImages] = useState([]);
  const [detailDialog, setDetailDialog] = useState(false);
  const [details, setDetails] = useState([]);
  const [updateData, setUpdateData] = useState({});
  const [updateVariationLoading, setUpdateVariationLoading] = useState(false);

  const onVariationSubmit = async (e) => {
    e.preventDefault();

    setUpdateVariationLoading(true);

    const formData = new FormData();

    formData.append("name", updateData?.name.trim());
    formData.append("price", parseFloat(updateData?.price).toFixed(2));

    {
      updateData?.file !== null &&
        updateData?.file !== undefined &&
        formData.append("images", updateData?.file);
    }

    let response = await handlePutData(
      `/api/v1/sparePartVariation/update/${updateData?._id}`,
      formData,
      true
    );

    console.log("response", response);
    if (response?.status === 401) {
      logout();
      return;
    }
    if (response.status >= 200 && response.status < 300) {
      setUpdateVariationLoading(false);
      handleSnakbarOpen("Updated successfully", "success");
      getData(false);
      setUpdateData({});
    } else {
      setUpdateVariationLoading(false);
      handleSnakbarOpen(response?.data?.message, "error");
    }

    // }
  };

  const handleDetailClose = () => {
    setDetails({});
    setDetailDialog(false);
  };

  const customeTextFeild = {
    // padding: "15px 20px",
    // background: "#FAFAFA",
    "& label": {
      fontSize: "11px",
    },
    "& label.Mui-focused": {
      color: "#0F1624",
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-input": {
      padding: "8px 12px",
    },
    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px",
      fontSize: "13px",
      "& fieldset": {
        // borderColor: "rgba(0,0,0,0)",
        borderRadius: "8px",
      },

      "&:hover fieldset": {
        borderColor: "#969696",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#969696",
      },
    },
  };

  const handleImageClose = () => {
    setImages([]);
    setImageDialog(false);
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

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false);
    setDeleteData({});
  };

  const handleDeleteDialog = (i, row) => {
    setDeleteData({ index: i, row: row });
    setDeleteDialog(true);
  };

  const pageLoading = () => {
    let content = [];

    for (let i = 0; i < 10; i++) {
      content.push(
        <TableRow key={i}>
          {[...Array(11).keys()].map((e, i) => (
            <TableCell key={i}>
              <Skeleton></Skeleton>
            </TableCell>
          ))}
        </TableRow>
      );
    }
    return content;
  };

  const getData = async (controlLoading) => {
    setLoading(controlLoading ?? true);

    let url = `/api/v1/sparePart/${encodeURIComponent(id.trim())}`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data", allData?.data?.data);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setTableDataList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading(false);
  };

  const sortByParentName = (a, b) => {
    const nameA = a.parent_name.toUpperCase();
    const nameB = b.parent_name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  };

  // Handler for updating the updateData object
  const handleInputChange = (e) => {
    const { id, value } = e.target; // Get the input's id and value
    setUpdateData((prevData) => ({
      ...prevData,
      [id]: value, // Dynamically update the field
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      const reader = new FileReader();

      // Convert file to a Base64 URL for preview or upload
      reader.onload = () => {
        setUpdateData((prevData) => ({
          ...prevData,
          imagePreview: reader.result, // Store the preview (optional)
          file: file, // Store the file object (for actual upload)
        }));
      };

      reader.readAsDataURL(file); // Read file as Base64
    }
  };
  useEffect(() => {
    getData();
    // getCategoryList();
  }, []);

  return (
    <>
      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          padding: "16px 0",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          marginTop: "40px",
        }}
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 1.5, mb: 1.75 }}
        >
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
            >
              Spare Parts Details
            </Typography>
          </Grid>
        </Grid>
        <div
          style={{
            overflowX: "auto",

            minWidth: "100%",
            width: "Calc(100vw - 385px)",
            // padding: "10px 16px 0px",
            boxSizing: "border-box",
          }}
        >
          <TableContainer sx={{ maxHeight: "Calc(100vh - 250px)" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Name</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Brand</TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Category
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Device</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Model</TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>Price</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Warranty
                  </TableCell>
                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                    Price / <br />
                    Not on sale
                  </TableCell> */}
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Serial No
                  </TableCell>
                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                    Description
                  </TableCell> */}
                  <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>

                  <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading && Object.keys(tableDataList).length !== 0 && (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ minWidth: "130px" }}>
                      {tableDataList?.name}
                    </TableCell>

                    <TableCell>
                      {tableDataList?.brand_data[0]?.name
                        ? tableDataList?.brand_data[0]?.name
                        : "---------"}
                    </TableCell>

                    <TableCell>
                      {tableDataList?.category_data[0]?.name
                        ? tableDataList?.category_data[0]?.name
                        : "---------"}
                    </TableCell>
                    <TableCell>
                      {tableDataList?.device_data[0]?.name
                        ? tableDataList?.device_data[0]?.name
                        : "---------"}
                    </TableCell>
                    <TableCell>
                      {tableDataList?.model_data[0]?.name
                        ? tableDataList?.model_data[0]?.name
                        : "---------"}
                    </TableCell>
                    <TableCell>
                      {tableDataList?.price
                        ? tableDataList?.price
                        : "---------"}
                    </TableCell>

                    <TableCell>
                      {tableDataList?.warranty
                        ? tableDataList?.warranty
                        : "---------"}
                    </TableCell>
                    <TableCell>
                      {tableDataList?.sparePart_id
                        ? tableDataList?.sparePart_id
                        : "---------"}
                    </TableCell>

                    {/* <TableCell sx={{ minWidth: "150px" }}>
                      {tableDataList?.description
                        ? tableDataList?.description
                        : "---------"}
                    </TableCell> */}
                    <TableCell sx={{ minWidth: "150px" }}>
                      {tableDataList?.remarks
                        ? tableDataList?.remarks
                        : "---------"}
                    </TableCell>
                    <TableCell>
                      {tableDataList?.status ? (
                        <>
                          <TaskAltOutlinedIcon
                            style={{
                              color: "#10ac84",
                              height: "16px",
                              position: "relative",
                              top: "4px",
                            }}
                          />{" "}
                          <span
                            style={{
                              color: "#10ac84",
                            }}
                          >
                            Active &nbsp;
                          </span>
                        </>
                      ) : (
                        <>
                          <HighlightOffOutlinedIcon
                            style={{
                              color: "#ee5253",
                              height: "16px",
                              position: "relative",
                              top: "4px",
                            }}
                          />
                          <span
                            style={{
                              color: "#ee5253",
                            }}
                          >
                            Inactive
                          </span>
                        </>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <UpdateSpareParts getData={getData} row={tableDataList} />
                    </TableCell>
                  </TableRow>
                )}

                {loading && pageLoading()}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          padding: "16px 0",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
          marginTop: "20px",
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
              onClick={() => {
                console.log("updateData", updateData);
              }}
            >
              Variations
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }} sx={{ textAlign: "right" }}>
            {/* <Button
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
            >
              Add Variation
            </Button> */}
            <AddSparePartsVariation
              getData={getData}
              tableDataList={tableDataList}
            />
          </Grid>
        </Grid>

        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ whiteSpace: "nowrap" }}>Image</TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>Name</TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  Sell Price
                </TableCell>

                <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading &&
              Object.keys(tableDataList).length !== 0 &&
              tableDataList?.variation_data?.length > 0 ? (
                tableDataList?.variation_data?.map((item, i) => (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      {updateData._id === item._id ? (
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

                          <input
                            id="fileInput"
                            type="file"
                            accept="image/png, image/jpg, image/jpeg"
                            onChange={handleFileChange} // Handle file input changes
                          />
                        </Box>
                      ) : (
                        <img
                          src={
                            item?.images?.length > 0
                              ? item?.images[0]?.url
                              : "/noImage.png"
                          }
                          alt=""
                          width={40}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ minWidth: "130px" }}>
                      {updateData._id === item._id ? (
                        <TextField
                          required
                          size="small"
                          id="name"
                          placeholder="Variation Name"
                          variant="outlined"
                          sx={{
                            ...customeTextFeild,
                            "& .MuiOutlinedInput-input": {
                              padding: "6.5px 12px",
                              fontSize: "14px",
                            },
                            minWidth: "150px",
                          }}
                          value={updateData?.name || ""}
                          onChange={handleInputChange} // Attach the onChange handler
                        />
                      ) : (
                        <>{item?.name}</>
                      )}
                    </TableCell>
                    <TableCell sx={{ minWidth: "130px" }}>
                      {updateData._id === item._id ? (
                        <TextField
                          required
                          type="number"
                          size="small"
                          id="price"
                          placeholder="Price"
                          variant="outlined"
                          sx={{
                            ...customeTextFeild,
                            "& .MuiOutlinedInput-input": {
                              padding: "6.5px 12px",
                              fontSize: "14px",
                            },
                            minWidth: "150px",
                          }}
                          value={updateData.price || ""} // Assuming 'value' is the key for the number field
                          onChange={handleInputChange} // Attach the onChange handler
                          onWheel={(e) => e.target.blur()}
                        />
                      ) : (
                        item?.price
                      )}
                    </TableCell>

                    <TableCell
                      sx={{ whiteSpace: "nowrap", textAlign: "right" }}
                    >
                      {updateData._id === item._id ? (
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            color="text"
                            disabled={updateVariationLoading}
                            sx={{ mr: 1 }}
                            onClick={() => {
                              setUpdateData({});
                            }}
                          >
                            {" "}
                            Cancel
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={updateVariationLoading}
                            sx={{ minHeight: "33px", minWidth: "80px" }}
                            onClick={onVariationSubmit}
                          >
                            <PulseLoader
                              color={"#4B46E5"}
                              loading={updateVariationLoading}
                              size={10}
                              speedMultiplier={0.5}
                            />{" "}
                            {updateVariationLoading === false && "Update"}
                          </Button>
                        </>
                      ) : (
                        <IconButton
                          variant="contained"
                          // color="success"
                          disableElevation
                          onClick={() => setUpdateData(item)}
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

                          {/* <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.2836 7.5L11.9951 15M8.00475 15L7.71629 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.8749 4.96358M16.023 4.82547L15.1331 16.3938C15.058 17.3707 14.2434 18.125 13.2636 18.125H6.73625C5.75649 18.125 4.94191 17.3707 4.86677 16.3938L3.9769 4.82547M16.023 4.82547C15.0676 4.6812 14.1012 4.57071 13.1249 4.49527M3.12494 4.96358C3.40792 4.91456 3.69192 4.86851 3.9769 4.82547M3.9769 4.82547C4.93225 4.6812 5.89868 4.57071 6.87494 4.49527M13.1249 4.49527V3.73182C13.1249 2.74902 12.3661 1.92853 11.3838 1.8971C10.9243 1.8824 10.463 1.875 9.99994 1.875C9.5369 1.875 9.07559 1.8824 8.61612 1.8971C7.63382 1.92853 6.87494 2.74902 6.87494 3.73182V4.49527M13.1249 4.49527C12.0937 4.41558 11.0516 4.375 9.99994 4.375C8.9483 4.375 7.90614 4.41558 6.87494 4.49527"
                            stroke="#4A5468"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg> */}
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No variation added
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default SparePartsDetails;
