import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import React, { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const allIssueList = [
  { name: "Power ON", status: false },
  { name: "Bluetooth", status: false },
  { name: "Proximity Sensor", status: true },
  { name: "True Tone", status: true },
  { name: "Flash Light", status: false },
  { name: "Touch", status: true },
  { name: "Network", status: true },
  { name: "Ear Speaker", status: false },
  { name: "Loud Speaker", status: true },
  { name: "Face ID", status: true },
  { name: "Front Camera", status: false },
  { name: "MIC", status: false },
  { name: "Button", status: true },
  { name: "Wifi", status: true },
  { name: "Back Camera", status: true },
  { name: "USB", status: true },
  { name: "Taptic", status: true },
];

const RepairChecklist = () => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [issueList, setIssueList] = useState(allIssueList);
  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setOpen(!open);
    }
  };

  const handleCheckboxChange = (index) => {
    const updatedList = [...issueList];
    updatedList[index].status = !updatedList[index].status;
    setIssueList(updatedList);
    console.log("issueList", issueList);
    console.log("updatedList", updatedList);
  };

  const customeTextFeild = {
    boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
    // padding: "15px 20px",

    // "& label.Mui-focused": {
    //   color: "#A0AAB4",
    // },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-input": {
      // padding: "15px 24px 15px 0px",
    },
    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px",
      "& fieldset": {
        borderColor: "",
      },

      "&:hover fieldset": {
        borderColor: "#969696",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#969696",
      },
    },
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "16px", // Customize the border-radius here
          },
        }}
        PaperProps={{
          component: "form",
          // onSubmit: onSubmit,
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontSize: "20px",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            color: "#0F1624",
            position: "relative",
            px: 2,
            borderBottom: "1px solid #EAECF1",
          }}
        >
          Pre Repair Checklist
          <IconButton
            sx={{ position: "absolute", right: 0, top: 0 }}
            onClick={() => setOpen(false)}
          >
            <svg
              width="46"
              height="44"
              viewBox="0 0 46 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29 16L17 28M17 16L29 28"
                stroke="#656E81"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            maxWidth: "400px",
            minWidth: "600px",
            px: 2,
            borderBottom: "1px solid #EAECF1",
            my: 1,
          }}
        >
          <Grid container spacing={2}>
            {allIssueList.map((item, index) => (
              <Grid
                key={index}
                size={6}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#F8F9FA",
                  p: 1,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {item.name}
                </Typography>
                <Box
                  onClick={() => handleCheckboxChange(index)}
                  sx={{ display: "flex", alignItems: "center " }}
                >
                  {item.status ? (
                    <img src="/check.png" alt="" style={{ width: "25px" }} />
                  ) : (
                    <img src="/cross.png" alt="" style={{ width: "25px" }} />
                  )}
                </Box>
                {/* <img src="/check.png" alt="" style={{ width: "25px" }} /> */}
              </Grid>
            ))}
          </Grid>
          <Typography
            variant="medium"
            color="text.main"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Set Password
          </Typography>
          <TextField
            required
            size="small"
            fullWidth
            id="name"
            placeholder="Full Name"
            variant="outlined"
            sx={{ ...customeTextFeild, mb: 3 }}
            // value={name}
            // onChange={(e) => {
            //   setName(e.target.value);
            // }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 2 }}>
          <Button
            variant="outlined"
            onClick={handleDialogClose}
            sx={{
              px: 2,
              py: 1.25,
              fontSize: "14px",
              fontWeight: 600,
              color: "#344054",
              border: "1px solid #D0D5DD",
              boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            // disabled={loading}
            type="submit"
            sx={{
              px: 2,
              py: 1.25,
              fontSize: "14px",
              fontWeight: 600,
              minWidth: "127px",
              minHeight: "44px",
            }}
            // style={{ minWidth: "180px", minHeight: "35px" }}
            autoFocus
            disableElevation
          >
            <PulseLoader
              color={"#4B46E5"}
              loading={loading}
              size={10}
              speedMultiplier={0.5}
            />{" "}
            {loading === false && "Save changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RepairChecklist;
