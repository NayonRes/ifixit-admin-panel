import React, { useContext } from "react";
import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Dashboard2 from "./Dashboard2";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  return (
    <div>
      {/* <Grid container columnSpacing={3} style={{ padding: "24px 0" }}>
        <Grid size={6}>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ color: "#0F1624", fontWeight: 600 }}
          >
            Dashboard
          </Typography>
        </Grid>
        <Grid size={6} style={{ textAlign: "right" }}>
          
        </Grid>
      </Grid> 
      <Dashboard2 />*/}
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
