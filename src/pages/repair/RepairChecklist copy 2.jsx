import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PulseLoader from "react-spinners/PulseLoader";

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

const RepairChecklist = ({
  repair_checklist,
  set_repair_checklist,
  preValue,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [issueList, setIssueList] = useState(allIssueList);

  const [has_power, set_has_power] = useState(false);
  const [battery_health, set_battery_health] = useState("");
  const [note, set_note] = useState("");
  const [newCheckList, setNewCheckList] = useState("");

  // Populate state from preValue when component mounts or preValue changes
  useEffect(() => {
    if (preValue) {
      set_has_power(preValue.has_power || false);
      set_battery_health(preValue.battery_health || "");
      set_note(preValue.note || "");

      // Update issueList based on preValue.checklist
      setIssueList((prevList) =>
        prevList.map((item) => ({
          ...item,
          status: preValue.checklist.includes(item.name),
        }))
      );
    }
  }, [preValue]);

  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setOpen(!open);
    }
  };

  const handleSave = () => {
    const transformed = issueList
      .filter((item) => item.status)
      .map((item) => item.name);

    const data = {
      has_power,
      battery_health: battery_health || 0,
      note,
      checklist: transformed,
    };

    console.log("transformed data", data);
    set_repair_checklist(data);
  };

  const handleCheckboxChange = (index) => {
    setIssueList((prevList) =>
      prevList.map((item, i) =>
        i === index ? { ...item, status: !item.status } : item
      )
    );
  };

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>Pre Repair Checklist</DialogTitle>
      <DialogContent>
        <Typography variant="body1">Has Power</Typography>
        <FormControl>
          <RadioGroup
            row
            value={has_power}
            onChange={(e) => set_has_power(e.target.value === "true")}
          >
            <FormControlLabel value={true} control={<Radio />} label="Yes" />
            <FormControlLabel value={false} control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>

        {issueList.map((item, index) => (
          <Box
            key={index}
            onClick={() => handleCheckboxChange(index)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
            }}
          >
            <Typography>{item.name}</Typography>
            <Box>{item.status ? "✅" : "❌"}</Box>
          </Box>
        ))}

        <TextField
          label="Battery Health"
          fullWidth
          value={battery_health}
          onChange={(e) => set_battery_health(e.target.value)}
        />
        <TextField
          label="Additional Notes"
          fullWidth
          value={note}
          onChange={(e) => set_note(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Close</Button>
        <Button
          onClick={handleSave}
          disabled={issueList.every((item) => !item.status)}
        >
          {loading ? (
            <PulseLoader color={"#4B46E5"} size={10} />
          ) : (
            "Save changes"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RepairChecklist;
