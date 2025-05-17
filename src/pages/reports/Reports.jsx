import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ColorPalette from "../../color-palette/ColorPalette";
import { BackHand } from "@mui/icons-material";
import { getDataWithToken } from "../../services/GetDataService";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

import { useSnackbar } from "notistack";

const style = {
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 3,
    pb: 1,
    borderBottom: `1px solid ${ColorPalette.light.primary.light}`,
    width: "100%",
  },
  link: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 1,
    px: "4px",
  },
  linkActive: {
    cursor: "pointer",
    color: ColorPalette.light.primary.main,
    display: "flex",
    alignItems: "center",
    position: "relative",
    gap: 1,
    px: "4px",
    "&:before": {
      content: '""',
      width: "100%",
      height: "2px",
      backgroundColor: ColorPalette.light.primary.main,
      position: "absolute",
      bottom: -9,
      left: 0,
      right: 0,
    },
  },
  card: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 2,
    border: `1px solid ${ColorPalette.light.primary.light}`,
    backgroundColor: ColorPalette.light.text.bg,
    borderRadius: "8px",
    height: "100%",
    width: "100%",
    p: 2,
  },
  cardActive: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 2,
    border: `1px solid ${ColorPalette.light.primary.main}`,
    backgroundColor: ColorPalette.light.text.bg,
    borderRadius: "8px",
    height: "100%",
    width: "100%",
    p: 2,
  },
};

