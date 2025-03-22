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
import { useSearchParams } from "react-router-dom";

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
}) => {
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

  const handleChangeParent = async (device_id, update) => {
    console.log(
      "device_id **********************************************",
      device_id
    );
    if (!update) {
      if (parentDevice === device_id) {
        // if click the previous device do not do anything
        return;
      }
    }
    console.log("111111111111111111");
    setSubChildDeviceList([])
    // set_selected_device_id(device_id);
    let items = parentList.filter((item) => item.parent_id === device_id);
    console.log("222222222222222", items);
    setSubChildDeviceList(items);
    setParentDevice(device_id);
    setModelList([]);

    console.log("333333333333333", update, items);
    // TODO: WORKING
    if (items?.length < 1) {
      console.log("333333333333333", update, items);
      handleChangeChild(device_id, update);
    }
  };

  const handleChangeChild = async (device_id, update) => {
    if (!update) {
      if (childDevice === device_id) {
        return;
      }
    }
    console.log("55555555555555555555555555555", update);
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

    // let url = `/api/v1/product?brand_id=${brand_id}&model_id=${deviceId}&device_id=${partsDeviceId}&branch_id=${branch_id}`;

    let url = `/api/v1/product?model_id=${device_id}&branch_id=${branch_id}`;

    // url = `/api/v1/product?name=${newSearchProductText.trim()}&category_id=${newCategoryId}&brand_id=${newBrandId}&device_id=${newDeviceId}&model_id=${newModelId}`;

    let allData = await getDataWithToken(url);
    // console.log("(allData?.data?.data products", allData?.data?.data);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      console.log("lll", allData?.data?.data);
      setProductList(allData?.data?.data);
    } else {
      setProductLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setProductLoading(false);
  };
  const getServices = async (device_id) => {
    setIssueLoading(true);

    let branch_id = getBranchId();
    //localhost:8088/api/v1/service?branch_id=id&brand_id=&device_id=&model_id=6787aac7c296a2f8e87871ec

    let url = `/api/v1/service?model_id=${device_id}&branch_id=${branch_id}`;

    let allData = await getDataWithToken(url);
    console.log(
      "(allData?.data?.data products issue list",
      allData?.data?.data
    );

    if (allData?.status === 401) {
      logout();
      return;
    }
    let allRepairs = allData?.data?.data?.flatMap((item) => item.repair_info);

    const repairServices = allRepairs.map((service) => ({
      _id: service._id,
      service_id: service._id,
      name: service.name,
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

    let repairId = searchParams.get("repairId");
    if (repairId) {
      handleChangeParent(previousRepairData?.model_data?.[0]?.device_id, true);
    }
  }, []);

  return (
    <div className="">
      {/* <Button onClick={() => setSteps("repair_list")}>Repair List</Button> */}
      <RepairChecklist
        set_repair_checklist={set_repair_checklist}
        repair_checklist={repair_checklist}
        steps={steps}
        setSteps={setSteps}
        deviceId={deviceId}
        showComponent={showComponent}
        setShowComponent={setShowComponent}
      />
      {showComponent === "Model List" && (
        <>
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, mb: 3 }}
            onClick={() =>
              console.log("parentDevice", parentDevice, childDevice)
            }
          >
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
        />
      )}
    </div>
  );
};

export default ModelList;
