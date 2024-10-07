import React from "react";
import backgroundImageForLaptop from "/laptop_mainpage.jpg";
import backgroundImageForMobile from "/mobile_mainpage.jpg";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center">
      {/* Background for mobile devices */}
      <div
        className="absolute inset-0 bg-cover bg-center md:hidden transition-all duration-500"
        style={{ backgroundImage: `url(${backgroundImageForMobile})` }}
      />

      {/* Background for laptop devices */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${backgroundImageForLaptop})` }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default Layout;
