import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ColorPalette from "../../color-palette/ColorPalette";
import { BackHand } from "@mui/icons-material";
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
    border: `3px solid ${ColorPalette.light.primary.main}`,
    backgroundColor: ColorPalette.light.text.bg,
    borderRadius: "8px",
    height: "100%",
    width: "100%",
    p: 2,
  },
};

const rework = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.445 20.913C11.1669 20.8242 10.917 20.6638 10.7204 20.4479C10.5238 20.232 10.3874 19.9682 10.325 19.683C10.2611 19.4192 10.1358 19.1742 9.95929 18.968C9.7828 18.7618 9.56011 18.6001 9.30935 18.4963C9.05859 18.3924 8.78683 18.3491 8.51621 18.3701C8.24559 18.3911 7.98375 18.4757 7.752 18.617C6.209 19.557 4.442 17.791 5.382 16.247C5.5231 16.0153 5.60755 15.7537 5.62848 15.4832C5.64942 15.2128 5.60624 14.9412 5.50247 14.6906C5.3987 14.44 5.23726 14.2174 5.03127 14.0409C4.82529 13.8645 4.58056 13.7391 4.317 13.675C2.561 13.249 2.561 10.751 4.317 10.325C4.5808 10.2611 4.82578 10.1358 5.032 9.95929C5.23822 9.7828 5.39985 9.56011 5.50375 9.30935C5.60764 9.05859 5.65085 8.78683 5.62987 8.51621C5.60889 8.24559 5.5243 7.98375 5.383 7.752C4.443 6.209 6.209 4.442 7.753 5.382C8.753 5.99 10.049 5.452 10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.7389 4.5808 13.8642 4.82578 14.0407 5.032C14.2172 5.23822 14.4399 5.39985 14.6907 5.50375C14.9414 5.60764 15.2132 5.65085 15.4838 5.62987C15.7544 5.60889 16.0162 5.5243 16.248 5.383C17.791 4.443 19.558 6.209 18.618 7.753C18.4769 7.98466 18.3924 8.24634 18.3715 8.51677C18.3506 8.78721 18.3938 9.05877 18.4975 9.30938C18.6013 9.55999 18.7627 9.78258 18.9687 9.95905C19.1747 10.1355 19.4194 10.2609 19.683 10.325C20.993 10.643 21.326 12.115 20.68 13.019M15 19L17 21L21 17M9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12Z"
      stroke="#EAAA08"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const failed = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.675 19.683C13.249 21.439 10.751 21.439 10.325 19.683C10.2611 19.4192 10.1358 19.1742 9.95929 18.968C9.7828 18.7618 9.56011 18.6001 9.30935 18.4963C9.05859 18.3924 8.78683 18.3491 8.51621 18.3701C8.24559 18.3911 7.98375 18.4757 7.752 18.617C6.209 19.557 4.442 17.791 5.382 16.247C5.5231 16.0153 5.60755 15.7537 5.62848 15.4832C5.64942 15.2128 5.60624 14.9412 5.50247 14.6906C5.3987 14.44 5.23726 14.2174 5.03127 14.0409C4.82529 13.8645 4.58056 13.7391 4.317 13.675C2.561 13.249 2.561 10.751 4.317 10.325C4.5808 10.2611 4.82578 10.1358 5.032 9.95929C5.23822 9.7828 5.39985 9.56011 5.50375 9.30935C5.60764 9.05859 5.65085 8.78683 5.62987 8.51621C5.60889 8.24559 5.5243 7.98375 5.383 7.752C4.443 6.209 6.209 4.442 7.753 5.382C8.753 5.99 10.049 5.452 10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.7389 4.5808 13.8642 4.82578 14.0407 5.032C14.2172 5.23822 14.4399 5.39985 14.6907 5.50375C14.9414 5.60764 15.2132 5.65085 15.4838 5.62987C15.7544 5.60889 16.0162 5.5243 16.248 5.383C17.791 4.443 19.558 6.209 18.618 7.753C18.4769 7.98466 18.3924 8.24634 18.3715 8.51677C18.3506 8.78721 18.3938 9.05877 18.4975 9.30938C18.6013 9.55999 18.7627 9.78258 18.9687 9.95905C19.1747 10.1355 19.4194 10.2609 19.683 10.325C21.439 10.751 21.439 13.249 19.683 13.675C19.5713 13.7017 19.4628 13.7399 19.359 13.789M22 22L17 17M17 22L22 17M9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12Z"
      stroke="#F04438"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const complete = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 12L12 17L22 7M2 12L7 17M12 12L17 7"
      stroke="#079455"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const testing = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.646 20.965C11.3244 20.9043 11.0278 20.7504 10.7929 20.5224C10.5581 20.2945 10.3953 20.0026 10.325 19.683C10.2611 19.4192 10.1358 19.1742 9.95929 18.968C9.7828 18.7618 9.56011 18.6001 9.30935 18.4963C9.05859 18.3924 8.78683 18.3491 8.51621 18.3701C8.24559 18.3911 7.98375 18.4757 7.752 18.617C6.209 19.557 4.442 17.791 5.382 16.247C5.5231 16.0153 5.60755 15.7537 5.62848 15.4832C5.64942 15.2128 5.60624 14.9412 5.50247 14.6906C5.3987 14.44 5.23726 14.2174 5.03127 14.0409C4.82529 13.8645 4.58056 13.7391 4.317 13.675C2.561 13.249 2.561 10.751 4.317 10.325C4.5808 10.2611 4.82578 10.1358 5.032 9.95929C5.23822 9.7828 5.39985 9.56011 5.50375 9.30935C5.60764 9.05859 5.65085 8.78683 5.62987 8.51621C5.60889 8.24559 5.5243 7.98375 5.383 7.752C4.443 6.209 6.209 4.442 7.753 5.382C8.753 5.99 10.049 5.452 10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.7389 4.5808 13.8642 4.82578 14.0407 5.032C14.2172 5.23822 14.4399 5.39985 14.6907 5.50375C14.9414 5.60764 15.2132 5.65085 15.4838 5.62987C15.7544 5.60889 16.0162 5.5243 16.248 5.383C17.791 4.443 19.558 6.209 18.618 7.753C18.4769 7.98466 18.3924 8.24634 18.3715 8.51677C18.3506 8.78721 18.3938 9.05877 18.4975 9.30938C18.6013 9.55999 18.7627 9.78258 18.9687 9.95905C19.1747 10.1355 19.4194 10.2609 19.683 10.325C20.411 10.502 20.837 11.035 20.962 11.628M14.9844 11.6944C14.9266 11.1301 14.71 10.5937 14.3597 10.1474C14.0094 9.70124 13.5397 9.3635 13.0052 9.17342C12.4707 8.98334 11.8933 8.9487 11.3399 9.07353C10.7865 9.19836 10.2798 9.47754 9.87868 9.87868C9.47754 10.2798 9.19836 10.7865 9.07353 11.3399C8.9487 11.8933 8.98334 12.4707 9.17342 13.0052C9.3635 13.5397 9.70124 14.0094 10.1474 14.3597C10.5937 14.71 11.13 14.9266 11.6944 14.9844M20.1992 20.1992L21.9992 21.9992M15 18C15 18.7956 15.3161 19.5587 15.8787 20.1213C16.4413 20.6839 17.2044 21 18 21C18.7956 21 19.5587 20.6839 20.1213 20.1213C20.6839 19.5587 21 18.7956 21 18C21 17.2044 20.6839 16.4413 20.1213 15.8787C19.5587 15.3161 18.7956 15 18 15C17.2044 15 16.4413 15.3161 15.8787 15.8787C15.3161 16.4413 15 17.2044 15 18Z"
      stroke="#E62E05"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const onProgress = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 7L12 12L7 17M13 7L18 12L13 17"
      stroke="#4B46E5"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const diagnostic = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 4H5C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6V9.5C3 10.9587 3.57946 12.3576 4.61091 13.3891C5.64236 14.4205 7.04131 15 8.5 15C9.95869 15 11.3576 14.4205 12.3891 13.3891C13.4205 12.3576 14 10.9587 14 9.5V6C14 5.46957 13.7893 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4H11M8 15C8 15.7879 8.15519 16.5681 8.45672 17.2961C8.75825 18.0241 9.20021 18.6855 9.75736 19.2426C10.3145 19.7998 10.9759 20.2417 11.7039 20.5433C12.4319 20.8448 13.2121 21 14 21C14.7879 21 15.5681 20.8448 16.2961 20.5433C17.0241 20.2417 17.6855 19.7998 18.2426 19.2426C18.7998 18.6855 19.2417 18.0241 19.5433 17.2961C19.8448 16.5681 20 15.7879 20 15V12M20 12C19.4696 12 18.9609 11.7893 18.5858 11.4142C18.2107 11.0391 18 10.5304 18 10C18 9.46957 18.2107 8.96086 18.5858 8.58579C18.9609 8.21071 19.4696 8 20 8C20.5304 8 21.0391 8.21071 21.4142 8.58579C21.7893 8.96086 22 9.46957 22 10C22 10.5304 21.7893 11.0391 21.4142 11.4142C21.0391 11.7893 20.5304 12 20 12ZM11 3V5M6 3V5"
      stroke="#6938EF"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const hold = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.9422 13.0185C21.1536 11.1628 20.7824 9.28734 19.8801 7.65207C18.9778 6.01679 17.5891 4.70273 15.9065 3.89205C14.224 3.08136 12.3309 2.81422 10.4897 3.12764C8.64847 3.44107 6.95039 4.31954 5.63082 5.64127C4.31126 6.96301 3.43557 8.66253 3.12517 10.5042C2.81477 12.346 3.08503 14.2386 3.89847 15.9198C4.71192 17.6011 6.02826 18.9876 7.66502 19.8872C9.30177 20.7868 11.1779 21.1549 13.0332 20.9405M12 7V12L14 14M17 17V22M21 17V22"
      stroke="#EF6820"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const cancelled = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="#343E54"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const notDelevered = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 10L15 4M7 10L9 4M12.9992 20H7.24324C6.52664 20 5.83372 19.7434 5.28987 19.2768C4.74602 18.8102 4.38716 18.1643 4.27824 17.456L3.02324 10.304C2.97941 10.019 2.99773 9.72786 3.07694 9.45059C3.15616 9.17331 3.2944 8.91645 3.48218 8.6976C3.66997 8.47876 3.90286 8.30311 4.16488 8.1827C4.42691 8.06229 4.71187 7.99997 5.00024 8H18.9992C19.2876 7.99997 19.5726 8.06229 19.8346 8.1827C20.0966 8.30311 20.3295 8.47876 20.5173 8.6976C20.7051 8.91645 20.8433 9.17331 20.9225 9.45059C21.0017 9.72786 21.0201 10.019 20.9762 10.304L20.4982 13.029M17 17V22M21 17V22M10 14C10 14.5304 10.2107 15.0391 10.5858 15.4142C10.9609 15.7893 11.4696 16 12 16C12.5304 16 13.0391 15.7893 13.4142 15.4142C13.7893 15.0391 14 14.5304 14 14C14 13.4696 13.7893 12.9609 13.4142 12.5858C13.0391 12.2107 12.5304 12 12 12C11.4696 12 10.9609 12.2107 10.5858 12.5858C10.2107 12.9609 10 13.4696 10 14Z"
      stroke="#EF6820"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

