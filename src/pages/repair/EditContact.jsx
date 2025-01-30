import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ContactForm from "./ContactForm";
import RepairHistory from "./RepairHistory";
import EditContactForm from "./EditContactForm";
import UpdateCustomer from "../customer/UpdateCustomer";

const EditContact = ({ contactData }) => {
  return (
    <div>
      <Grid container columnSpacing={3} sx={{}}>
        <Grid
          size={12}
          sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 3 }}>
            Edit Contact
          </Typography>
          {/* <EditContactForm contactData={contactData} /> */}
          <UpdateCustomer row={contactData} />
        </Grid>
        <ContactForm contactData={contactData} />
        <RepairHistory />
      </Grid>
    </div>
  );
};

export default EditContact;
