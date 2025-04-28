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

import { Box, Divider, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { getDataWithToken } from "../../services/GetDataService";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import Checkbox from "@mui/material/Checkbox";

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
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import { handlePutData } from "../../services/PutDataService";

import { handlePostData } from "../../services/PostDataService";
import moment from "moment";
import { transferStatusList } from "../../data";
import { AuthContext } from "../../context/AuthContext";

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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#F9FAFB",
  padding: "16px 12px",
  borderRadius: "8px !important",
  border: "1px solid #EAECF0",
  cursor: "pointer",
}));
const BlogDetails = ({ clearFilter }) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [branchList, setBranchList] = useState([]);
  const [transferFrom, setTransferFrom] = useState("");
  const [transferTo, setTransferTo] = useState("");

  const [purchaseDate, setPurchaseDate] = useState(null);
  const [shippingCharge, setShippingCharge] = useState("");

  const [note, setNote] = useState("");
  const [transferStatus, setTransferStatus] = useState("");
  const [productList, setProductList] = useState([]);

  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const [message, setMessage] = useState("");
  const [details, setDetails] = useState("");

  const { enqueueSnackbar } = useSnackbar();

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

  const getBranchList = async () => {
    setLoading2(true);

    let url = `/api/v1/branch/dropdownlist`;
    let allData = await getDataWithToken(url);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setBranchList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };

  const getData = async () => {
    setLoading3(true);

    let url = `/api/v1/service/${encodeURIComponent(id.trim())}`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data", allData?.data?.data);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setDetails(allData?.data?.data[0]);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading3(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading3(false);
  };
  useEffect(() => {
    // getDropdownList();
    // getCategoryList();
    // getBrandList();
    getData();
    // getBranchList();
  }, []);
  return (
    <>
      <Box container sx={{ padding: "24px 0" }}>
        <Typography
          variant="h6"
          gutterBottom
          component="div"
          sx={{ color: "#0F1624", fontWeight: 600 }}
        >
          Service Details
        </Typography>
      </Box>

      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
        }}
      >
        <Box sx={{ padding: "12px", margin: "16px" }}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Brand :{" "}
                <b>
                  {details?.brand_data?.length > 0
                    ? details?.brand_data[0]?.name
                    : "---------"}
                </b>
              </Typography>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Device :{" "}
                <b>
                  {details?.device_data?.length > 0
                    ? details?.device_data[0]?.name
                    : "---------"}
                </b>
              </Typography>
            </Grid>

            <Grid size={8}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Model :{" "}
                <b>
                  {details?.model_data?.length > 0
                    ? details?.model_data[0]?.name
                    : "---------"}
                </b>
              </Typography>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Branches :{" "}
                <b>
                  {details?.branch_data?.length > 0 &&
                    details?.branch_data?.map((item, i) => (
                      <span>
                        {item?.name}{" "}
                        {details?.branch_data?.length !== i + 1 && ", "}
                      </span>
                    ))}
                </b>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </div>

      <Box
        sx={{
          mt: 1,
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
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 2, xl: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
            >
              Service List ({details?.repair_info?.length})
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
          <TableContainer
            // sx={{ height: "Calc(100vh - 340px)" }}
            sx={{ height: "300px" }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Image</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Name</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Cost</TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Guaranty
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Warranty
                  </TableCell>
                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell> */}
                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>Device</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Model</TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>Price</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Warranty
                  </TableCell>
                 
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Serial No
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Description
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>*/}

                  {/* <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                    Actions
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  details?.repair_info?.length > 0 &&
                  details?.repair_info?.map((row, i) => (
                    <TableRow
                      key={i}
                      // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell sx={{ width: 50 }}>
                        <img
                          src={
                            row?.repair_image
                              ? row?.repair_image?.url
                              : "/noImage.jpg"
                          }
                          alt=""
                          width={40}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: "130px" }}>
                        {row?.name ? row?.name : "---------"}{" "}
                      </TableCell>

                      <TableCell sx={{ minWidth: "130px" }}>
                        {row?.repair_cost ? row?.repair_cost : "---------"}
                      </TableCell>
                      <TableCell sx={{ minWidth: "130px" }}>
                        {row?.guaranty ? row?.guaranty : "---------"}
                      </TableCell>
                      <TableCell sx={{ minWidth: "130px" }}>
                        {row?.warranty ? row?.warranty : "---------"}
                      </TableCell>

                      {/* <TableCell align="right">
                        <IconButton
                          onClick={() =>
                            setProductList(
                              productList?.filter(
                                (res) => res.sku_number !== row?.sku_number
                              )
                            )
                          }
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.2837 7.5L11.9952 15M8.00481 15L7.71635 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.875 4.96358M16.023 4.82547L15.1332 16.3938C15.058 17.3707 14.2434 18.125 13.2637 18.125H6.73631C5.75655 18.125 4.94198 17.3707 4.86683 16.3938L3.97696 4.82547M16.023 4.82547C15.0677 4.6812 14.1013 4.57071 13.125 4.49527M3.125 4.96358C3.40798 4.91456 3.69198 4.86851 3.97696 4.82547M3.97696 4.82547C4.93231 4.6812 5.89874 4.57071 6.875 4.49527M13.125 4.49527V3.73182C13.125 2.74902 12.3661 1.92853 11.3838 1.8971C10.9244 1.8824 10.463 1.875 10 1.875C9.53696 1.875 9.07565 1.8824 8.61618 1.8971C7.63388 1.92853 6.875 2.74902 6.875 3.73182V4.49527M13.125 4.49527C12.0938 4.41558 11.0516 4.375 10 4.375C8.94836 4.375 7.9062 4.41558 6.875 4.49527"
                              stroke="#4A5468"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
      <Box
        sx={{
          mt: 1,
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
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 2, xl: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
            >
              Step
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
          <TableContainer
            // sx={{ height: "Calc(100vh - 340px)" }}
            sx={{ height: "300px" }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Image</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Title</TableCell>

                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell> */}
                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>Device</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Model</TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>Price</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Warranty
                  </TableCell>
                 
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Serial No
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Description
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>*/}

                  {/* <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                    Actions
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  details?.steps?.length > 0 &&
                  details?.steps?.map((row, i) => (
                    <TableRow
                      key={i}
                      // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell sx={{ width: 50 }}>
                        <img
                          src={
                            row?.step_image
                              ? row?.step_image?.url
                              : "/noImage.jpg"
                          }
                          alt=""
                          width={40}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: "130px" }}>
                        {row?.title ? row?.title : "---------"}{" "}
                      </TableCell>

                      {/* <TableCell align="right">
                        <IconButton
                          onClick={() =>
                            setProductList(
                              productList?.filter(
                                (res) => res.sku_number !== row?.sku_number
                              )
                            )
                          }
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.2837 7.5L11.9952 15M8.00481 15L7.71635 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.875 4.96358M16.023 4.82547L15.1332 16.3938C15.058 17.3707 14.2434 18.125 13.2637 18.125H6.73631C5.75655 18.125 4.94198 17.3707 4.86683 16.3938L3.97696 4.82547M16.023 4.82547C15.0677 4.6812 14.1013 4.57071 13.125 4.49527M3.125 4.96358C3.40798 4.91456 3.69198 4.86851 3.97696 4.82547M3.97696 4.82547C4.93231 4.6812 5.89874 4.57071 6.875 4.49527M13.125 4.49527V3.73182C13.125 2.74902 12.3661 1.92853 11.3838 1.8971C10.9244 1.8824 10.463 1.875 10 1.875C9.53696 1.875 9.07565 1.8824 8.61618 1.8971C7.63388 1.92853 6.875 2.74902 6.875 3.73182V4.49527M13.125 4.49527C12.0938 4.41558 11.0516 4.375 10 4.375C8.94836 4.375 7.9062 4.41558 6.875 4.49527"
                              stroke="#4A5468"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </>
  );
};

export default BlogDetails;
