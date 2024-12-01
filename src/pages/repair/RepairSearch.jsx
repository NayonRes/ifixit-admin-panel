import { IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";
import SearchForm from "./SearchForm";
import AddContact from "./AddContact";
import EditContact from "./EditContact";

const RepairSearch = () => {
  const [contactData, setContactData] = useState({});

  const [searchPrams, setSearchPrams] = useState("");
  const [name, setName] = useState("");
  const [serial, setSerial] = useState("");
  const [passCode, setPassCode] = useState("");
  const [brand, setBrand] = useState("");
  const [device, setDevice] = useState("");
  const [repairBy, setRepairBy] = useState("");
  const [repairStatus, setRepairStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
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
            Repair List
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

          <IconButton
            // onClick={() => setOpen(!open)}
            // size="large"
            aria-label="show 5 new notifications"
            color="inherit"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z"
                stroke="#667085"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </IconButton>
        </Grid>
      </Grid>
      <Grid container sx={{ background: "#fff" }}>
        <Grid size={3} sx={{ borderRight: "1px solid #EAECF1", p: 3 }}>
          <SearchForm
            contactData={contactData}
            setContactData={setContactData}
            searchPrams={searchPrams}
            setSearchPrams={setSearchPrams}
            name={name}
            setName={setName}
            serial={serial}
            setSerial={setSerial}
            passCode={passCode}
            setPassCode={setPassCode}
            brand={brand}
            setBrand={setBrand}
            device={device}
            setDevice={setDevice}
            repairBy={repairBy}
            setRepairBy={setRepairBy}
            repairStatus={repairStatus}
            setRepairStatus={setRepairStatus}
            deliveryStatus={deliveryStatus}
            setDeliveryStatus={setDeliveryStatus}
          />
        </Grid>
        <Grid size={9} sx={{ p: 3 }}>
          {contactData?._id ? (
            <EditContact contactData={contactData} />
          ) : (
            <AddContact searchPrams={searchPrams} contactData={contactData} />
          )}

          {/* <EditContact /> */}
        </Grid>
      </Grid>
    </div>
  );
};

export default RepairSearch;
