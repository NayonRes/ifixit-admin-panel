import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ColorPalette from "../../color-palette/ColorPalette";
import { getDataWithToken } from "../../services/GetDataService";

const style = {
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 3,
    pb: 1,
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
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
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
  device,
  setDevice,
  brand,
  brand_id,
  parentList,
  setParentList,
}) => {
  const [items, setItems] = useState([]);
  const [childList, setChildList] = useState([]);
  const [parent, setParent] = useState("");
  const [child, setChild] = useState("");
  // const getParent = async () => {
  //   // let url = `/api/v1/device/get-by-parent?parent_name=Primary`;
  //   let url = `/api/v1/device/parent-child-list`;
  //   let allData = await getDataWithToken(url);
  //   console.log("primary list", allData?.data.data);
  //   setParentList(allData?.data.data);
  // };
  const getTechnician = async () => {
    // let url = `/api/v1/device/get-by-parent?parent_name=Primary`;
    let url = `/api/v1/user/dropdownlist?designation=Technician`;
    let allData = await getDataWithToken(url);
    console.log("technician list", allData?.data.data);
  };

  const handleChangeParent = async (name) => {
    console.log("name", name);
    let items = parentList.filter((item) => item.parent_name == name);
    console.log("parent", items[0]?.items);
    setItems(items[0]?.items);
    setParent(name);
    // let items = parentList.filter((item) => item.parent_name == name);
    // console.log(items);
  };

  const handleChangeChild = (name) => {
    setChild(name);
    let url = `/api/v1/device/get-by-parent?parent_name=${name}`;
    let allData = getDataWithToken(url);
    console.log("after child list", allData?.data?.data);
  };

  const getTopItems = () => {
    // console.log("c list", brand);
    let items = parentList.filter((item) => item.parent_name == brand);
    // console.log("cc", items[0]?.items);
    setChildList(items[0]?.items);
  };

  useEffect(() => {
    getTopItems();
    getTechnician();
  }, []);
  useEffect(() => {
    getTopItems();
  }, [brand]);

  return (
    <div>
      {/* <RepairChecklist /> */}
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
                  onMouseEnter={() => handleChangeParent(data?.name)}
                >
                  {data?.name}
                </Box>
              ))}
          </Box>
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
        {items &&
          items.length > 0 &&
          items.map((item, index) => (
            <Grid size={3} key={index}>
              <Box
                sx={device == item.name ? style.cardActive : style.card}
                role="button"
                onClick={() => setDevice(item.name)}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={item?.image?.url ? item?.image?.url : "/noImage.png"}
                    alt=""
                    style={{ maxWidth: 30 }}
                  />
                </Box>

                <Typography variant="body1">{item.name}</Typography>
                {device == item.name && (
                  <Box>
                    <Checkbox checked={device == item.name} />
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default ModelList;