let statusList = [
  { name: "Rework", color: "#FEF7C3", icon: rework },
  { name: "Failed", color: "#FEE4E2", icon: failed },
  { name: "Complete", color: "#DCFAE6", icon: complete },
  { name: "Testing", color: "#FFE6D5", icon: testing },
  { name: "On progress", color: "#E0E8FF", icon: onProgress },
  { name: "Diagnostic", color: "#EBE9FE", icon: diagnostic },
  { name: "Hold", color: "#FDEAD7", icon: hold },
  { name: "Cancelled", color: "#EAECF1", icon: cancelled },
];
let deliveryStatusList = [
  { name: "Not Delivered", color: "#FFE6D5", icon: notDelevered },
  { name: "Delivered", color: "#DCFAE6", icon: complete },
];
const RepairStatusList = ({
  repairStatus,
  setRepairStatus,
  deliveryStatus,
  setDeliveryStatus,
}) => {
  return (
    <div>
      <Grid container columnSpacing={3} sx={{}}>
        <Grid size={12}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 3 }}>
            Repair Status
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} >
        {statusList.length > 0 &&
          statusList.map((item, index) => (
            <Grid size={3} key={index}>
              <Box
                sx={repairStatus === item.name ? style.cardActive : style.card}
                style={{
                  backgroundColor: item.color,
                }}
                role="button"
                onClick={() => setRepairStatus(item.name)}
              >
                {item.icon}

                <Typography variant="body1">{item.name}</Typography>
              </Box>
            </Grid>
          ))}
      </Grid>

      {/* ..... */}
      <Grid container columnSpacing={3} sx={{}}>
        <Grid size={12}>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 3, mt: 4 }}>
            Delivery Status
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} >
        {deliveryStatusList.length > 0 &&
          deliveryStatusList.map((item, index) => (
            <Grid size={6} key={index}>
              <Box
                sx={
                  deliveryStatus === item.name ? style.cardActive : style.card
                }
                style={{
                  backgroundColor: item.color,
                }}
                role="button"
                onClick={() => setDeliveryStatus(item.name)}
              >
                {item.icon}

                <Typography variant="body1">{item.name}</Typography>
              </Box>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default RepairStatusList;