const Reports = ({
  technician,
  setTechnician,
  technicianName,
  setTechnicianName,
}) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);

  const { enqueueSnackbar } = useSnackbar();
  const [technicianList, setTechnicianList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [message, setMessage] = useState("");

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

  const getBranchId = () => {
    let token = ifixit_admin_panel.token;
    let decodedToken = jwtDecode(token);
    let branch_id = decodedToken?.user?.branch_id;
    return branch_id;
  };
  const getTechnician2 = async () => {
    setLoading(true);

    let branch_id = getBranchId();
    // let url = `/api/v1/device/get-by-parent?parent_name=Primary`;
    let newBranchId;
    if (ifixit_admin_panel?.user?.is_main_branch) {
      newBranchId = selectedBranch;
    } else {
      newBranchId = branch_id;
    }

    let url = `/api/v1/user/dropdownlist?designation=Technician&branch_id=${newBranchId}`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    console.log("technician list", allData?.data.data);

    if (allData.status >= 200 && allData.status < 300) {
      setTechnicianList(allData?.data.data);

      let name = allData?.data.data.filter((i) => i._id === technician);
      // setTechnicianName(name[0]?.name);

      if (allData.data.data.length < 1) {
        setMessage("No Data found");
      } else {
        setMessage("");
      }
    } else {
      handleSnakbarOpen(allData?.data?.message, "error");
      setLoading(false);
    }
    setLoading(false);
  };
  const getTechnician = async () => {
    setLoading2(true);

    let branch_id = getBranchId();

    let newBranchId;

    let url = `/api/v1/user/dropdownlist?designation=Manager`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    console.log("technician list", allData?.data.data);

    if (allData.status >= 200 && allData.status < 300) {
      setLoading2(false);

      const groupedData = {};

      allData?.data.data.forEach((user) => {
        user.branch_data.forEach((branch) => {
          if (!groupedData[branch._id]) {
            groupedData[branch._id] = {
              branch_data: {
                _id: branch._id,
                name: branch.name,
              },
              users: [],
            };
          }
          groupedData[branch._id].users.push(user);
        });
      });

      const finalArray = Object.values(groupedData);

      console.log("finalArray*********************", finalArray);

      setTechnicianList(finalArray);
      // setTechnicianList(allData?.data.data);

      let name = allData?.data.data.filter((i) => i._id === technician);
      // setTechnicianName(name[0]?.name);

      // if (allData.data.data.length < 1) {
      //   setMessage("No Data found");
      // } else {
      //   setMessage("");
      // }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
  };
  const getBranchData = async () => {
    setLoading(true);

    let branch_id = getBranchId();
    setSelectedBranch(branch_id);

    let url = `/api/v1/branch/dropdownlist`;
    let allData = await getDataWithToken(url);
    console.log("BranchData:", allData?.data?.data);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setBranchList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        // setMessage("No data found");
      }
    } else {
      setLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   getBranchData();
  // }, []);
  useEffect(() => {
    getTechnician();
  }, []);

  return (
    <div>
      <Grid container columnSpacing={3} style={{ padding: "24px 0" }}>
        <Grid size={9}>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ color: "#0F1624", fontWeight: 600 }}
          >
            Reports
          </Typography>
        </Grid>
        <Grid size={3} style={{ textAlign: "right" }}>
          {/* <Button
            disableElevation
            variant="outlined"
            size="large"
            // startIcon={<FilterListIcon />}
            onClick={() => setOpen(!open)}
          >
            {open ? <FilterListOffIcon /> : <FilterListIcon />}
          </Button> */}

          {/* <IconButton
            onClick={() => setOpen(!open)}
            // size="large"
            aria-label="show 5 new notifications"
            color="inherit"
          >
            <Badge badgeContent={5} color="error">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.3807 14.2348C13.9595 14.0475 15.4819 13.6763 16.9259 13.1432C15.7286 11.8142 14.9998 10.0547 14.9998 8.125V7.54099C14.9999 7.52734 15 7.51368 15 7.5C15 4.73858 12.7614 2.5 10 2.5C7.23858 2.5 5 4.73858 5 7.5L4.99984 8.125C4.99984 10.0547 4.27106 11.8142 3.07373 13.1432C4.51784 13.6763 6.04036 14.0475 7.61928 14.2348M12.3807 14.2348C11.6 14.3274 10.8055 14.375 9.99984 14.375C9.19431 14.375 8.3999 14.3274 7.61928 14.2348M12.3807 14.2348C12.4582 14.4759 12.5 14.7331 12.5 15C12.5 16.3807 11.3807 17.5 10 17.5C8.61929 17.5 7.5 16.3807 7.5 15C7.5 14.7331 7.54183 14.476 7.61928 14.2348"
                  stroke="#656E81"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Badge>
          </IconButton> */}
        </Grid>
      </Grid>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{}}>
          {!loading2 &&
            technicianList.length > 0 &&
            technicianList.map((item, index) => (
              <>
                <Typography
                  variant="base"
                  sx={{ width: "100%", fontWeight: 600 }}
                >
                  {item?.branch_data?.name}
                </Typography>
                {item?.users?.length > 0 &&
                  item?.users?.map((item, i) => (
                    <Grid size={3} key={i}>
                      <Box
                        sx={
                          technician === item._id
                            ? style.cardActive
                            : style.card
                        }
                        role="button"
                        onClick={() => {
                          // setTechnician(item._id);
                          // setTechnicianName(item.name);
                        }}
                      >
                        <Box>
                          <img
                            src={
                              item?.image?.url?.length > 0
                                ? item?.image?.url
                                : "/userpic.png"
                            }
                            alt=""
                            width="40px"
                            height="40px"
                            style={{
                              display: "block",
                              margin: "5px 0px",
                              borderRadius: "100px",
                              // border: "1px solid #d1d1d1",
                            }}
                          />
                        </Box>

                        <Box>
                          <Typography variant="medium">{item.name}</Typography>
                          <Typography
                            variant="small"
                            color="text.secondary"
                            sx={{ mt: "2px" }}
                          >
                            {item.designation}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
              </>
            ))}

          {!loading2 && message && (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", mt: 4, width: "100%" }}
            >
              {message}
            </Typography>
          )}

          {loading2 && (
            <Grid size={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                <Skeleton variant="rectangular" height={110} sx={{ flex: 1 }} />
                <Skeleton variant="rectangular" height={110} sx={{ flex: 1 }} />
                <Skeleton variant="rectangular" height={110} sx={{ flex: 1 }} />
                <Skeleton variant="rectangular" height={110} sx={{ flex: 1 }} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </div>
  );
};

export default Reports;
