import React from "react";

const MessageIcon = ({ color,iconClass }) => {
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
        d="M5.66659 12.6667H5.33325C2.66659 12.6667 1.33325 12 1.33325 8.66668V5.33334C1.33325 2.66668 2.66659 1.33334 5.33325 1.33334H10.6666C13.3333 1.33334 14.6666 2.66668 14.6666 5.33334V8.66668C14.6666 11.3333 13.3333 12.6667 10.6666 12.6667H10.3333C10.1266 12.6667 9.92659 12.7667 9.79992 12.9333L8.79992 14.2667C8.35992 14.8533 7.63992 14.8533 7.19992 14.2667L6.19992 12.9333C6.09325 12.7867 5.84659 12.6667 5.66659 12.6667Z"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.6644 7.33333H10.6704"
        stroke={color || "#555555"}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.99691 7.33333H8.0029"
        stroke={color || "#555555"}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.32967 7.33333H5.33566"
        stroke={color || "#555555"}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default MessageIcon;
