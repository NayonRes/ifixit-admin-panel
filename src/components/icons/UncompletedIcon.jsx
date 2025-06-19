import React from "react";

const UncompletedIcon = ({ color, iconClass }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      className={iconClass}
    >
      <path
        d="M2.91675 13.485L4.82924 13.4925C5.51174 13.4925 6.14925 13.155 6.52425 12.5925L11.3168 5.4075C11.6918 4.845 12.3292 4.49999 13.0117 4.50749L16.4243 4.5225"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14.9167 14.985L16.4167 13.485"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.33426 6.46499L6.52425 5.33999C6.14175 4.80749 5.52674 4.49249 4.87424 4.49999L2.91675 4.5075"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.3943 11.535L11.3093 12.7125C11.6918 13.2075 12.2918 13.5 12.9218 13.5L16.4243 13.485"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.4167 4.51501L14.9167 3.01501"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default UncompletedIcon;
