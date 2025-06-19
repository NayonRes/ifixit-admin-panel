import React from "react";

const MoneyIcon = ({ color,iconClass }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      className={iconClass}
    >
      <path
        d="M16.95 8C16.5428 6.84458 15.4739 6.05285 14.25 6H10.25C8.59315 6 7.25 7.34315 7.25 9C7.25 10.6569 8.59315 12 10.25 12H14.25C15.9069 12 17.25 13.3431 17.25 15C17.25 16.6569 15.9069 18 14.25 18H10.25C9.02606 17.9472 7.95722 17.1554 7.55 16"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13 3C13 2.58579 12.6642 2.25 12.25 2.25C11.8358 2.25 11.5 2.58579 11.5 3H13ZM11.5 6C11.5 6.41421 11.8358 6.75 12.25 6.75C12.6642 6.75 13 6.41421 13 6H11.5ZM13 18C13 17.5858 12.6642 17.25 12.25 17.25C11.8358 17.25 11.5 17.5858 11.5 18H13ZM11.5 21C11.5 21.4142 11.8358 21.75 12.25 21.75C12.6642 21.75 13 21.4142 13 21H11.5ZM11.5 3V6H13V3H11.5ZM11.5 18V21H13V18H11.5Z"
        fill={color || "#555555"}
      />
    </svg>
  );
};

export default MoneyIcon;
