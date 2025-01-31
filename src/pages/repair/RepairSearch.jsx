import { Box, Button, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useContext, useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import AddContact from "./AddContact";
import EditContact from "./EditContact";
import ModelList from "./ModelList";
import { useLocation, useNavigate } from "react-router-dom";
import IssueList from "./IssueList";
import TechnicianList from "./TechnicianList";
import RepairStatusList from "./RepairStatusList";
import PaymentList from "./PaymentList";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import { handlePostData } from "../../services/PostDataService";
import { useSnackbar } from "notistack";
import { all } from "axios";

const RepairSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("location", location.state);
  const { ifixit_admin_panel } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [contactData, setContactData] = useState({});

  const [id, setId] = useState("");

  const [searchPrams, setSearchPrams] = useState("");
  const [name, setName] = useState("");
  const [serial, setSerial] = useState("");
  const [passCode, setPassCode] = useState("");
  const [brand, setBrand] = useState("");
  const [brand_id, setBrandId] = useState("");
  const [device, setDevice] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [repairBy, setRepairBy] = useState("");
  const [repairStatus, setRepairStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [parentList, setParentList] = useState([]);
  const [steps, setSteps] = useState(0);
  const [technician, setTechnician] = useState("");
  const [technicianName, setTechnicianName] = useState("");

  const [issue, setIssue] = useState("");
  const [allIssue, setAllIssue] = useState([]);
  const [allSpareParts, setAllSpareParts] = useState([]);
  const [allIssueUpdate, setAllIssueUpdate] = useState([]);
  const [repair_checklist, set_repair_checklist] = useState({});

  const [due_amount, set_due_amount] = useState("");
  const [discount_amount, set_discount_amount] = useState("");
  const [customer_id, set_customer_id] = useState("");

  const [payment_info, set_payment_info] = useState([]);

  const [screenType, setScreenType] = useState("add_contact");

  const handleSnakbarOpen = (msg, vrnt) => {
    let duration;
    if (vrnt === "error") {
      duration = 3000;
    } else {
      duration = 1000;
    }
    enqueueSnackbar(msg, {
      variant: vrnt,
      autoHideDuration: duration,
    });
  };

  const checkSum = () => {
    // let issuePrice =
    //   allIssue.reduce((sum, item) => sum + item.price, 0) +
    //   allSpareParts.reduce((sum, item) => sum + item.price, 0);
    // let paymentPrice = payment_info.reduce((sum, item) => sum + item.amount, 0);
    // console.log("payemnt info", issuePrice, paymentPrice);
    // if (issuePrice === paymentPrice) {
    //   console.log("equal");
    // } else {
    //   console.log("not equal");
    // }
  };

  const handleSubmit = async () => {
    let repairP = allIssue.reduce((sum, item) => sum + item.repair_cost, 0);
    let parsP = allSpareParts.reduce((sum, item) => sum + item.price, 0);
    let paymentP = payment_info.reduce((sum, item) => sum + item.amount, 0);
    let dueP = parseInt(due_amount);

    // if (repairP + parsP !== dueP + paymentP) {
    //   return handleSnakbarOpen("Total Amount and input are not same!", "error");
    // }

    // return console.log('ok')

    if (!serial) {
      return handleSnakbarOpen("Serial is Required", "error");
    }
    if (!passCode) {
      return handleSnakbarOpen("Pass Code is Required", "error");
    }
    let token = ifixit_admin_panel.token;
    const decodedToken = jwtDecode(token);
    // console.log('fdfdf',decodedToken?.user?.branch_id)
    let allIssueModified = allIssue.map((item) => {
      let d = {
        name: item.name,
        price: item.price,
      };
      return d;
    });
    console.log("allIssueModified", allIssueModified);
    const data = {
      customer_id: customer_id,
      branch_id: decodedToken?.user?.branch_id,
      pass_code: passCode,
      brand_id: brand_id,
      deliveryStatus: deliveryStatus,
      due_amount: due_amount,
      discount_amount: discount_amount,
      repair_by: technician,
      repair_status: repairStatus,
      issues: allIssueModified,
      spare_parts: allSpareParts,
      repair_checklist: repair_checklist,
      payment_info: payment_info,
      serial: serial,

      model_id: deviceId,

      // manual data
      payment_status: "success",
      remarks: "auto",
      status: true,
      created_by: "admin",
    };

    console.log("final data", data);

    let response = await handlePostData("/api/v1/repair/create", data, false);

    console.log("response", response);

    if (response.status >= 200 && response.status < 300) {
      handleSnakbarOpen("Added successfully", "success");
      // clearFilter();

      // clearForm();
      // handleDialogClose();
    } else {
      handleSnakbarOpen(response?.data?.message, "error");
    }
  };

  const initState = (data) => {
    if (data) {
      console.log("data", data);
      setId(location?.state?.row?._id);
      setName(data?.customer_data[0]?.name);
      setContactData({ name: data?.customer_data[0]?.name });
      setSerial(data?.serial);
      setPassCode(data?.pass_code);
      setAllIssueUpdate(data?.issues);
      setAllIssue(data?.issues);
      setTechnician(data?.repair_by);
      setRepairStatus(data?.repair_status);
      setDeliveryStatus(data?.deliveryStatus);
      // setBrand(data?.brand);
      // setBrandId(data?.brandId);
      // setDevice(data?.device);
      // setRepairBy(data?.repairBy);
      // setPaymentStatus(data?.paymentStatus);
      // setTechnicianName(data?.technicianName);
      // setSteps(data?.steps);
      // setIssue(data?.issue);
      // set_repair_checklist(data?.repair_checklist);
      // set_due_amount(data?.due_amount);
      // set_discount_amount(data?.discount_amount);
      // set_customer_id(data?.customer_id);
      // set_payment_info(data?.payment_info);
    }
  };

  useEffect(() => {
    initState(location?.state?.row);
  }, []);

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
            {/* {name} */}
          </Typography>
        </Grid>
        <Grid size={3} style={{ textAlign: "right" }}>
          <Button
            variant="contained"
            disableElevation
            // sx={{ py: 1.125, px: 2, borderRadius: "6px" }}
            sx={buttonStyle}
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
            technician={technician}
            technicianName={technicianName}
            allIssue={allIssue}
            setAllIssue={setAllIssue}
            allSpareParts={allSpareParts}
            setAllSpareParts={setAllSpareParts}
            set_customer_id={set_customer_id}
            setScreenType={setScreenType}
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
            <EditContact
              contactData={contactData}
              setContactData={setContactData}
            />
          ) : !brand && !contactData?._id && !id ? (
            <AddContact
              searchPrams={searchPrams}
              contactData={contactData}
              setContactData={setContactData}
            />
          ) : (
            ""
          )}

          {device === "Primary" && !device && (
            <ModelList device={device} setDevice={setDevice} />
          )}
          {steps == 0 && (
            <ModelList
              id={id}
              device={device}
              setDevice={setDevice}
              brand={brand}
              brand_id={brand_id}
              parentList={parentList}
              setParentList={setParentList}
              deviceId={deviceId}
              setDeviceId={setDeviceId}
            />
          )}
          {steps == 1 && (
            <IssueList
              issue={issue}
              setIssue={setIssue}
              allIssue={allIssue}
              setAllIssue={setAllIssue}
              allSpareParts={allSpareParts}
              setAllSpareParts={setAllSpareParts}
              repair_checklist={repair_checklist}
              set_repair_checklist={set_repair_checklist}
              allIssueUpdate={allIssueUpdate}
              brand_id={brand_id}
              deviceId={deviceId}
            />
          )}
          {steps == 2 && (
            <TechnicianList
              technician={technician}
              setTechnician={setTechnician}
              technicianName={technicianName}
              setTechnicianName={setTechnicianName}
            />
          )}
          {steps == 3 && (
            <RepairStatusList
              repairStatus={repairStatus}
              setRepairStatus={setRepairStatus}
              deliveryStatus={deliveryStatus}
              setDeliveryStatus={setDeliveryStatus}
            />
          )}
          {steps == 4 && (
            <PaymentList
              paymentStatus={paymentStatus}
              setPaymentStatus={setPaymentStatus}
              payment_info={payment_info}
              set_payment_info={set_payment_info}
              due_amount={due_amount}
              set_due_amount={set_due_amount}
              allIssue={allIssue}
              allSpareParts={allSpareParts}
            />
          )}
          {/* {screenType == "add_contact" && (
            <Box
              sx={{
                borderTop: "1px solid #EAECF1",
                pt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                onClick={() => setSteps(steps + 1)}
                sx={buttonStyle}
              >
                Add Contact
              </Button>
            </Box>
          )} */}
          {screenType == "steper" && (
            <Box
              sx={{
                borderTop: "1px solid #EAECF1",
                pt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setSteps(steps - 1)}
                sx={buttonStyle}
              >
                Back
              </Button>
              {steps == 0 && (
                <Button
                  variant="contained"
                  onClick={() => setSteps(steps + 1)}
                  disabled={device.length < 1}
                  sx={buttonStyle}
                >
                  Next
                </Button>
              )}
              {steps == 1 && (
                <Button
                  variant="contained"
                  onClick={() => setSteps(steps + 1)}
                  disabled={allIssue.length < 1 && allSpareParts.length < 1}
                  sx={buttonStyle}
                >
                  Next
                </Button>
              )}

              {steps == 2 && (
                <Button
                  variant="contained"
                  onClick={() => setSteps(steps + 1)}
                  disabled={technician.length < 1}
                  sx={buttonStyle}
                >
                  Next
                </Button>
              )}
              {steps == 3 && (
                <Button
                  variant="contained"
                  onClick={() => setSteps(steps + 1)}
                  disabled={
                    repairStatus.length < 1 || deliveryStatus.length < 1
                  }
                  sx={buttonStyle}
                >
                  Next
                </Button>
              )}
              {/* <Button variant="contained" onClick={() => setSteps(steps + 1)}>
              Next
            </Button> */}
              {steps == 4 && (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  // onClick={checkSum}
                  sx={buttonStyle}
                >
                  Submit
                </Button>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
      <Box></Box>
    </div>
  );
};

export default RepairSearch;

const buttonStyle = {
  px: 2,
  py: 1.25,
  fontSize: "14px",
  fontWeight: 600,
  minWidth: "127px",
  minHeight: "44px",
};
