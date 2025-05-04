import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Skeleton,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ColorPalette from "../../color-palette/ColorPalette";
import { BackHand } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import RepairChecklist from "./RepairChecklist";
import SparePars from "./SparePars";
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    border: `1px solid ${ColorPalette.light.primary.light}`,
    backgroundColor: ColorPalette.light.text.bg,
    borderRadius: "8px",
    height: "100%",
    width: "100%",
    p: 2,
  },
  cardActive: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    // border: `1px solid ${ColorPalette.light.primary.main}`,
    backgroundColor: ColorPalette.light.text.bg,
    borderRadius: "8px",
    height: "100%",
    width: "100%",
    p: 2,
  },
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#F9FAFB",
  padding: "16px 12px",
  borderRadius: "8px !important",
  border: "1px solid #EAECF0",
  cursor: "pointer",
}));

// const issueArr = [
//   {
//     _id: "679a7feaba034bd3619d56aa",
//     name: "Display Assemble",
//     price: 300,
//     pice: 5,
//   },
//   {
//     _id: "679930b211d0139b651d203e",
//     name: "Battery Assemble",
//     price: 1000,
//     pice: 30,
//   },
//   { _id: "679a7feaba034bd3619d56ab", name: "Audio Issue", price: 600, pice: 5 },
// ];

const IssueList = ({
  issue,
  setIssue,
  allIssue,
  setAllIssue,
  allSpareParts,
  setAllSpareParts,
  repair_checklist,
  set_repair_checklist,
  allIssueUpdate,
  brand_id,
  deviceId,
  steps,
  setSteps,
  issueArr,
  setIssueArr,
  issueLoading,
  setIssueLoading,
  productList,
  setProductList,
  productLoading,
  setProductLoading,
}) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);

  const { enqueueSnackbar } = useSnackbar();
  

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

  const getServices = async () => {
    setIssueLoading(true);

    let branch_id = getBranchId();
    //localhost:8088/api/v1/service?branch_id=id&brand_id=&device_id=&model_id=6787aac7c296a2f8e87871ec

    let url = `/api/v1/service?model_id=${deviceId}&branch_id=${branch_id}`;

    let allData = await getDataWithToken(url);
    console.log(
      "(allData?.data?.data products issue list",
      allData?.data?.data
    );

    if (allData?.status === 401) {
      logout();
      return;
    }
    let allRepairs = allData?.data?.data?.flatMap((item) => item.repair_info);

    const repairServices = allRepairs.map((service) => ({
      _id: service._id,
      service_id: service._id,
      name: service.name,
      repair_image: service.repair_image,
      details: service.details,
      repair_cost: service.repair_cost,
      guaranty: service.guaranty,
      warranty: service.warranty,
    }));

    // console.log("dddfdf", repairServices);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setIssueLoading(false);
      setIssueArr(repairServices);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setIssueLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
  };

    
  return (
    <div>
      
      <Typography variant="body1" sx={{ fontWeight: 600, mb: 3 }}>
        Select Issue
      </Typography>
   

      <Box>
        <SparePars
          allSpareParts={allSpareParts}
          setAllSpareParts={setAllSpareParts}
          getBranchId={getBranchId}
          partsDeviceId={deviceId}
          productList={productList}
          setProductList={setProductList}
          productLoading={productLoading}
          setProductLoading={setProductLoading}
        />
      </Box>
    </div>
  );
};

export default IssueList;
