import React from "react";

const BillIcon = ({ color,iconClass }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      className={iconClass}
    >
      <path
        d="M3.36426 2.29169V13.2642C3.36426 14.1625 3.78592 15.015 4.51009 15.5559L9.28592 19.1309C10.3034 19.8917 11.7059 19.8917 12.7234 19.1309L17.4992 15.5559C18.2234 15.015 18.6451 14.1625 18.6451 13.2642V2.29169H3.36426Z"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-miterlimit="10"
      />
      <path
        d="M1.83325 2.29169H20.1666"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
      <path
        d="M7.33325 7.33331H14.6666"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.33325 11.9167H14.6666"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default BillIcon;
