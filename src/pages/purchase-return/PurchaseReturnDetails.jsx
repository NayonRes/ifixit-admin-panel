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
import { Link } from "react-router-dom";
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
import AddPurchaseReturn from "./AddPurchaseReturn";

import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
// import UpdateSpareParts from "./UpdateSpareParts";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const PurchaseReturnDetails = ({ details }) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  return (
    <div
      style={{
        overflowX: "auto",

        minWidth: "100%",
        // width: "Calc(100vw - 385px)",
        // padding: "10px 16px 0px",
        boxSizing: "border-box",
      }}
    >
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Product Name
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Purchase date
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Branch</TableCell>

              <TableCell style={{ whiteSpace: "nowrap" }}>
                Purchase price
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>SKU Number</TableCell>
              <TableCell style={{ minWidth: "150px" }}>Note</TableCell>
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
                            <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>
          
                            <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                              Actions
                            </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              details?.length > 0 &&
              details?.map((row, i) => (
                <TableRow
                  key={i}
                  // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {/* <TableCell sx={{ width: 50 }}>
                                      <img
                                        src={
                                          row?.images?.length > 0
                                            ? row?.images[0]?.url
                                            : "/noImage.jpg"
                                        }
                                        alt=""
                                        width={40}
                                      />
                                    </TableCell> */}
                  <TableCell sx={{ minWidth: "130px" }}>
                    {row?.product_data
                      ? row?.product_data[0]?.name
                      : "---------"}{" "}
                    &nbsp;{" "}
                    {row?.product_variation_data
                      ? row?.product_variation_data[0]?.name
                      : "---------"}
                  </TableCell>

                  <TableCell>
                    {moment(row?.purchase_data[0]?.purchase_date).format(
                      "DD/MM/YYYY"
                    )}
                  </TableCell>
                  <TableCell>
                    {row?.branch_data ? row?.branch_data[0]?.name : "---------"}
                  </TableCell>
                  <TableCell sx={{ minWidth: "130px" }}>
                    {row?.purchase_products_data
                      ? row?.purchase_products_data[0]?.unit_price
                      : "---------"}
                  </TableCell>
                  <TableCell>{row?.sku_number}</TableCell>
                  <TableCell>
                    {" "}
                    {row?.remarks ? row?.remarks : "----------"}
                  </TableCell>
                </TableRow>
              ))}

            {details?.length < 1 ? (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  <strong> No data found</strong>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PurchaseReturnDetails;
