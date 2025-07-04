import React, { useEffect, useState } from "react";
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
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddIcon from "@mui/icons-material/Add";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useSnackbar } from "notistack";
import { allIssueCheckList } from "../../data";

import PulseLoader from "react-spinners/PulseLoader";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

const customeTextFeild = {
  boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",

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

const RepairChecklist = ({
  repair_checklist,
  set_repair_checklist,
  issueList,
  setIssueList,
  steps,
  setSteps,
  deviceId,
  showComponent,
  setShowComponent,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [issueList, setIssueList] = useState(allIssueCheckList);

  const [has_power, set_has_power] = useState(false);
  const [battery_health, set_battery_health] = useState("");
  const [note, set_note] = useState("");

  const [newCheckList, setNewCheckList] = useState("");

  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setOpen(!open);
    }
  };

  const handleSave = () => {
    const transformed = issueList.filter((item) => item.status != false);
    // .map((item) => item.name);

    let data = {
      has_power,
      battery_health: battery_health || 0,
      note,
      checklist: transformed,
    };
    console.log("transformed data", data);
    set_repair_checklist(data);
  };

  const handleCheckboxChange = (index, clickStatus) => {
    console.log("status", index, clickStatus, issueList);

    const updatedList = [...issueList];
    updatedList[index].status = clickStatus;
    setIssueList(updatedList);
  };

  const handleAdd = () => {
    const newName = newCheckList.trim();
    if (!newCheckList.trim()) {
      enqueueSnackbar("Please enter checklist name", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }
    // Check if the name already exists in the issueList
    const isDuplicate = issueList.some(
      (item) => item.name.toLowerCase() === newName.toLowerCase()
    );

    if (isDuplicate) {
      enqueueSnackbar("This checklist item already exists.", {
        variant: "error",
        autoHideDuration: 3000,
      });
      setNewCheckList("");
      return;
    }

    // Add new item if it doesn't exist
    const newItem = { name: newName, status: false };
    setIssueList((prevList) => {
      const updatedList = [...prevList, newItem];
      console.log("Updated issueList:", updatedList);
      return updatedList;
    });

    setNewCheckList("");
  };


  useEffect(() => {
    console.log("all-----------:", allIssueCheckList);
  
    let preArr = repair_checklist?.checklist;
    if (!preArr) {
      preArr = [];
    }

    const updatedAllArr = allIssueCheckList.map((item) => {
      const match = preArr.find((preItem) => preItem.name === item.name);
      return match ? { ...item, status: match.status } : item;
    });

    const newItems = preArr.filter(
      (preItem) => !allIssueCheckList.some((item) => item.name === preItem.name)
    );

    const finalUpdatedAllArr = [...updatedAllArr, ...newItems];

    console.log("updatedAllArr", finalUpdatedAllArr);
    setIssueList(finalUpdatedAllArr);

    if (repair_checklist.has_power !== undefined) {
      set_has_power(repair_checklist.has_power);
    }
    if (repair_checklist.battery_health !== undefined) {
      set_battery_health(repair_checklist.battery_health);
    }
    if (repair_checklist.note !== undefined) {
      set_note(repair_checklist.note);
    }
  }, []);

  return (
    <div>
      <Box sx={{ float: "right" }}>
        <Button
          variant="outlined"
          disabled={!deviceId}
          onClick={() => setOpen(true)}
          sx={{ mr: 1 }}
        >
          Pre Repair Checklist
        </Button>
        {showComponent === "Model List" && (
          <Button
            variant="outlined"
            disabled={!deviceId}
            onClick={() => setShowComponent("Issue List")}
          >
            Issue List
          </Button>
        )}
        {showComponent === "Issue List" && (
          <Button
            variant="outlined"
            disabled={!deviceId}
            onClick={() => setShowComponent("Model List")}
          >
            Model List
          </Button>
        )}
      </Box>
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
          onClick={() => console.log("issueList", issueList)}
        >
          Pre Repair Checklist
          <IconButton
            sx={{ position: "absolute", right: 0, top: 0 }}
            // disabled={issueList.filter((item) => item.status).length < 1}
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
          <Grid container spacing={1}>
            <Grid
              size={12}
              sx={{ display: "flex", gap: 3, alignItems: "center" }}
            >
              <Typography variant="medium" sx={{ fontWeight: 600 }}>
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
                    control={<Radio size="small" />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio size="small" />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {!loading &&
              issueList.map((item, index) => (
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
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() =>
                    handleCheckboxChange(
                      index,
                      item.status === false
                        ? "Functional"
                        : item.status === "Functional"
                        ? "Damaged"
                        : item.status === "Damaged"
                        ? false
                        : ""
                    )
                  }
                >
                  <Typography
                    variant="small"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {item.name}
                  </Typography>
                  <Box
                    // onClick={() => handleCheckboxChange(index)}
                    sx={{ display: "flex", alignItems: "center " }}
                  >
                    {item.status === "Functional" ? (
                      <>
                        {/* <img
                        src="/check.png"
                        alt=""
                        style={{ width: "25px" }}
                        // onClick={() => handleCheckboxChange(index, "Damaged")}
                      /> */}
                        <CheckCircleOutlinedIcon
                          color="success"
                          sx={{
                            fontSize: "22px",
                          }}
                        />
                      </>
                    ) : item.status === "Damaged" ? (
                      <img
                        src="/cross.png"
                        alt=""
                        style={{ width: "20px" }}
                        // onClick={() => handleCheckboxChange(index, false)}
                      />
                    ) : (
                      <CheckBoxOutlineBlankIcon
                        sx={{ color: "#999", width: "20px", height: "20px" }}
                        // onClick={() =>
                        //   handleCheckboxChange(index, "Functional")
                        // }
                      />
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
              sx={{ fontWeight: 500, mt: 2 }}
            >
              Add New Checklist
            </Typography>

            <FormControl fullWidth variant="outlined">
              <OutlinedInput
                sx={{ ...customeTextFeild, mb: 2 }}
                placeholder="Enter additional checklist name "
                size="small"
                id="outlined-adornment-password"
                value={newCheckList}
                onChange={(e) => setNewCheckList(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleAdd}
                      // onMouseDown={handleAdd}
                      // onMouseUp={handleAdd}
                      edge="end"
                    >
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid container spacing={3}>
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
                type="number"
                onWheel={(e) => e.target.blur()}
                size="small"
                fullWidth
                id="battery_health"
                placeholder="Enter Battery Health"
                variant="outlined"
                sx={{ ...customeTextFeild, mb: 0 }}
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
                sx={{ ...customeTextFeild, mb: 0 }}
                value={note}
                onChange={(e) => set_note(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 2 }}>
          <Button
            variant="outlined"
            onClick={handleDialogClose}
            // disabled={issueList.filter((item) => item.status).length < 1}
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
            // disabled={issueList.filter((item) => item.status).length < 1}
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

            disableElevation
            onClick={() => {
              handleSave();
              handleDialogClose();
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
