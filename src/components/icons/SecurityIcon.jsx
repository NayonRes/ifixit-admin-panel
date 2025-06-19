import React from "react";

const SecurityIcon = ({ color,iconClass }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={iconClass}
    >
      <path
        d="M10.4899 2.23L5.49991 4.09999C4.34991 4.52999 3.40991 5.88998 3.40991 7.11998V14.55C3.40991 15.73 4.18992 17.28 5.13992 17.99L9.43991 21.2C10.8499 22.26 13.1699 22.26 14.5799 21.2L18.8799 17.99C19.8299 17.28 20.6099 15.73 20.6099 14.55V7.11998C20.6099 5.88998 19.6699 4.52999 18.5199 4.09999L13.5299 2.23C12.6799 1.92 11.3199 1.92 10.4899 2.23Z"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.9999 10.92C11.9599 10.92 11.9099 10.92 11.8699 10.92C10.9299 10.89 10.1799 10.11 10.1799 9.16C10.1799 8.19 10.9699 7.39999 11.9399 7.39999C12.9099 7.39999 13.7 8.19 13.7 9.16C13.69 10.12 12.9399 10.89 11.9999 10.92Z"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.01 13.72C9.05004 14.36 9.05004 15.41 10.01 16.05C11.1 16.78 12.89 16.78 13.98 16.05C14.94 15.41 14.94 14.36 13.98 13.72C12.9 12.99 11.11 12.99 10.01 13.72Z"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default SecurityIcon;
