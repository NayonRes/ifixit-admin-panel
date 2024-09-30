import React from "react";
import { Grid, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <div>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "90vh" }}
      >
        <Grid item>
          <img src="/dashboardBG.svg" width="250px" alt="" />
          <Typography
            variant="h4"
            sx={{ textAlign: "center", color: "#969696" }}
          >
            Coming soon
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
