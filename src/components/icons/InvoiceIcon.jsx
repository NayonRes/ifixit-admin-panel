import React from "react";

const InvoiceIcon = ({ color, iconClass }) => {
  return (
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   width="26"
    //   height="26"
    //   viewBox="0 0 26 26"
    //   fill="none"
    //   className={iconClass}
    // >
    //   <path
    //     d="M12.9999 20.0416C16.8889 20.0416 20.0416 16.889 20.0416 13C20.0416 9.11097 16.8889 5.95831 12.9999 5.95831C9.11091 5.95831 5.95825 9.11097 5.95825 13C5.95825 16.889 9.11091 20.0416 12.9999 20.0416Z"
    //    stroke={color || "#555555"}
    //     stroke-width="1.5"
    //     stroke-linecap="round"
    //     stroke-linejoin="round"
    //   />
    //   <path
    //     d="M20.7351 20.735L20.5942 20.5942M20.5942 5.40585L20.7351 5.26502L20.5942 5.40585ZM5.26508 20.735L5.40591 20.5942L5.26508 20.735ZM13.0001 2.25335V2.16669V2.25335ZM13.0001 23.8334V23.7467V23.8334ZM2.25341 13H2.16675H2.25341ZM23.8334 13H23.7467H23.8334ZM5.40591 5.40585L5.26508 5.26502L5.40591 5.40585Z"
    //    stroke={color || "#555555"}
    //     stroke-width="2"
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
        d="M6.73 19.7C7.55 18.82 8.8 18.89 9.52 19.85L10.53 21.2C11.34 22.27 12.65 22.27 13.46 21.2L14.47 19.85C15.19 18.89 16.44 18.82 17.26 19.7C19.04 21.6 20.49 20.97 20.49 18.31V7.04C20.5 3.01 19.56 2 15.78 2H8.22C4.44 2 3.5 3.01 3.5 7.04V18.3C3.5 20.97 4.96 21.59 6.73 19.7Z"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 7H16"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9 11H15"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default InvoiceIcon;
