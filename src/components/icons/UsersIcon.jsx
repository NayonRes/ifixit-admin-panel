import React from "react";

const UsersIcon = ({ color, iconClass }) => {
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
        d="M8.3966 9.96415C8.30493 9.95498 8.19493 9.95498 8.0941 9.96415C5.91243 9.89081 4.17993 8.10331 4.17993 5.90331C4.17993 3.65748 5.99493 1.83331 8.24993 1.83331C10.4958 1.83331 12.3199 3.65748 12.3199 5.90331C12.3108 8.10331 10.5783 9.89081 8.3966 9.96415Z"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.0425 3.66669C16.8208 3.66669 18.2508 5.10585 18.2508 6.87502C18.2508 8.60752 16.8758 10.0192 15.1617 10.0834C15.0883 10.0742 15.0058 10.0742 14.9233 10.0834"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3.81341 13.3467C1.59507 14.8317 1.59507 17.2517 3.81341 18.7275C6.33424 20.4142 10.4684 20.4142 12.9892 18.7275C15.2076 17.2425 15.2076 14.8225 12.9892 13.3467C10.4776 11.6692 6.34341 11.6692 3.81341 13.3467Z"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.8118 18.3333C17.4718 18.1958 18.0951 17.93 18.6084 17.5358C20.0384 16.4633 20.0384 14.6941 18.6084 13.6216C18.1043 13.2366 17.4901 12.98 16.8393 12.8333"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default UsersIcon;
