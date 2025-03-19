import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Checkbox, Skeleton, Typography } from "@mui/material";
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

const TechnicianList = ({
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
  const getTechnician = async () => {
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
      setTechnicianName(name[0]?.name);

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

  useEffect(() => {
    getBranchData();
  }, []);
  useEffect(() => {
    getTechnician();
  }, [selectedBranch]);

  return (
    <div>
      <Grid container columnSpacing={3} sx={{}}>
        <Grid size={12}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 3 }}>
            Repair By
          </Typography>
        </Grid>
        {/* <Grid size={12}>
          <Box sx={style.nav}>
            {ifixit_admin_panel?.user?.is_main_branch &&
              branchList.length > 0 &&
              branchList.map((item, index) => (
                <Box
                  role="button"
                  sx={
                    selectedBranch === item._id ? style.linkActive : style.link
                  }
                  key={index}
                  onClick={() => setSelectedBranch(item._id)}
                >
                  {item.name}
                </Box>
              ))}
          </Box>
        </Grid> */}
      </Grid>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {!loading &&
          technicianList.length > 0 &&
          technicianList.map((item, index) => (
            <Grid size={3} key={index}>
              <Box
                sx={technician === item._id ? style.cardActive : style.card}
                role="button"
                onClick={() => {
                  setTechnician(item._id);
                  setTechnicianName(item.name);
                }}
              >
                <Box>
                  <img src="/userpic.png" alt="" />
                </Box>

                <Box>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: "2px" }}
                  >
                    {item.designation}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}

        {!loading && message && (
          <Typography
            variant="h6"
            sx={{ textAlign: "center", mt: 4, width: "100%" }}
          >
            {message}
          </Typography>
        )}

        {!loading && (
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
    </div>
  );
};

export default TechnicianList;
