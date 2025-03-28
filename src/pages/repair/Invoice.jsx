import Grid from "@mui/material/Grid2";
import React from "react";

const Invoice = () => {
  return (
    <div>
      <Grid container columnSpacing={3} style={{ padding: "24px 0" }}>
        <Grid size={12}>
          <Grid container>
            <Grid size={8}>Logo</Grid>
            <Grid size={4}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Veritatis, dignissimos unde? Excepturi doloremque tempora, ratione
              alias ducimus dolore aspernatur atque reiciendis sequi harum totam
              distinctio nisi qui tenetur laboriosam. Numquam.
            </Grid>
          </Grid>
        </Grid>{" "}
      </Grid>
    </div>
  );
};

export default Invoice;
