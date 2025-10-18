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

import { Link, useParams } from "react-router-dom";

import { useSnackbar } from "notistack";
import axios from "axios";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { AuthContext } from "../../context/AuthContext";
import { Box, Chip, Collapse, TableContainer } from "@mui/material";
import Grid from "@mui/material/Grid2";

import dayjs from "dayjs";

import moment from "moment";
import Slide from "@mui/material/Slide";

import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import AddWarranty from "./AddWarranty";
import { statusList } from "../../data";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const WarrantyList = () => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const { rid } = useParams();
  const [tableDataList, setTableDataList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [status, setStatus] = useState("");

  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [startingTime, setStartingTime] = useState(null);
  const [endingTime, setEndingTime] = useState(null);

  const [imageDialog, setImageDialog] = useState(false);
  const [images, setImages] = useState([]);
  const [detailDialog, setDetailDialog] = useState(false);
  const [details, setDetails] = useState([]);

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

  const pageLoading = () => {
    let content = [];
    let loadingNumber = 7;

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

  const handleChangePage = (event, newPage) => {
    console.log("newPage", newPage);
    getData(newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log("event.target.value", event.target.value);
    setRowsPerPage(parseInt(event.target.value, rowsPerPage));
    getData(0, event.target.value);
    setPage(0);
  };

  const getData = async (pageNO, limit, newUrl) => {
    setLoading(true);
    let newPageNO = page;
    let url;
    if (pageNO >= 0) {
      newPageNO = pageNO;
    }
    let newLimit = rowsPerPage;
    if (limit) {
      newLimit = limit;
    }
    if (newUrl) {
      url = newUrl;
    } else {
      let newStatus = status;

      let newStartingTime = "";
      let newEndingTime = "";
      if (status === "None") {
        newStatus = "";
      }

      if (startingTime !== null) {
        newStartingTime = dayjs(startingTime).format("YYYY-MM-DD");
      }
      if (endingTime !== null) {
        newEndingTime = dayjs(endingTime).format("YYYY-MM-DD");
      }

      url = `/api/v1/warranty?repair_id=${rid}&startDate=${newStartingTime}&endDate=${newEndingTime}&status=${newStatus}&limit=${newLimit}&page=${
        newPageNO + 1
      }`;
    }
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setTableDataList(allData?.data?.data);
      // setRowsPerPage(allData?.data?.limit);
      setTotalData(allData?.data?.totalData);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading(false);
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
            Warranty List
          </Typography>
        </Grid>
        <Grid size={6} style={{ textAlign: "right" }}>
          {ifixit_admin_panel?.user?.permission?.includes("update_repair") && (
            <>
              {/* <AddWarranty /> */}

              <Button
                variant="outlined"
                disableElevation
                size="small"
                color="secondary"
                component={Link}
                to={`/repair/${rid}/add-warranty`}
                // sx={{ py: 1.125, px: 2, borderRadius: "6px" }}

                startIcon={<AddOutlinedIcon />}
              >
                Add Warranty
              </Button>
            </>
          )}
        </Grid>
      </Grid>
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
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Warranty No
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Paid Amount
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Due Amount
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Discount Amount
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Total Service charge
                  </TableCell>

                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>Price</TableCell>*/}

                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                    Price / <br />
                    Not on sale
                  </TableCell> */}
                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                    Serial No
                  </TableCell> */}
                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>
                    Description
                  </TableCell> */}
                  <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>
                  {ifixit_admin_panel?.user?.permission?.includes(
                    "view_spare_parts_details"
                  ) && (
                    <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  tableDataList.length > 0 &&
                  tableDataList.map((row, i) => (
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
                        {row?.warranty_id}
                      </TableCell>

                      {/* <TableCell>
                        {row?.brand_data[0]?.name
                          ? row?.brand_data[0]?.name
                          : "---------"}
                      </TableCell>

                      <TableCell>
                        {row?.category_data[0]?.name
                          ? row?.category_data[0]?.name
                          : "---------"}
                      </TableCell>
                      <TableCell>
                        {row?.device_data[0]?.name
                          ? row?.device_data[0]?.name
                          : "---------"}
                      </TableCell>
                      <TableCell>
                        {row?.model_data[0]?.name
                          ? row?.model_data[0]?.name
                          : "---------"}
                      </TableCell> */}
                      {/* <TableCell>
                        {row?.price ? row?.price : "---------"}
                      </TableCell> */}

                      {/* <TableCell>
                        {row?.product_id ? row?.product_id : "---------"}
                      </TableCell> */}

                      {/* <TableCell sx={{ minWidth: "150px" }}>
                        {row?.description ? row?.description : "---------"}
                      </TableCell> */}
                      <TableCell>
                        {row?.payment_info?.length > 0
                          ? row?.payment_info.reduce(
                              (sum, item) => sum + item.amount,
                              0
                            )
                          : 0}
                      </TableCell>
                      <TableCell sx={{ color: "#D92D20" }}>
                        {row?.due_amount > -1 ? row?.due_amount : "-------"}
                      </TableCell>
                      <TableCell sx={{ color: "#D92D20" }}>
                        {row?.discount_amount > -1
                          ? row?.discount_amount
                          : "-------"}
                      </TableCell>
                      <TableCell>
                        {row?.service_charge > -1
                          ? row?.service_charge
                          : "-------"}
                      </TableCell>

                      <TableCell sx={{ minWidth: "150px" }}>
                        {row?.remarks ? row?.remarks : "---------"}
                      </TableCell>
                      <TableCell>
                        {row?.repair_status_history_data?.length > 0
                          ? (() => {
                              const lastStatus =
                                row.repair_status_history_data[
                                  row.repair_status_history_data.length - 1
                                ];
                              const statusColor =
                                statusList.find(
                                  (el) =>
                                    el.name === lastStatus.repair_status_name
                                )?.color || "";

                              return (
                                <Chip
                                  label={lastStatus.repair_status_name}
                                  variant="outlined"
                                  sx={{
                                    border: "0px",
                                    backgroundColor: statusColor,
                                  }}
                                />
                              );
                            })()
                          : "----------"}
                      </TableCell>
                      {/* <TableCell align="center" style={{ minWidth: "130px" }}>
                        <Invoice data={row} />
                      </TableCell> */}
                      {ifixit_admin_panel?.user?.permission?.includes(
                        "view_spare_parts_details"
                      ) && (
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            color="text"
                            disabled={
                              row?.transfer_status === "Received" ||
                              row?.transfer_status === "Canceled"
                            }
                            sx={{
                              "& svg": {
                                opacity: ["Received", "Canceled"].includes(
                                  row?.transfer_status
                                )
                                  ? 0.5
                                  : 1,
                              },
                            }}
                            startIcon={
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="Outline"
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
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
                            }
                            component={Link}
                            to={`/repair/${rid}/update-warranty/${row?._id}`}
                            state={{ row }}
                          >
                            Update
                          </Button>
                          {/* <UpdateSpareParts clearFilter={clearFilter} row={row} /> */}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}

                {!loading && tableDataList.length < 1 ? (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell colSpan={7} style={{ textAlign: "center" }}>
                      <strong> {message}</strong>
                    </TableCell>
                  </TableRow>
                ) : null}
                {loading && pageLoading()}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {tableDataList.length > 0 ? (
          <div>
            <TablePagination
              style={{ display: "block", border: "none" }}
              rowsPerPageOptions={[]}
              count={totalData}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        ) : (
          <br />
        )}
      </div>
    </>
  );
};

export default WarrantyList;
