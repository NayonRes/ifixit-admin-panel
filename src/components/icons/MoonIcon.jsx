import React from "react";

const MoonIcon = ({ color,iconClass }) => {
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
        d="M1.35331 8.28C1.59331 11.7133 4.50664 14.5067 7.99331 14.66C10.4533 14.7667 12.6533 13.62 13.9733 11.8133C14.52 11.0733 14.2266 10.58 13.3133 10.7467C12.8666 10.8267 12.4066 10.86 11.9266 10.84C8.66664 10.7067 5.99998 7.98 5.98664 4.76C5.97998 3.89334 6.15998 3.07334 6.48664 2.32667C6.84664 1.5 6.41331 1.10667 5.57998 1.46C2.93998 2.57334 1.13331 5.23334 1.35331 8.28Z"
        stroke={color || "#555555"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default MoonIcon;
