import React from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ContactForm from "./ContactForm";
import RepairHistory from "./RepairHistory";

const EditContact = ({contactData}) => {
  return (
    <div>
      <Grid container columnSpacing={3} sx={{}}>
        
        <Grid size={12}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 3 }}>
            Edit Contact
          </Typography>
        </Grid>
        <ContactForm contactData={contactData} />
        <RepairHistory />
      </Grid>
    </div>
  );
};

export default EditContact;
