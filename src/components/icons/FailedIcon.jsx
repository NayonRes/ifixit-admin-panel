import React from "react";

const FailedIcon = ({ color,iconClass }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      className={iconClass}
    >
      <circle
        cx="4.83325"
        cy="13.5"
        r="1.5"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        cx="4.83325"
        cy="4.5"
        r="1.5"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        cx="13.8333"
        cy="13.5"
        r="1.5"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.83325 6V12"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.8333 8.25V12"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12.8636 2.46967C12.5707 2.17678 12.0958 2.17678 11.8029 2.46967C11.51 2.76256 11.51 3.23744 11.8029 3.53033L12.8636 2.46967ZM14.8029 6.53033C15.0958 6.82322 15.5707 6.82322 15.8636 6.53033C16.1565 6.23744 16.1565 5.76256 15.8636 5.46967L14.8029 6.53033ZM15.8636 3.53033C16.1565 3.23744 16.1565 2.76256 15.8636 2.46967C15.5707 2.17678 15.0958 2.17678 14.8029 2.46967L15.8636 3.53033ZM11.8029 5.46967C11.51 5.76256 11.51 6.23744 11.8029 6.53033C12.0958 6.82322 12.5707 6.82322 12.8636 6.53033L11.8029 5.46967ZM11.8029 3.53033L14.8029 6.53033L15.8636 5.46967L12.8636 2.46967L11.8029 3.53033ZM14.8029 2.46967L11.8029 5.46967L12.8636 6.53033L15.8636 3.53033L14.8029 2.46967Z"
        stroke={color || "#555555"}
      />
    </svg>
  );
};

export default FailedIcon;
