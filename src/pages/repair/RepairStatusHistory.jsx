import React, { useEffect, useState, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  IconButton,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import { statusList } from "../../data.js";

import { getDataWithToken } from "../../services/GetDataService";
import { AuthContext } from "../../context/AuthContext";
import { enqueueSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";
import { handlePutData } from "../../services/PutDataService.js";
import { useParams, useSearchParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { handlePostData } from "../../services/PostDataService.js";

export default function RepairStatusHistory({
  contactData,
  repair_status_history_data,
  technicianLoading,
  setTechnicianLoading,
  technicianList,
  setTechnicianList,
  repairStatus,
  setRepairStatus,
  setLastUpdatedRepairStatus,
  repairStatusRemarks,
  setRepairStatusRemarks,
  technician,
  setTechnician,
}) {
  const [searchParams] = useSearchParams();
  const { rid } = useParams();

  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [tableDataList, setTableDataList] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = useState("");
  const [remarks, setRemarks] = useState("");
  const [technecialId, setTechnecialId] = useState("");
  const [edit, setEdit] = useState();
  const [updateData, setUpdateData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [newStatusTechnicianId, setNewStatusTechnicianId] = useState("");
  const [newStatusRemarks, setNewStatusRemarks] = useState("");

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
  const pageLoading = () => {
    let content = [];
    let loadingNumber = 5;

    for (let i = 0; i < 10; i++) {
      content.push(
        <TableRow key={i}>
          {[...Array(loadingNumber).keys()].map((e, i) => (
            <TableCell key={i}>
              <Skeleton></Skeleton>
            </TableCell>
          ))}
        </TableRow>
      );
    }
    return content;
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    setSaveLoading(true);

    let data = {
      repair_id: rid,
      user_id: technician,
      repair_status_name: repairStatus,
      remarks: newStatusRemarks,
    };

    let response = await handlePostData(
      `/api/v1/repairStatusHistory/create`,
      data,
      false
    );

    console.log("response", response);
    if (response?.status === 401) {
      logout();
      return;
    }
    if (response.status >= 200 && response.status < 300) {
      setSaveLoading(false);
      handleSnakbarOpen("Updated successfully", "success");
      getData();
      setUpdateData({});
      setNewStatusRemarks("");
    } else {
      setSaveLoading(false);
      handleSnakbarOpen(response?.data?.message, "error");
    }

    // }
  };
  const onUpdate = async (e) => {
    e.preventDefault();

    setUpdateLoading(true);

    let data = {
      user_id: technecialId,
      remarks: remarks,
    };

    let response = await handlePutData(
      `/api/v1/repairStatusHistory/update/${updateData?._id}`,
      data,
      false
    );

    console.log("response", response);
    if (response?.status === 401) {
      logout();
      return;
    }
    if (response.status >= 200 && response.status < 300) {
      setUpdateLoading(false);
      handleSnakbarOpen("Updated successfully", "success");
      getData();
      setUpdateData({});
    } else {
      setUpdateLoading(false);
      handleSnakbarOpen(response?.data?.message, "error");
    }

    // }
  };

  const getColor = (name) => {
    let co = statusList.filter((i) => i.name == name);
    console.log("co", co?.[0]?.color);
    return co?.[0]?.bg;
  };

  const getData = async () => {
    setLoading(true);

    let url = `/api/v1/repairStatusHistory?repair_id=${rid}&limit=100&page=1`;
    // let url = `/api/v1/repair?serial=${serial}&limit=100&page=1`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data::::::", allData?.data?.data);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setTableDataList(allData?.data?.data);

      setLastUpdatedRepairStatus(allData?.data?.data[0]?.repair_status_name);

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
    // console.log("repair_status_history_data", statusList);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, p: 2 }}>
          New History
        </Typography>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{}}>Status</TableCell>
                <TableCell>Note</TableCell>
                {/* <TableCell align="right">Action</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ color: getColor(repairStatus) }}>
                  {repairStatus}{" "}
                </TableCell>

                {/* <TableCell sx={{ minWidth: "10px", width: "300px" }}>
                  <FormControl
                    fullWidth
                    size="small"
                    sx={{
                      // ...customeSelectFeildSmall,
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
                      required
                      labelId="demo-simple-select-label"
                      id="purchase_product_status"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 250, // Set the max height here

                            "& .MuiMenuItem-root": {
                              fontSize: "14px",
                            },
                          },
                        },
                      }}
                      value={technician}
                      onChange={(e) => setTechnician(e.target.value)}

                      //  value={
                      //    updateData?.purchase_product_status ||
                      //    ""
                      //  }
                      //  onChange={(e) =>
                      //    handleInputChange(
                      //      "purchase_product_status",
                      //      e.target.value
                      //    )
                      //  }
                    >
                      {technicianList?.map((item) => (
                        <MenuItem key={item?._id} value={item?._id}>
                          {item?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell> */}
                <TableCell sx={{ minWidth: "10px" }}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    id="remarks"
                    placeholder="Note"
                    variant="outlined"
                    sx={{
                      ...customeTextFeild,
                      "& .MuiOutlinedInput-input": {
                        padding: "6.5px 12px",
                        fontSize: "14px",
                      },
                      minWidth: "150px",
                    }}
                    value={repairStatusRemarks}
                    onChange={(e) => setRepairStatusRemarks(e.target.value)}
                    // onChange={(e) => setNewStatusRemarks(e.target.value)}
                  />
                </TableCell>

                {/* <TableCell
                  align="right"
                  sx={{ whiteSpace: "nowrap", width: "90px" }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    disabled={saveLoading}
                    sx={{
                      minHeight: "33px",
                      minWidth: "80px",
                    }}
                    onClick={onSubmit}
                  >
                    <PulseLoader
                      color={"#4B46E5"}
                      loading={saveLoading}
                      size={10}
                      speedMultiplier={0.5}
                    />{" "}
                    {saveLoading === false && "Save"}
                  </Button>
                </TableCell> */}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Paper>
        <Typography variant="body1" sx={{ fontWeight: 600, p: 2 }}>
          History ({tableDataList.length})
        </Typography>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Note</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {!loading &&
                tableDataList?.length > 0 &&
                tableDataList.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      sx={{ color: getColor(item?.repair_status_name) }}
                    >
                      {item?.repair_status_name}{" "}
                    </TableCell>
                    <TableCell>
                      {moment(item?.created_at).format("DD MMM YYYY")}
                      <span style={{ display: "block", color: "#666" }}>
                        {moment(item?.created_at).format("h:mm:ss A")}
                      </span>{" "}
                    </TableCell>

                    <TableCell sx={{ minWidth: "10px" }}>
                      {updateData._id === item._id ? (
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{
                            // ...customeSelectFeildSmall,
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
                            required
                            labelId="demo-simple-select-label"
                            id="purchase_product_status"
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: 250, // Set the max height here

                                  "& .MuiMenuItem-root": {
                                    fontSize: "14px",
                                  },
                                },
                              },
                            }}
                            value={technecialId}
                            onChange={(e) => setTechnecialId(e.target.value)}

                            //  value={
                            //    updateData?.purchase_product_status ||
                            //    ""
                            //  }
                            //  onChange={(e) =>
                            //    handleInputChange(
                            //      "purchase_product_status",
                            //      e.target.value
                            //    )
                            //  }
                          >
                            {technicianList?.map((item) => (
                              <MenuItem key={item?._id} value={item?._id}>
                                {item?.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <>{item?.user_data[0]?.name}</>
                      )}
                    </TableCell>
                    <TableCell sx={{ minWidth: "10px" }}>
                      {updateData._id === item._id ? (
                        <TextField
                          fullWidth
                          required
                          size="small"
                          id="remarks"
                          placeholder="Note"
                          variant="outlined"
                          multiline
                          rows={2}
                          sx={{
                            ...customeTextFeild,
                            "& .MuiOutlinedInput-input": {
                              padding: "6.5px 12px",
                              fontSize: "14px",
                            },
                            minWidth: "150px",
                          }}
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                      ) : (
                        <>
                          {item.remarks?.length > 0
                            ? item.remarks
                            : "----------"}
                        </>
                      )}
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{ whiteSpace: "nowrap", width: "180px" }}
                    >
                      {updateData._id === item._id ? (
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            color="text"
                            disabled={updateLoading}
                            sx={{ mr: 1 }}
                            onClick={() => {
                              setUpdateData({});
                              setRemarks("");
                              setTechnecialId("");
                            }}
                          >
                            {" "}
                            Cancel
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={updateLoading}
                            sx={{
                              minHeight: "33px",
                              minWidth: "80px",
                            }}
                            onClick={onUpdate}
                          >
                            <PulseLoader
                              color={"#4B46E5"}
                              loading={updateLoading}
                              size={10}
                              speedMultiplier={0.5}
                            />{" "}
                            {updateLoading === false && "Update"}
                          </Button>
                        </>
                      ) : (
                        <IconButton
                          variant="contained"
                          // color="success"
                          disableElevation
                          disabled={item.purchase_product_status === "Received"}
                          onClick={() => {
                            setTechnecialId(item?.user_data[0]?._id);
                            setUpdateData(item);
                            setRemarks(item?.remarks);
                          }}
                          sx={{
                            opacity:
                              item.purchase_product_status === "Received" &&
                              0.5,
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
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              {/* <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell sx={{ color: "#F6AC3C" }}>Hold </TableCell>
              <TableCell>
                14 Apr 2024{" "}
                <span style={{ display: "block", color: "#666" }}>
                  5:25:35 PM
                </span>{" "}
              </TableCell>
              <TableCell>Wade Warren</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  id="outlined-multiline-flexible"
                  multiline
                  maxRows={4}
                  placeholder="Add Note"
                />
              </TableCell>
              <TableCell>
                <IconButton>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow> */}

              {!loading && tableDataList.length < 1 ? (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell colSpan={4} style={{ textAlign: "center" }}>
                    <strong> {message}</strong>
                  </TableCell>
                </TableRow>
              ) : null}
              {loading && pageLoading()}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
