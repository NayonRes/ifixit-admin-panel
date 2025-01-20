import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useSnackbar } from "notistack";

import PulseLoader from "react-spinners/PulseLoader";

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

const allIssueList = [
  { name: "Power ON", status: false },
  { name: "Bluetooth", status: false },
  { name: "Proximity Sensor", status: false },
  { name: "True Tone", status: false },
  { name: "Flash Light", status: false },
  { name: "Touch", status: false },
  { name: "Network", status: false },
  { name: "Ear Speaker", status: false },
  { name: "Loud Speaker", status: false },
  { name: "Face ID", status: false },
  { name: "Front Camera", status: false },
  { name: "MIC", status: false },
  { name: "Button", status: false },
  { name: "Wifi", status: false },
  { name: "Back Camera", status: false },
  { name: "USB", status: false },
  { name: "Taptic", status: false },
];

const RepairChecklist = ({ repair_checklist, set_repair_checklist }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [issueList, setIssueList] = useState(allIssueList);

  const [has_power, set_has_power] = useState(false);
  const [battery_health, set_battery_health] = useState("");
  const [note, set_note] = useState("");
  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setOpen(!open);
    }
  };

  const handleSave = () => {
    const transformed = issueList
      .filter((item) => item.status)
      .map((item) => item.name);

    let data = {
      has_power,
      battery_health,
      note,
      checklist: transformed,
    };
    console.log("transformed data", data);
    set_repair_checklist(data);
  };

  const handleCheckboxChange = (index) => {
    const updatedList = [...issueList];
    updatedList[index].status = !updatedList[index].status;
    setIssueList(updatedList);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && event.target.value.trim() !== "") {
      const newName = event.target.value.trim();

      // Check if the name already exists in the issueList
      const isDuplicate = issueList.some(
        (item) => item.name.toLowerCase() === newName.toLowerCase()
      );

      if (isDuplicate) {
        enqueueSnackbar("This checklist item already exists.", {
          variant: "error",
          autoHideDuration: 3000,
        });
        event.target.value = "";
        return;
      }

      // Add new item if it doesn't exist
      const newItem = { name: newName, status: false };
      setIssueList((prevList) => {
        const updatedList = [...prevList, newItem];
        console.log("Updated issueList:", updatedList);
        return updatedList;
      });

      event.target.value = ""; // Clear the input field after adding the item
    }
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
            <Grid
              size={12}
              sx={{ display: "flex", gap: 3, alignItems: "center" }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Has Power
              </Typography>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  onChange={(e) => set_has_power(e.target.value)}
                  value={has_power}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {issueList.map((item, index) => (
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
          <Grid size={12}>
            <Typography
              variant="medium"
              color="text.main"
              gutterBottom
              sx={{ fontWeight: 500, mt: 3 }}
            >
              Add New Checklist
            </Typography>
            <TextField
              size="small"
              fullWidth
              id="name"
              placeholder="Write Checklist Name and Press Enter"
              variant="outlined"
              sx={{ ...customeTextFeild, mb: 3 }}
              onKeyDown={handleKeyPress}
            />
          </Grid>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Battery Health
              </Typography>
              <TextField
                size="small"
                fullWidth
                id="battery_health"
                placeholder="Enter Battery Health"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 3 }}
                value={battery_health}
                onChange={(e) => set_battery_health(e.target.value)}
              />
            </Grid>
            <Grid size={6}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Additional Notes
              </Typography>
              <TextField
                size="small"
                fullWidth
                id="note"
                placeholder="Additional Notes"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 3 }}
                value={note}
                onChange={(e) => set_note(e.target.value)}
              />
            </Grid>
          </Box>
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
            // type="submit"
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
            onClick={() => {
              handleSave();
              handleDialogClose()
            }}
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
