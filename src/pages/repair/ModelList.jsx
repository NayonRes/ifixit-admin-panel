import React, { useEffect, useState, useContext } from "react";
import {
  backdropClasses,
  Box,
  Button,
  Checkbox,
  Skeleton,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ColorPalette from "../../color-palette/ColorPalette";
import { getDataWithToken } from "../../services/GetDataService";
import { AuthContext } from "../../context/AuthContext";
import { useSnackbar } from "notistack";
import RepairChecklist from "./RepairChecklist";
import IssueList from "./IssueList";
import { jwtDecode } from "jwt-decode";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

const style = {
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 3,
    pb: 1,
    borderBottom: `1px solid ${ColorPalette.light.primary.light}`,
    width: "100%",
  },
  nav2: {
    display: "flex",
    alignItems: "center",
    gap: 3,
    pb: 2,
    pt: 2,
    borderBottom: `1px solid ${ColorPalette.light.primary.light}`,

    width: "100%",
  },
  link: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 1,
    px: "4px",
  },
  linkActive: {
    cursor: "pointer",
    color: ColorPalette.light.primary.main,
    display: "flex",
    alignItems: "center",
    position: "relative",
    gap: 1,
    px: "4px",
    "&:before": {
      content: '""',
      width: "100%",
      height: "2px",
      backgroundColor: ColorPalette.light.primary.main,
      position: "absolute",
      bottom: -9,
      left: 0,
      right: 0,
    },
  },
  card: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 2,
    border: `1px solid ${ColorPalette.light.primary.light}`,
    backgroundColor: ColorPalette.light.text.bg,
    borderRadius: "8px",
    height: "100%",
    width: "100%",
    p: 2,
  },
  cardActive: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    border: `1px solid ${ColorPalette.light.primary.main}`,
    backgroundColor: ColorPalette.light.text.bg,
    borderRadius: "8px",
    height: "100%",
    width: "100%",
    p: 2,
  },
};

