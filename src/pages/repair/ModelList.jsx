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
    justifyContent: "center",
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
    justifyContent: "center",
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
  const getParent = async () => {
    let url = `/api/v1/device/get-by-parent?parent_name=Primary`;
    let allData = await getDataWithToken(url);
    console.log("list", allData?.data.data);
    setParentList(allData?.data.data);
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
            <Box role="button" sx={style.link}>
              All
            </Box>
            <Box sx={style.linkActive}>
              <svg
                width="24"
                height="22"
                viewBox="0 0 24 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1.14258 14.8992H22.8573V2.08984H1.14258V14.8992ZM11.9974 15.6805V15.6555C11.9974 15.6254 12.0024 15.5953 12.0174 15.5652C12.0274 15.5352 12.0475 15.5101 12.0625 15.4901C12.0876 15.465 12.1126 15.44 12.1477 15.4249C12.1828 15.4049 12.2129 15.3949 12.2429 15.3949C12.2479 15.3999 12.2479 15.4099 12.2479 15.4199C12.2479 15.45 12.2429 15.4801 12.2279 15.5151C12.2179 15.5452 12.1978 15.5703 12.1828 15.5903C12.1627 15.6154 12.1327 15.6404 12.1026 15.6555C12.0725 15.6705 12.0425 15.6805 12.0124 15.6805H11.9974ZM12.0074 15.7504C12.0224 15.7504 12.0425 15.7454 12.0675 15.7354C12.0876 15.7254 12.1126 15.7154 12.1377 15.7053C12.1627 15.6953 12.1928 15.6953 12.2229 15.6953C12.2379 15.6953 12.258 15.6953 12.283 15.7003C12.3131 15.7053 12.3432 15.7154 12.3782 15.7304C12.4133 15.7454 12.4434 15.7755 12.4684 15.8156C12.4684 15.8156 12.4584 15.8206 12.4484 15.8306C12.4334 15.8406 12.4183 15.8557 12.3983 15.8757C12.3832 15.8958 12.3682 15.9208 12.3532 15.9459C12.3432 15.976 12.3381 16.011 12.3381 16.0511C12.3381 16.0962 12.3432 16.1363 12.3582 16.1664C12.3782 16.1965 12.3933 16.2215 12.4183 16.2416C12.4384 16.2616 12.4584 16.2766 12.4734 16.2867C12.4885 16.2967 12.4985 16.2967 12.5035 16.3017C12.4985 16.3017 12.4935 16.3217 12.4785 16.3568C12.4684 16.3919 12.4484 16.432 12.4183 16.4721C12.3883 16.5122 12.3632 16.5473 12.3331 16.5773C12.3031 16.6124 12.268 16.6274 12.2229 16.6274C12.1978 16.6274 12.1728 16.6224 12.1577 16.6124C12.1377 16.6074 12.1176 16.5974 12.1026 16.5874C12.0826 16.5823 12.0575 16.5773 12.0224 16.5773C11.9923 16.5773 11.9673 16.5823 11.9422 16.5874C11.9222 16.5974 11.9021 16.6074 11.8871 16.6124C11.8671 16.6224 11.842 16.6274 11.8169 16.6274C11.7819 16.6274 11.7468 16.6124 11.7167 16.5823C11.6866 16.5523 11.6566 16.5122 11.6265 16.4721C11.5914 16.422 11.5614 16.3568 11.5363 16.2867C11.5112 16.2115 11.5012 16.1363 11.5012 16.0612C11.5012 15.981 11.5163 15.9158 11.5463 15.8607C11.5764 15.8056 11.6115 15.7655 11.6616 15.7404C11.7067 15.7103 11.7568 15.6953 11.8069 15.6953C11.837 15.6953 11.862 15.7003 11.8871 15.7103C11.9072 15.7204 11.9322 15.7254 11.9523 15.7354C11.9723 15.7454 11.9923 15.7504 12.0074 15.7504ZM22.8574 0.976562H1.14262C0.511171 0.976562 0 1.4727 0 2.08911V16.5122C0 17.0634 0.451034 17.5145 1.0023 17.5145H10.469L10.1783 19.2635C10.058 19.9901 9.43161 20.5214 8.69493 20.5214H7.96325V21.0225H15.9816V20.5214H15.2499C14.5133 20.5214 13.8868 19.9901 13.7665 19.2635L13.4759 17.5145H22.9977C23.549 17.5145 24 17.0634 24 16.5122V2.08911C24 1.4727 23.4888 0.976562 22.8574 0.976562Z"
                  fill="#667085"
                />
              </svg>
              iMac
            </Box>
            <Box sx={style.link}>
              <svg
                width="24"
                height="6"
                viewBox="0 0 24 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M20.143 4.92801C19.5515 4.92801 19.0715 4.44801 19.0715 3.85658C19.0715 3.26516 19.5515 2.78516 20.143 2.78516C20.7335 2.78516 21.2144 3.26516 21.2144 3.85658C21.2144 4.44801 20.7335 4.92801 20.143 4.92801ZM0 0V4.28571C0 5.22857 0.770571 6 1.71429 6H22.2857C23.2286 6 24 5.22857 24 4.28571V0H0Z"
                  fill="#667085"
                />
              </svg>
              Mac Mini
            </Box>
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
            <Box>
              <Checkbox checked={device === "iPhone 15 Pro Max"} />
            </Box>
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
            <Box>
              <Checkbox checked={device === "iPhone 12"} />
            </Box>
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
            <Box>
              <Checkbox checked={device === "iPhone 13"} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default ModelList;
