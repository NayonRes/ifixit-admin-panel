import React from "react";

const DownloadIcon = ({ color,iconClass }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={iconClass}
    >
      <path
        d="M8 1.33334V6.00001L9.33333 4.66668"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.00008 5.99999L6.66675 4.66666"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1.32007 8.66666H4.26007C4.5134 8.66666 4.74007 8.80666 4.8534 9.03332L5.6334 10.5933C5.86007 11.0467 6.32007 11.3333 6.82674 11.3333H9.18007C9.68674 11.3333 10.1467 11.0467 10.3734 10.5933L11.1534 9.03332C11.2667 8.80666 11.5001 8.66666 11.7467 8.66666H14.6534"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.66659 2.75333C2.30659 3.09999 1.33325 4.48666 1.33325 7.33333V9.99999C1.33325 13.3333 2.66659 14.6667 5.99992 14.6667H9.99992C13.3333 14.6667 14.6666 13.3333 14.6666 9.99999V7.33333C14.6666 4.48666 13.6933 3.09999 11.3333 2.75333"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default DownloadIcon;
