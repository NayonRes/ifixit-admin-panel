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

const ModelList = ({ device, setDevice }) => {
  const [parentList, setParentList] = useState([]);
  const [childList, setChildList] = useState([]);
  const [parent, setParent] = useState("");
  const [child, setChild] = useState("");
  const getParent = async () => {
    let url = `/api/v1/device/get-by-parent?parent_name=Primary`;
    let allData = await getDataWithToken(url);
    console.log("primary list", allData?.data.data);
    setParentList(allData?.data.data);
  };

  const handleChangeParent = async (name) => {
    setParent(name);
    let url = `/api/v1/device/get-by-parent?parent_name=${name}`;
    let allData = await getDataWithToken(url);
    console.log("child list", allData?.data?.data);
    setChildList(allData?.data?.data);
  };

  const handleChangeChild = (name) => {
    setChild(name);
    let url = `/api/v1/device/get-by-parent?parent_name=${name}`;
    let allData = getDataWithToken(url);
    console.log("after child list", allData?.data?.data);
  };

  useEffect(() => {
    getParent();
  }, []);

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
            {parentList?.length > 0 &&
              parentList?.map((data, index) => (
                <Box
                  role="button"
                  sx={parent == data?.name ? style.linkActive : style.link}
                  key={index}
                  onClick={() => handleChangeParent(data?.name)}
                >
                  {data?.name}
                </Box>
              ))}
          </Box>
          <Box sx={style.nav} style={{ marginTop: 20 }}>
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
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid size={3}>
          <Box
            sx={device === "iPhone 15 Pro Max" ? style.cardActive : style.card}
            role="button"
            onClick={() => setDevice("iPhone 15 Pro Max")}
          >
            <Box>
              <img src="/iphone.png" alt="" />
            </Box>

            <Typography variant="body1">iPhone 15 Pro Max</Typography>
            {device === "iPhone 15 Pro Max" && (
              <Box>
                <Checkbox checked={device === "iPhone 15 Pro Max"} />
              </Box>
            )}
          </Box>
        </Grid>
        <Grid size={3}>
          <Box
            sx={device === "iPhone 12" ? style.cardActive : style.card}
            role="button"
            onClick={() => setDevice("iPhone 12")}
          >
            <Box>
              <img src="/iphone.png" alt="" />
            </Box>

            <Typography variant="body1">iPhone 12</Typography>
            {device === "iPhone 12" && (
              <Box>
                <Checkbox checked={device === "iPhone 12"} />
              </Box>
            )}
          </Box>
        </Grid>

        <Grid size={3}>
          <Box
            sx={device === "iPhone 13" ? style.cardActive : style.card}
            role="button"
            onClick={() => setDevice("iPhone 13")}
          >
            <Box>
              <img src="/iphone.png" alt="" />
            </Box>

            <Typography variant="body1">iPhone 13</Typography>
            {device === "iPhone 13" && (
              <Box>
                <Checkbox checked={device === "iPhone 13"} />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default ModelList;
