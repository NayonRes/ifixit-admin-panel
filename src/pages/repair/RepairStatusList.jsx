import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { statusList, deliveryStatusList } from "../../data";
import ColorPalette from "../../color-palette/ColorPalette";
import { BackHand } from "@mui/icons-material";
import { getDataWithToken } from "../../services/GetDataService";
import RepairStatusHistory from "./RepairStatusHistory";
import { useParams, useSearchParams } from "react-router-dom";

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
    border: `2px solid #707b7c`,
    backgroundColor: ColorPalette.light.text.bg,
    borderRadius: "8px",
    height: "100%",
    width: "100%",
    p: 2,
  },
};

const RepairStatusList = ({
  repairStatus,
  setRepairStatus,
  setLastUpdatedRepairStatus,
  lastUpdatedRepairStatusRemarks,
  setLastUpdatedRepairStatusRemarks,
  deliveryStatus,
  setDeliveryStatus,
  repair_status_history_data,
  technicianLoading,
  setTechnicianLoading,
  technicianList,
  setTechnicianList,
  technician,
  setTechnician,
}) => {
  const { rid } = useParams();

  return (
    <div>
      <Grid container columnSpacing={3} sx={{}}>
        <Grid size={12}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 3 }}>
            Repair Status
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {statusList.length > 0 &&
          statusList.map((item, index) => (
            <Grid size={3} key={index}>
              <Box
                sx={repairStatus === item.name ? style.cardActive : style.card}
                style={{
                  backgroundColor: item.color,
                }}
                role="button"
                onClick={() => setRepairStatus(item.name)}
              >
                {item.icon}

                <Typography variant="body1">{item.name}</Typography>
              </Box>
            </Grid>
          ))}
      </Grid>
      {/* ..... */}
      <Grid container columnSpacing={3} sx={{}}>
        <Grid size={12}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 3, mt: 4 }}>
            Delivery Status
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {deliveryStatusList.length > 0 &&
          deliveryStatusList.map((item, index) => (
            <Grid size={6} key={index}>
              <Box
                sx={
                  deliveryStatus === item.name ? style.cardActive : style.card
                }
                style={{
                  backgroundColor: item.color,
                }}
                role="button"
                onClick={() => setDeliveryStatus(item.name)}
              >
                {item.icon}

                <Typography variant="body1">{item.name}</Typography>
              </Box>
            </Grid>
          ))}
      </Grid>
      {rid?.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <RepairStatusHistory
            repair_status_history_data={repair_status_history_data}
            technicianLoading={technicianLoading}
            setTechnicianLoading={setTechnicianLoading}
            technicianList={technicianList}
            setTechnicianList={setTechnicianList}
            repairStatus={repairStatus}
            setRepairStatus={setRepairStatus}
            setLastUpdatedRepairStatus={setLastUpdatedRepairStatus}
            lastUpdatedRepairStatusRemarks={lastUpdatedRepairStatusRemarks}
            setLastUpdatedRepairStatusRemarks={
              setLastUpdatedRepairStatusRemarks
            }
            technician={technician}
            setTechnician={setTechnician}
          />
        </Grid>
      )}
    </div>
  );
};

export default RepairStatusList;
