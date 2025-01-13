import { Box, Button, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";
import SearchForm from "./SearchForm";
import AddContact from "./AddContact";
import EditContact from "./EditContact";
import ModelList from "./ModelList";
import { useNavigate } from "react-router-dom";
import IssueList from "./IssueList";

const RepairSearch = () => {
  const navigate = useNavigate();

  const [contactData, setContactData] = useState({});

  const [searchPrams, setSearchPrams] = useState("");
  const [name, setName] = useState("");
  const [serial, setSerial] = useState("");
  const [passCode, setPassCode] = useState("");
  const [brand, setBrand] = useState("");
  const [brand_id, setBrandId] = useState("");
  const [device, setDevice] = useState("");
  const [repairBy, setRepairBy] = useState("");
  const [repairStatus, setRepairStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [parentList, setParentList] = useState([]);

  const [issue, setIssue] = useState("");

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
          <Button
            variant="contained"
            disableElevation
            sx={{ py: 1.125, px: 2, borderRadius: "6px" }}
            onClick={() => navigate("/repair")}
            startIcon={
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 12.85L1 12.85L1 14.15L14 14.15L14 12.85ZM14 8.85002L1 8.85002L1 10.15L14 10.15L14 8.85002ZM1 4.85003L14 4.85003L14 6.15003L1 6.15002L1 4.85003ZM14 0.850025L1 0.850025L1 2.15002L14 2.15002L14 0.850025Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            }
          >
            Repair List
          </Button>
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
            brand_id={brand_id}
            setBrandId={setBrandId}
            device={device}
            setDevice={setDevice}
            repairBy={repairBy}
            setRepairBy={setRepairBy}
            repairStatus={repairStatus}
            setRepairStatus={setRepairStatus}
            deliveryStatus={deliveryStatus}
            setDeliveryStatus={setDeliveryStatus}
            parentList={parentList}
            setParentList={setParentList}
          />
        </Grid>
        {/*  TODO: don't remove */}

        {/* <Grid size={9} sx={{ p: 3 }}>
          {!brand && contactData?._id ? (
            <EditContact contactData={contactData} />
          ) : !brand && !contactData?._id ? (
            <AddContact searchPrams={searchPrams} contactData={contactData} />
          ) : (
            ""
          )}

          {brand === "Apple" && !device && (
            <ModelList device={device} setDevice={setDevice} />
          )}
          {device && <IssueList issue={issue} setIssue={setIssue} /> }
        </Grid> */}
        {/*  TODO: don't remove */}
        <Grid
          size={9}
          sx={{
            p: 3,
            borderBottom: "1px solid #EAECF1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {!brand && contactData?._id ? (
            <EditContact contactData={contactData} />
          ) : !brand && !contactData?._id ? (
            <AddContact searchPrams={searchPrams} contactData={contactData} />
          ) : (
            ""
          )}

          {device === "Primary" && !device && (
            <ModelList device={device} setDevice={setDevice} />
          )}
          {brand && (
            <ModelList
              device={device}
              setDevice={setDevice}
              brand={brand}
              brand_id={brand_id}
              parentList={parentList}
              setParentList={setParentList}
            />
          )}
          <Box
            sx={{
              borderTop: "1px solid #EAECF1",
              pt: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button variant="outlined">Back</Button>
            <Button variant="contained">Next</Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default RepairSearch;
