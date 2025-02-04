import React, { useEffect, useState, useContext } from "react";
import { Box, Button, Checkbox, Skeleton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ColorPalette from "../../color-palette/ColorPalette";
import { getDataWithToken } from "../../services/GetDataService";
import { AuthContext } from "../../context/AuthContext";
import { useSnackbar } from "notistack";

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
}) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([
    // { name: "Primary", items: [] },
    // { name: "Secondary", items: [] },
  ]);
  const [childList, setChildList] = useState([]);
  const [subChildList, setSubChildList] = useState([]);
  const [parent, setParent] = useState("");
  const [child, setChild] = useState("");
  const [device_id, set_device_id] = useState("");
  const [loading, setLoading] = useState("");
  // const getParent = async () => {
  //   // let url = `/api/v1/device/get-by-parent?parent_name=Primary`;
  //   let url = `/api/v1/device/parent-child-list`;
  //   let allData = await getDataWithToken(url);
  //   console.log("primary list", allData?.data.data);
  //   setParentList(allData?.data.data);
  // };

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

  const handleChangeParent = async (name, device_id) => {
    console.log("name", name, device_id);
    set_device_id(device_id);
    let items = parentList.filter((item) => item.parent_name == name);
    console.log("parent", items[0]?.items);
    setSubChildList(items[0]?.items);
    setParent(name);
    // TODO: WORKING
    if (!items[0]?.items) {
      handleChangeChild(name, device_id);
    }
    // let items = parentList.filter((item) => item.parent_name == name);
    // console.log(items);
  };

  const handleChangeChild = async (name, device_id) => {
    setLoading(true);
    setChild(name);
    set_device_id(device_id);
    let url = `/api/v1/model/get-by-device?device_id=${device_id}`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    console.log("after child list", allData?.data?.data);
    setItems(allData?.data?.data);

    if (allData.status >= 200 && allData.status < 300) {
      setItems(allData?.data?.data);
    } else {
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading(false);
  };

  const getTopItems = () => {
    console.log("c list", brand, parentList);
    let items = parentList.filter((item) => item.parent_name == brand);
    // console.log("cc", items[0]?.items);
    setChildList(items[0]?.items);
  };

  useEffect(() => {
    getTopItems();
  }, [brand]);

  return (
    <div className="">
      {childList?.length > 0 && (
        <div>
          <Grid container columnSpacing={3} sx={{}}>
            <Grid size={12}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 3 }}>
                Select Model
              </Typography>
            </Grid>
            <Grid size={12}>
              <Box sx={style.nav}>
                {childList?.length > 0 &&
                  childList?.map((data, index) => (
                    <Box
                      role="button"
                      sx={parent == data?.name ? style.linkActive : style.link}
                      key={index}
                      onClick={() => handleChangeParent(data?.name, data?._id)}
                    >
                      {data?.name}
                    </Box>
                  ))}
              </Box>
              {subChildList?.length > 0 && (
                <Box sx={style.nav2}>
                  {subChildList?.map((data, index) => (
                    <Button
                      variant={child == data?.name ? "contained" : "outlined"}
                      key={index}
                      onClick={() => handleChangeChild(data?.name, data?._id)}
                    >
                      {data?.name}
                    </Button>
                  ))}
                </Box>
              )}

              {/* <Box sx={style.nav} style={{ marginTop: 20 }}>
            {childList?.length > 0 &&
              childList?.map((data, index) => (
                <Box
                  role="button"
                  sx={child == data?.name ? style.linkActive : style.link}
                  key={index}
                  onClick={() => handleChangeChild(data?.name)}
                >
                  {data?.name}
                </Box>
              ))}
          </Box> */}
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {!loading &&
              items &&
              items.length > 0 &&
              items.map((item, index) => (
                <Grid size={3} key={index}>
                  <Box
                    sx={device == item.name ? style.cardActive : style.card}
                    role="button"
                    onClick={() => {
                      setDevice(item.name);
                      setDeviceId(item?._id);
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <img
                        src={
                          item?.image?.url ? item?.image?.url : "/noImage.png"
                        }
                        alt=""
                        style={{ maxWidth: 30 }}
                      />
                      <Typography variant="body1">{item.name}</Typography>
                    </Box>

                    {device == item.name && (
                      <Box>
                        <Checkbox checked={device == item.name} />
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

            {/* {items && items.length == 0 && (
          <Grid size={12}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                mb: 3,
                mt: 3,
                textAlign: "center",
              }}
            >
              No Data Found
            </Typography>
          </Grid>
        )} */}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default ModelList;
