import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
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
import Products from "./Products";

const AddSales = () => {
  const navigate = useNavigate();
  const { sid } = useParams();
  // console.log("sid", sid);

  const location = useLocation();
  const [searchParams] = useSearchParams();
  console.log("location", location.state);
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
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
  const [lastUpdatedRepairStatus, setLastUpdatedRepairStatus] = useState("");
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

  const [due_amount, set_due_amount] = useState("");
  const [discount_amount, set_discount_amount] = useState("");
  const [customer_id, set_customer_id] = useState("");

  const [payment_info, set_payment_info] = useState([]);

  const [screenType, setScreenType] = useState("add_contact");
  const [loading, setLoading] = useState(false);

  const [apiCallForUpdate, setApiCallForUpdate] = useState(false);
  const [previousRepairData, setPreviousRepairData] = useState({});

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [amounts, setAmounts] = useState([]);
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

  const handleSubmit = async () => {
    // return console.log('ok')

    if (!customer_id) {
      return handleSnakbarOpen("Custommer is Required", "error");
    }

    let newSelectedProduct = [];
    if (selectedProducts?.length < 1) {
      handleSnakbarOpen("Please select purchase product", "error");
      setLoading(false);
      return;
    } else {
      const hasInvalidProduct = selectedProducts.some(
        (item) =>
          !item.price ||
          item.price === "" ||
          item.price === 0 ||
          !item.quantity ||
          item.quantity === "" ||
          item.quantity === 0
      );

      if (hasInvalidProduct) {
        handleSnakbarOpen(
          "Please enter valid price and quantity for all products",
          "error"
        );
        setLoading(false);
        return;
      }

      newSelectedProduct = selectedProducts?.map((item, i) => ({
        product_id: item.product_id,
        product_variation_id: item.product_variation_id,
        quantity: item.quantity,
        price: item.price,
        product_name: item.product_name,
      }));
    }
    let totalPrice = selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let paymentP = payment_info.reduce((sum, item) => sum + item.amount, 0);
    let dueP = parseInt(due_amount || 0);
    let discount_amount_p = parseInt(discount_amount || 0);
    if (totalPrice !== dueP + paymentP + discount_amount_p) {
      return handleSnakbarOpen("Total Amount and input are not same!", "error");
    }
    // if (!passCode) {
    //   return handleSnakbarOpen("Pass Code is Required", "error");
    // }
    let token = ifixit_admin_panel.token;
    const decodedToken = jwtDecode(token);
    // console.log('fdfdf',decodedToken?.user?.branch_id)

    console.log("newSelectedProduct", newSelectedProduct);

    setLoading(true);
    let data = {
      customer_id: customer_id || contactData?._id,
      branch_id: decodedToken?.user?.branch_id,

      due_amount: due_amount,
      discount_amount: discount_amount,

      product_details: newSelectedProduct,

      payment_info: payment_info,
    };

    let response;

    if (sid) {
      response = await handlePutData(`/api/v1/sale/update/${sid}`, data, false);
    } else {
      response = await handlePostData("/api/v1/sale/create", data, false);
    }

    console.log("response ", response?.data?.data?._id);

    if (response?.status === 401) {
      logout();
      return;
    }

    if (response.status >= 200 && response.status < 300) {
      setLoading(true);
      // set_repair_checklist({});
      handleSnakbarOpen("Added successfully", "success");
      navigate(`/sales/invoice/${response?.data?.data?._id}`);

      // clearFilter();

      // clearForm();
      // handleDialogClose();
    } else {
      setLoading(true);
      handleSnakbarOpen(response?.data?.message, "error");
    }
    setLoading(false);
  };

  const initState = async (sid) => {
    if (sid) {
      // setLoading2(true);

      let url = `/api/v1/sale/${sid}`;
      let allData = await getDataWithToken(url);

      if (allData.status >= 200 && allData.status < 300) {
        // setCategoryList(allData?.data?.data);
        // return console.log("allData:::", allData?.data?.data);
        // setScreenType("steper");
        // setSteps(0);
        let data = allData?.data?.data;
        setPreviousRepairData(data);
        console.log(
          "edit data **********************************************",
          data
        );
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

        setAllIssueUpdate(data?.issues);
        setAllIssue(data?.issues);
        setAllSpareParts(data?.product_details);
        setSelectedProducts(data?.product_details);

        setLastUpdatedRepairStatus(data?.repair_status);

        set_payment_info(data?.payment_info);
        setAmounts(data?.payment_info);
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

  useEffect(() => {
    if (sid) {
      initState(sid);
    }
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
            Add Sales
            {/* {name} */}
          </Typography>
        </Grid>
        <Grid size={3} style={{ textAlign: "right" }}>
          {/* <Button
            variant="contained"
            disableElevation
            // sx={{ py: 1.125, px: 2, borderRadius: "6px" }}
            sx={buttonStyle}
            onClick={() => navigate("/sales-list")}
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
            Sales List
          </Button> */}
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
              <br />
              <Divider />
              <Products
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
              />
              <br />
              <Divider />
              <br />
              <PaymentList
                paymentStatus={paymentStatus}
                setPaymentStatus={setPaymentStatus}
                payment_info={payment_info}
                set_payment_info={set_payment_info}
                due_amount={due_amount}
                set_due_amount={set_due_amount}
                discount_amount={discount_amount}
                set_discount_amount={set_discount_amount}
                selectedProducts={selectedProducts}
                allIssue={allIssue}
                allSpareParts={allSpareParts}
                amounts={amounts}
                setAmounts={setAmounts}
              />
            </Box>
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
            <Button
              variant="contained"
              onClick={handleSubmit}
              // onClick={checkSum}
              sx={buttonStyle}
              disabled={loading}
            >
              {sid ? "Update" : "Submit"}
              <PulseLoader
                color={"#4B46E5"}
                loading={loading}
                size={10}
                speedMultiplier={0.5}
              />
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box></Box>
    </div>
  );
};

export default AddSales;

const buttonStyle = {
  px: 2,
  py: 1.25,
  fontSize: "14px",
  fontWeight: 600,
  minWidth: "127px",
  minHeight: "44px",
};
