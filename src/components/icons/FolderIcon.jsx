import React from "react";

const FolderIcon = ({ color,iconClass }) => {
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
        d="M14.6666 7.33334V11.3333C14.6666 14 13.9999 14.6667 11.3333 14.6667H4.66659C1.99992 14.6667 1.33325 14 1.33325 11.3333V4.66668C1.33325 2.00001 1.99992 1.33334 4.66659 1.33334H5.66659C6.66659 1.33334 6.88659 1.62668 7.26659 2.13334L8.26659 3.46668C8.51992 3.80001 8.66659 4.00001 9.33325 4.00001H11.3333C13.9999 4.00001 14.6666 4.66668 14.6666 7.33334Z"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-miterlimit="10"
      />
      <path
        d="M5.33325 1.33334H11.3333C12.6666 1.33334 13.3333 2.00001 13.3333 3.33334V4.25334"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default FolderIcon;
