import { Box, Button, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useContext, useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import AddContact from "./AddContact";
import EditContact from "./EditContact";
import ModelList from "./ModelList";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import IssueList from "./IssueList";
import TechnicianList from "./TechnicianList";
import RepairStatusList from "./RepairStatusList";
import PaymentList from "./PaymentList";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import { handlePostData } from "../../services/PostDataService";
import { useSnackbar } from "notistack";
import { all } from "axios";
import { getDataWithToken } from "../../services/GetDataService";
import { handlePutData } from "../../services/PutDataService";
import { PulseLoader } from "react-spinners";
import RepairHistory from "./RepairHistory";
import SerialHistory from "./SerialHistory";
import { allIssueCheckList } from "../../data";
import RefundTransaction from "../refund/RefundTransaction";

const AddRepair = () => {
  const navigate = useNavigate();
  const { rid } = useParams();
  // console.log("rid", rid);

  const location = useLocation();
  const [searchParams] = useSearchParams();
  console.log("location", location.state);
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [contactData, setContactData] = useState({});

  const [id, setId] = useState("");
  const [allInfo, setAllInfo] = useState({});
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
  const [lastUpdatedRepairStatus, setLastUpdatedRepairStatus] = useState("");
  const [repairStatusRemarks, setRepairStatusRemarks] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [parentList, setParentList] = useState([]);
  const [steps, setSteps] = useState("contact");
  const [technician, setTechnician] = useState("");
  const [technicianName, setTechnicianName] = useState("");
  const [technicianLoading, setTechnicianLoading] = useState(false);
  const [technicianList, setTechnicianList] = useState([]);

  const [subChildDeviceList, setSubChildDeviceList] = useState([]);
  const [parentDevice, setParentDevice] = useState("");
  const [childDevice, setChildDevice] = useState("");
  const [modelList, setModelList] = useState([]);

  const [issueArr, setIssueArr] = useState([]);

  const [issue, setIssue] = useState("");
  const [allIssue, setAllIssue] = useState([]);
  const [allSpareParts, setAllSpareParts] = useState([]);
  const [allIssueUpdate, setAllIssueUpdate] = useState([]);
  const [repair_checklist, set_repair_checklist] = useState({});
  const [repair_status_history_data, set_repair_status_history_data] = useState(
    []
  );

  const [serialLoading, setSerialLoading] = useState(false);
  const [serialHistoryList, setSerialHistoryList] = useState([]);

  const [due_amount, set_due_amount] = useState(0);
  const [discount_amount, set_discount_amount] = useState(0);
  const [customer_id, set_customer_id] = useState("");

  const [payment_info, set_payment_info] = useState([]);

  const [screenType, setScreenType] = useState("add_contact");
  const [loading, setLoading] = useState(false);
  const [issueLoading, setIssueLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [apiCallForUpdate, setApiCallForUpdate] = useState(false);
  const [previousRepairData, setPreviousRepairData] = useState({});
  const [issueList, setIssueList] = useState(
    JSON.parse(JSON.stringify(allIssueCheckList))
  );

  const [repairCheckList, setRepairCheckList] = useState([]);
  const [issueLoading2, setIssueLoading2] = useState(false);
  const [mainIssueList, setMainIssueList] = useState(allIssueCheckList);
  const [branchList, setBranchList] = useState([]); // using this for only keep  allIssueCheckList array
  const [stockLimitList, setStockLimitList] = useState([]);
  const [billCollections, setBillCollections] = useState([]);
  const getBranchId = () => {
    let token = ifixit_admin_panel.token;
    let decodedToken = jwtDecode(token);
    let branch_id = decodedToken?.user?.branch_id;
    return branch_id;
  };
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
    console.log("contactData", contactData);

    console.log("billCollections", billCollections);

    let repairP = allIssue.reduce((sum, item) => sum + item.repair_cost, 0);
    let parsP = allSpareParts.reduce((sum, item) => sum + item.price, 0);
    let paymentP = payment_info.reduce((sum, item) => sum + item.amount, 0);
    let dueP = parseInt(due_amount || 0);
    let discount_amount_p = parseInt(discount_amount || 0);
    console.log("paymentP", paymentP);
    console.log("parsP", parsP);

    // return console.log('ok')

    if (!customer_id && !contactData?._id) {
      return handleSnakbarOpen("Custommer is Required", "error");
    }

    if (!brand_id) {
      return handleSnakbarOpen("Brand is Required", "error");
    }
    if (!deviceId) {
      return handleSnakbarOpen("Please select a device model", "error");
    }
    if (!technician) {
      return handleSnakbarOpen("Please select a technician", "error");
    }

    if (!repairStatus) {
      return handleSnakbarOpen("Repair status is Required", "error");
    }
    if (!deliveryStatus) {
      return handleSnakbarOpen("Delivery status is Required", "error");
    }

    if (repairStatus === "Complete" && deliveryStatus === "Delivered") {
      if (allIssue.length < 1) {
        return handleSnakbarOpen("Issue is Required", "error");
      }
      if (allSpareParts.length < 1) {
        return handleSnakbarOpen("Spare Parts is Required", "error");
      }

      if (repairP == 0) {
        return handleSnakbarOpen("Repair list is empty", "error");
      }
      if (repairP + parsP !== dueP + paymentP + discount_amount_p) {
        return handleSnakbarOpen(
          "Total Amount and input are not same!",
          "error"
        );
      }
    }

    // if (!passCode) {
    //   return handleSnakbarOpen("Pass Code is Required", "error");
    // }
    let token = ifixit_admin_panel.token;
    const decodedToken = jwtDecode(token);
    // console.log('fdfdf',decodedToken?.user?.branch_id)
    let allIssueModified = allIssue.map((item) => {
      let d = {
        service_id: item?.service_id,
        name: item.name,
        repair_cost: item.repair_cost,
        status: item?.status,
        updated_at: item?.updated_at,
        updated_by: item?.updated_by,
      };
      return d;
    });
    let allSparePartsModified = allSpareParts.map((item) => {
      let d = {
        id: item.product_id,
        name: item.name,
        price: item.price,
        product_full_name: item.name,
        product_id: item.product_id,
        product_variation_id: item.product_variation_id,
      };
      return d;
    });
    console.log("allIssueModified", allIssueModified);
    console.log("allSpareParts", allSpareParts);
    console.log("allSparePartsModified", allSparePartsModified);
    setLoading(true);
    let data = {
      customer_id: customer_id || contactData?._id,
      branch_id: decodedToken?.user?.branch_id,
      pass_code: passCode,
      brand_id: brand_id,
      delivery_status: deliveryStatus,
      due_amount: due_amount || 0,
      discount_amount: discount_amount || 0,
      repair_by: technician,
      repair_status: repairStatus,
      repair_status_remarks: repairStatusRemarks,
      issues: allIssueModified,
      product_details: allSparePartsModified,
      repair_checklist: repair_checklist,
      payment_info: payment_info,
      billCollections: billCollections,
      serial: serial,

      model_id: deviceId,
    };

    // if (location.pathname.includes("/update-repair")) {
    //   data = {
    //     ...data,
    //     repair_status: lastUpdatedRepairStatus,
    //   };
    // }

    console.log("final data", data);

    let response;

    if (rid) {
      response = await handlePutData(
        `/api/v1/repair/update/${rid}`,
        data,
        false
      );
    } else {
      response = await handlePostData("/api/v1/repair/create", data, false);
    }

    console.log("response add repair", response?.data?.data?._id);

    if (response?.status === 401) {
      logout();
      return;
    }

    if (response.status >= 200 && response.status < 300) {
      setLoading(true);
      set_repair_checklist({});

      setIssueList(allIssueCheckList);
      handleSnakbarOpen("Added successfully", "success");

      navigate(`/repair/invoice/${response?.data?.data?._id}`);

      // clearFilter();

      // clearForm();
      // handleDialogClose();
    } else {
      setLoading(true);
      handleSnakbarOpen(response?.data?.message, "error");
    }
    setLoading(false);
  };

  const initState = async (rid) => {
    if (rid) {
      // setLoading2(true);

      let url = `/api/v1/repair/${rid}`;
      let allData = await getDataWithToken(url);

      if (allData.status >= 200 && allData.status < 300) {
        // setCategoryList(allData?.data?.data);
        // return console.log("allData:::", allData?.data?.data);
        // setScreenType("steper");
        // setSteps(0);
        let data = allData?.data?.data;
        setPreviousRepairData(data);
        setAllInfo(data);
        console.log("edit data", data);
        setId(data?._id);
        setName(data?.customer_data[0]?.name);
        setContactData({
          _id: data?.customer_data[0]?._id,
          name: data?.customer_data[0]?.name,
          mobile: data?.customer_data[0]?.mobile,
          email: data?.customer_data[0]?.email,
          customer_type: data?.customer_data[0]?.customer_type,
          rating: data?.customer_data[0]?.rating,
          membership_id: data?.customer_data[0]?.membership_id,
          remarks: data?.customer_data[0]?.remarks,
        });
        set_customer_id(data?.customer_data[0]?._id);
        setSerial(data?.serial);
        setPassCode(data?.pass_code);
        setAllIssueUpdate(data?.issues);
        setAllIssue(data?.issues);
        setAllSpareParts(data?.product_details);

        setTechnician(data?.repair_by);
        setRepairStatus(data?.repair_status);
        setLastUpdatedRepairStatus(data?.repair_status);
        setDeliveryStatus(data?.delivery_status);
        setBrand(data?.brand_id);
        setBrandId(data?.brand_id);
        setDevice(data?.model_data?.[0]?.name);
        setDeviceId(data?.model_data?.[0]?._id);
        setParentDevice(data?.model_data?.[0]?.device_id);
        set_payment_info(data?.payment_info);
        set_due_amount(data?.due_amount);
        set_repair_checklist(data?.repair_checklist);
        setRepairBy(data?.repair_by);
        setTechnician(data?.repair_by);
        setTechnicianName(data?.repair_by_data?.[0]?.name);
        set_repair_status_history_data(data?.repair_status_history_data);
        // setPaymentStatus(data?.paymentStatus);
        // setSteps(data?.steps);
        // setIssue(data?.issue);
        set_discount_amount(data?.discount_amount);
        setApiCallForUpdate(true);
        if (allData.data.data.length < 1) {
          // setMessage("No data found");
        }
      } else {
        handleSnakbarOpen(allData?.data?.message, "error");
      }
      // setLoading2(false);
    }
  };
  const getBranchList = async () => {
    let url = `/api/v1/branch/dropdownlist`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      let newBranchWithLimit = allData?.data?.data?.map((item) => ({
        ...item,
        limit: "",
      }));

      setBranchList(newBranchWithLimit);
    } else {
      handleSnakbarOpen(allData?.data?.message, "error");
    }
  };

  const showRefund = () => {
    return repairStatus === "Cancelled" || repairStatus === "Failed";
  };
  useEffect(() => {
    if (rid) {
      initState(rid);
    }
    getBranchList();
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
            {location.pathname.includes("/update-repair")
              ? "Update Job Card"
              : "Create Job Card"}
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
        <Grid
          size={3}
          sx={{
            borderRight: "1px solid #EAECF1",
            p: 3,
            height: "calc(100vh - 130px)",
            overflow: "auto",
          }}
        >
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
            setLastUpdatedRepairStatus={setLastUpdatedRepairStatus}
            repairStatusRemarks={repairStatusRemarks}
            setRepairStatusRemarks={setRepairStatusRemarks}
            deliveryStatus={deliveryStatus}
            setDeliveryStatus={setDeliveryStatus}
            parentList={parentList}
            setParentList={setParentList}
            technician={technician}
            technicianName={technicianName}
            setTechnicianName={setTechnicianName}
            allIssue={allIssue}
            setAllIssue={setAllIssue}
            allSpareParts={allSpareParts}
            setAllSpareParts={setAllSpareParts}
            set_customer_id={set_customer_id}
            setScreenType={setScreenType}
            steps={steps}
            setSteps={setSteps}
            serialLoading={serialLoading}
            setSerialLoading={setSerialLoading}
            serialHistoryList={serialHistoryList}
            setSerialHistoryList={setSerialHistoryList}
            technicianLoading={technicianLoading}
            setTechnicianLoading={setTechnicianLoading}
            technicianList={technicianList}
            setTechnicianList={setTechnicianList}
            previousRepairData={previousRepairData}
            setPreviousRepairData={setPreviousRepairData}
          />
        </Grid>

        <Grid
          size={9}
          sx={{
            p: 3,
            borderBottom: "1px solid #EAECF1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "calc(100vh - 130px)",
            overflow: "auto",
          }}
        >
          {steps == "contact" && (
            <Box>
              {contactData?._id ? (
                <>
                  <EditContact
                    contactData={contactData}
                    setContactData={setContactData}
                  />
                  <br />
                  <RepairHistory contactData={contactData} serial={serial} />
                </>
              ) : !contactData?._id ? (
                <>
                  <AddContact
                    searchPrams={searchPrams}
                    contactData={contactData}
                    setContactData={setContactData}
                  />
                </>
              ) : (
                ""
              )}
            </Box>
          )}

          {steps == "serial_history" && (
            <SerialHistory
              contactData={contactData}
              serial={serial}
              serialLoading={serialLoading}
              setSerialLoading={setSerialLoading}
              serialHistoryList={serialHistoryList}
              setSerialHistoryList={setSerialHistoryList}
            />
          )}

          {steps == "device" && (
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
              steps={steps}
              setSteps={setSteps}
              repair_checklist={repair_checklist}
              set_repair_checklist={set_repair_checklist}
              issueList={issueList}
              setIssueList={setIssueList}
              issue={issue}
              setIssue={setIssue}
              allIssue={allIssue}
              setAllIssue={setAllIssue}
              allSpareParts={allSpareParts}
              setAllSpareParts={setAllSpareParts}
              allIssueUpdate={allIssueUpdate}
              subChildDeviceList={subChildDeviceList}
              setSubChildDeviceList={setSubChildDeviceList}
              parentDevice={parentDevice}
              setParentDevice={setParentDevice}
              childDevice={childDevice}
              setChildDevice={setChildDevice}
              modelList={modelList}
              setModelList={setModelList}
              issueArr={issueArr}
              setIssueArr={setIssueArr}
              issueLoading={issueLoading}
              setIssueLoading={setIssueLoading}
              productList={productList}
              setProductList={setProductList}
              productLoading={productLoading}
              setProductLoading={setProductLoading}
              apiCallForUpdate={apiCallForUpdate}
              previousRepairData={previousRepairData}
              setPreviousRepairData={setPreviousRepairData}
              repairCheckList={repairCheckList}
              setRepairCheckList={setRepairCheckList}
              issueLoading2={issueLoading2}
              setIssueLoading2={setIssueLoading2}
              branchList={branchList}
              setBranchList={setBranchList}
              stockLimitList={stockLimitList}
              setStockLimitList={setStockLimitList}
            />
            // <div>Model list</div>
          )}
          {/* {steps == "repair_list" && (
            <IssueList
              issue={issue}
              setIssue={setIssue}
              allIssue={allIssue}
              setAllIssue={setAllIssue}
              allSpareParts={allSpareParts}
              setAllSpareParts={setAllSpareParts}
              allIssueUpdate={allIssueUpdate}
              brand_id={brand_id}
              deviceId={deviceId}
              repair_checklist={repair_checklist}
              set_repair_checklist={set_repair_checklist}
              steps={steps}
              setSteps={setSteps}
              issueArr={issueArr}
              setIssueArr={setIssueArr}
            />
          )} */}
          {steps == "repair_by" && (
            <TechnicianList
              technician={technician}
              setTechnician={setTechnician}
              technicianName={technicianName}
              setTechnicianName={setTechnicianName}
              technicianLoading={technicianLoading}
              setTechnicianLoading={setTechnicianLoading}
              technicianList={technicianList}
              setTechnicianList={setTechnicianList}
            />
          )}
          {steps == "repair_status" && (
            <RepairStatusList
              repairStatus={repairStatus}
              setRepairStatus={setRepairStatus}
              setLastUpdatedRepairStatus={setLastUpdatedRepairStatus}
              repairStatusRemarks={repairStatusRemarks}
              setRepairStatusRemarks={setRepairStatusRemarks}
              deliveryStatus={deliveryStatus}
              setDeliveryStatus={setDeliveryStatus}
              repair_status_history_data={repair_status_history_data}
              technicianLoading={technicianLoading}
              setTechnicianLoading={setTechnicianLoading}
              technicianList={technicianList}
              setTechnicianList={setTechnicianList}
              technician={technician}
              setTechnician={setTechnician}
            />
          )}

          {steps == "payment" && (
            <PaymentList
              paymentStatus={paymentStatus}
              setPaymentStatus={setPaymentStatus}
              payment_info={payment_info}
              set_payment_info={set_payment_info}
              due_amount={due_amount}
              set_due_amount={set_due_amount}
              discount_amount={discount_amount}
              set_discount_amount={set_discount_amount}
              allIssue={allIssue}
              allSpareParts={allSpareParts}
              billCollections={billCollections}
              setBillCollections={setBillCollections}
              allInfo={allInfo}
              setAllInfo={setAllInfo}
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
          <Box
            sx={{
              borderTop: "1px solid #EAECF1",
              pt: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            {/* <Button
                variant="outlined"
                onClick={() => setSteps(steps - 1)}
                sx={buttonStyle}
              >
                Back
              </Button> */}

            {/* {steps == "payment" && (
              <> */}
            {showRefund() && (
              <>
                <RefundTransaction
                  transaction_name="Repair Refund"
                  transaction_source_id={rid}
                  transaction_source_type="repair"
                  transaction_type="debit"
                  totalCollection={
                    Array.isArray(allInfo?.payment_info)
                      ? allInfo?.payment_info.reduce(
                          (sum, i) => sum + (i.amount || 0),
                          0
                        )
                      : 0
                  }
                />
              </>
            )}

            <Button
              variant="contained"
              onClick={handleSubmit}
              color="success"
              // onClick={checkSum}
              sx={{ ...buttonStyle, minWidth: "220px", minHeight: "57px" }}
              disabled={loading}
            >
              {rid ? "Update" : "Save Changes"}
              <PulseLoader
                color={"#16bb3aff"}
                loading={loading}
                size={10}
                speedMultiplier={0.5}
              />
            </Button>
            {/* </>
            )} */}
          </Box>
        </Grid>
      </Grid>
      <Box></Box>
    </div>
  );
};

export default AddRepair;

const buttonStyle = {
  px: 2,
  py: 1.25,
  fontSize: "14px",
  fontWeight: 600,
  minWidth: "127px",
  minHeight: "44px",
};
