import React from "react";

const CardIcon = ({ color, iconClass }) => {
  return (
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   width="22"
    //   height="22"
    //   viewBox="0 0 22 22"
    //   fill="none"
    //   className={iconClass}
    // >
    //   <path
    //     d="M1.83325 11.5591H17.4166"
    //     stroke={color || "#555555"}
    //     stroke-width="1.5"
    //     stroke-miterlimit="10"
    //     stroke-linecap="round"
    //     stroke-linejoin="round"
    //   />
    //   <path
    //     d="M17.4166 9.42332V15.9775C17.3891 18.59 16.6741 19.25 13.9516 19.25H5.29828C2.52995 19.25 1.83325 18.5625 1.83325 15.8308V9.42332C1.83325 6.94832 2.41075 6.15082 4.58325 6.02248C4.80325 6.01332 5.04161 6.00415 5.29828 6.00415H13.9516C16.7199 6.00415 17.4166 6.69165 17.4166 9.42332Z"
    //     stroke={color || "#555555"}
    //     stroke-width="1.5"
    //     stroke-linecap="round"
    //     stroke-linejoin="round"
    //   />
    //   <path
    //     d="M20.1666 6.16917V12.5767C20.1666 15.0517 19.5891 15.8492 17.4166 15.9775V9.42333C17.4166 6.69167 16.7199 6.00417 13.9516 6.00417H5.29828C5.04161 6.00417 4.80325 6.01333 4.58325 6.0225C4.61075 3.41 5.32578 2.75 8.04828 2.75H16.7016C19.4699 2.75 20.1666 3.4375 20.1666 6.16917Z"
    //     stroke={color || "#555555"}
    //     stroke-width="1.5"
    //     stroke-linecap="round"
    //     stroke-linejoin="round"
    //   />
    //   <path
    //     d="M4.8125 16.3258H6.38914"
    //     stroke={color || "#555555"}
    //     stroke-width="1.5"
    //     stroke-miterlimit="10"
    //     stroke-linecap="round"
    //     stroke-linejoin="round"
    //   />
    //   <path
    //     d="M8.35083 16.3258H11.5042"
    //     stroke={color || "#555555"}
    //     stroke-width="1.5"
    //     stroke-miterlimit="10"
    //     stroke-linecap="round"
    //     stroke-linejoin="round"
    //   />
    // </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={iconClass}
    >
      <path
        d="M2 8.50494H22"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6 16.5049H8"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.5 16.5049H14.5"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.44 3.50494H17.55C21.11 3.50494 22 4.38494 22 7.89494V16.1049C22 19.6149 21.11 20.4949 17.56 20.4949H6.44C2.89 20.5049 2 19.6249 2 16.1149V7.89494C2 4.38494 2.89 3.50494 6.44 3.50494Z"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default CardIcon;