const ModelList = ({
  id,
  device,
  setDevice,
  brand,
  brand_id,
  parentList,
  setParentList,
  deviceId,
  setDeviceId,
  steps,
  setSteps,
  repair_checklist,
  set_repair_checklist,
  issueList,
  setIssueList,
  issue,
  setIssue,
  allIssue,
  setAllIssue,
  allSpareParts,
  setAllSpareParts,
  allIssueUpdate,
  subChildDeviceList,
  setSubChildDeviceList,
  parentDevice,
  setParentDevice,
  childDevice,
  setChildDevice,
  modelList,
  setModelList,
  issueArr,
  setIssueArr,
  issueLoading,
  setIssueLoading,
  productList,
  setProductList,
  productLoading,
  setProductLoading,

  previousRepairData,
  setPreviousRepairData,

  repairCheckList,
  setRepairCheckList,
  issueLoading2,
  setIssueLoading2,
  branchList,
  setBranchList,
  stockLimitList,
  setStockLimitList,
}) => {
  const location = useLocation();
  const { rid } = useParams();
  console.log("pathname", location.pathname);

  const [searchParams] = useSearchParams();
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [showComponent, setShowComponent] = useState("Model List");

  const [childList, setChildList] = useState([]);

  const [selected_device_id, set_selected_device_id] = useState("");
  const [loading, setLoading] = useState("");
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

  const handleChangeParent = async (device_id) => {
    console.log(
      "device_id **********************************************",
      device_id
    );
    if (!location.pathname.includes("/update-repair")) {
      if (parentDevice === device_id) {
        // if click the previous device do not do anything
        return;
      }
    }

    setSubChildDeviceList([]);
    // set_selected_device_id(device_id);
    let items = parentList.filter((item) => item.parent_id === device_id);

    setSubChildDeviceList(items);
    setParentDevice(device_id);
    setModelList([]);

    // TODO: WORKING
    // if (items?.length < 1) {
    handleChangeChild(device_id);
    // }
  };

  const handleChangeChild = async (device_id) => {
    if (!location.pathname.includes("/update-repair")) {
      if (childDevice === device_id) {
        return;
      }
    }

    setLoading(true);
    setChildDevice(device_id);
    // set_selected_device_id(device_id);

    let url = `/api/v1/model/get-by-device?device_id=${device_id}`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    console.log("after childDevice list", allData?.data?.data);

    if (allData.status >= 200 && allData.status < 300) {
      setModelList(allData?.data?.data);
    } else {
      handleSnakbarOpen(allData?.data?.message, "error");
      setLoading(false);
    }
    setLoading(false);
  };

  const getTopItems = () => {
    console.log("c list", brand, parentList);
    let items = parentList.filter((item) => item.parent_name == brand);
    console.log("cc list ----- ", items[0]?.items);
    setChildList(items[0]?.items);
  };
  const getProducts = async (device_id) => {
    setProductLoading(true);

    let branch_id = getBranchId();

   
    let url = `/api/v1/product/branch-stocks?attachable_models=${device_id}&branch_id=${branch_id}`;

    let allData = await getDataWithToken(url);
    // console.log("(allData?.data?.data products", allData?.data?.data);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      console.log("lll", allData?.data?.data);
      const variationIds =
        allData?.data?.data?.flatMap((item) =>
          Array.isArray(item?.variation_data)
            ? item.variation_data.map((v) => v._id)
            : []
        ) || [];

      console.log("variationIds", variationIds);
      // getBranchLimit(variationIds);
      setProductList(allData?.data?.data);
    } else {
      setProductLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setProductLoading(false);
  };
  const getBranchLimit = async (product_variation_ids) => {
    // let url = `/api/v1/model/device-model?deviceId=${id}`;
    let url = `/api/v1/stockCounterAndLimit/branch-limit?product_variation_ids=${product_variation_ids}`;

    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    console.log("getBranchLimit************************", allData?.data?.data);

    if (allData.status >= 200 && allData.status < 300) {
      // setModelList(allData?.data?.data);

      let newLimitListwithBranchData = allData?.data?.data?.map((item) => {
        let newData = branchList?.find((el) => el._id === item?.branch_id);
        return { ...item, branch_name: newData?.name }; // Defaults to 0 if stock_limit is undefined
      });

      console.log("newLimitListwithBranchData", newLimitListwithBranchData);
      setStockLimitList(newLimitListwithBranchData);
    } else {
      handleSnakbarOpen(allData?.data?.message, "error");
    }
  };
  const getRepairCheckList = async (device_id) => {
    setIssueLoading2(true);

    let url = `/api/v1/issue?model_id=${device_id}`;
    let allData = await getDataWithToken(url);

    if (allData?.status >= 200 && allData?.status < 300) {
      if (allData?.data?.data?.length > 0) {
        let issues = allData?.data?.data?.map((item) => ({
          model_id: item?._id,
          name: item?.name,
          status: false,
        }));
        console.log("issues", issues);
        if (location.pathname.includes("/update-repair")) {
          let preArr = repair_checklist?.checklist;
          if (!preArr) {
            preArr = [];
          }
          console.log("preArr", preArr);

          const updatedAllArr = issues?.map((item) => {
            const match = preArr.find(
              (preItem) => preItem.model_id === item.model_id
            );
            return match ? { ...item, status: match.status } : item;
          });
          console.log("updatedAllArr", updatedAllArr);

          // const newItems = preArr.filter(
          //   (preItem) =>
          //     !repairCheckList.some((item) => item.name === preItem.name)
          // );

          // const finalUpdatedAllArr = [...updatedAllArr, ...newItems];

          // console.log("updatedAllArr", finalUpdatedAllArr);
          setRepairCheckList(updatedAllArr);
        } else {
          setRepairCheckList(issues);
        }
      }
    } else {
      setIssueLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setIssueLoading2(false);
  };
  const getServices = async (device_id) => {
    setIssueLoading(true);

    let branch_id = getBranchId();
    //localhost:8088/api/v1/service?branch_id=id&brand_id=&device_id=&model_id=6787aac7c296a2f8e87871ec

    let url = `/api/v1/service?model_id=${device_id}&branch_id=${branch_id}&limit=1000`;

    let allData = await getDataWithToken(url);
    console.log(
      "(allData?.data?.data products issue list",
      allData?.data?.data
    );

    if (allData?.status === 401) {
      logout();
      return;
    }
    // allData?.data?.data?.map((item)=>{
    //   if(){

    //   }
    // })
    let allRepairs = allData?.data?.data?.flatMap((item) => item.repair_info);
    console.log("allRepairs", allRepairs);

    const repairServices = allRepairs.map((service) => ({
      _id: service._id,
      service_id: service._id,
      name: service?.product_data?.name
        ? service?.product_data?.name +
          " " +
          service?.product_variation_data?.name +
          " Assemble Charge"
        : service.name,
      repair_image: service.repair_image,
      details: service.details,
      repair_cost: service.repair_cost,
      guaranty: service.guaranty,
      warranty: service.warranty,
    }));

    // console.log("dddfdf", repairServices);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      setIssueLoading(false);
      setIssueArr(repairServices);

      // if (allData.data.data.length < 1) {
      //   setMessage("No data found");
      // }
    } else {
      setIssueLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
  };
  // useEffect(() => {
  //   getTopItems();
  // }, [brand]);

  useEffect(() => {
    console.log(
      "previousRepairData?.model_data?.[0]?.device_id",
      previousRepairData?.model_data?.[0]?.device_id
    );

    if (rid) {
      handleChangeParent(previousRepairData?.model_data?.[0]?.device_id);
    }
  }, []);

  useEffect(() => {
    if (location.pathname.includes("/update-repair")) {
      getRepairCheckList(deviceId);
      getServices(deviceId);
      getProducts(deviceId);
    }
  }, []);

  return (
    <div className="">
      {/* <Button onClick={() => setSteps("repair_list")}>Repair List</Button> */}
      <RepairChecklist
        set_repair_checklist={set_repair_checklist}
        repair_checklist={repair_checklist}
        issueList={issueList}
        setIssueList={setIssueList}
        steps={steps}
        setSteps={setSteps}
        deviceId={deviceId}
        showComponent={showComponent}
        setShowComponent={setShowComponent}
        repairCheckList={repairCheckList}
        setRepairCheckList={setRepairCheckList}
        issueLoading2={issueLoading2}
        setIssueLoading2={setIssueLoading2}
      />
      {showComponent === "Model List" && (
        <>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 3 }}>
            Select Model
          </Typography>
          {parentList?.length > 0 && (
            <div>
              <Grid container columnSpacing={3} sx={{}}>
                <Grid size={12}>
                  <Box sx={style.nav}>
                    {parentList?.length > 0 &&
                      parentList
                        ?.filter((item) => item.parent_id === null) // Keep only those with parent_id: null

                        ?.map((data, index) => (
                          <Box
                            role="button"
                            sx={
                              parentDevice == data?._id
                                ? style.linkActive
                                : style.link
                            }
                            key={index}
                            onClick={() => handleChangeParent(data?._id)}
                          >
                            <img
                              src={
                                data?.image?.url
                                  ? data?.image?.url
                                  : "/noImage.jpg"
                              }
                              alt=""
                              style={{ maxWidth: 30 }}
                            />
                            {data?.name?.replace(/series\.?/i, "").trim()}
                            {/* item.name.replace(/series\.?/i, "").trim(), // Remove 'Series' (case-insensitive) and any trailing '.' */}
                          </Box>
                        ))}
                  </Box>
                  {subChildDeviceList?.length > 0 && (
                    <Box sx={style.nav2}>
                      {subChildDeviceList?.map((data, index) => (
                        <Button
                          variant={
                            childDevice === data?._id ? "contained" : "outlined"
                          }
                          key={index}
                          onClick={() => handleChangeChild(data?._id)}
                        >
                          {data?.name}
                        </Button>
                      ))}
                    </Box>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 3 }}>
                {!loading &&
                  modelList &&
                  modelList.length > 0 &&
                  modelList?.map((item, index) => (
                    <Grid size={3} key={index}>
                      <Box
                        sx={
                          deviceId == item._id ? style.cardActive : style.card
                        }
                        role="button"
                        onClick={() => {
                          setDevice(item.name);
                          setDeviceId(item?._id);
                          getRepairCheckList(item?._id);
                          getServices(item?._id);
                          getProducts(item?._id);
                          setAllIssue([]);
                          setAllSpareParts([]);
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <img
                            src={
                              item?.image?.url
                                ? item?.image?.url
                                : "/noImage.jpg"
                            }
                            alt=""
                            style={{ maxWidth: 30 }}
                          />
                          <Typography variant="body1">{item.name}</Typography>
                        </Box>

                        {deviceId == item._id && (
                          <Box>
                            <Checkbox checked={deviceId == item._id} />
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  ))}

                {loading && (
                  <Grid size={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 3,
                      }}
                    >
                      <Skeleton height={100} sx={{ flex: 1 }} />
                      <Skeleton height={100} sx={{ flex: 1 }} />
                      <Skeleton height={100} sx={{ flex: 1 }} />
                      <Skeleton height={100} sx={{ flex: 1 }} />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </div>
          )}
        </>
      )}

      {showComponent == "Issue List" && (
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
          issueList={issueList}
          setIssueList={setIssueList}
          steps={steps}
          setSteps={setSteps}
          issueArr={issueArr}
          setIssueArr={setIssueArr}
          issueLoading={issueLoading}
          setIssueLoading={setIssueLoading}
          productList={productList}
          setProductList={setProductList}
          productLoading={productLoading}
          setProductLoading={setProductLoading}
          branchList={branchList}
          setBranchList={setBranchList}
        />
      )}
    </div>
  );
};

export default ModelList;
