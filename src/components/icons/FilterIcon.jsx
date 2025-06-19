import React from "react";

const FilterIcon = ({ color,iconClass }) => {
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
        d="M3.59993 1.39999H12.3999C13.1333 1.39999 13.7333 1.99999 13.7333 2.73333V4.19999C13.7333 4.73333 13.3999 5.39999 13.0666 5.73333L10.1999 8.26666C9.79993 8.59999 9.53327 9.26666 9.53327 9.79999V12.6667C9.53327 13.0667 9.2666 13.6 8.93327 13.8L7.99994 14.4C7.13327 14.9333 5.93327 14.3333 5.93327 13.2667V9.73333C5.93327 9.26666 5.6666 8.66666 5.39994 8.33333L2.8666 5.66666C2.53327 5.33333 2.2666 4.73333 2.2666 4.33333V2.79999C2.2666 1.99999 2.8666 1.39999 3.59993 1.39999Z"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.28667 1.39999L4 6.66666"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default FilterIcon;
