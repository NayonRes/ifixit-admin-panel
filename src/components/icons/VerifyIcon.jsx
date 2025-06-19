import React from "react";

const VerifyIcon = ({ color, iconClass }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="10"
      viewBox="0 0 14 10"
      fill="none"
      className={iconClass}
    >
      <path
        d="M0.75 5L4.74529 9L12.75 1"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default VerifyIcon;
