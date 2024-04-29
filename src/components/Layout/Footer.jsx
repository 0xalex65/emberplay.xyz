import React from "react";
import Logo from "assets/images/logo.gif";

const Footer = () => {
  return (
    <div className="h-20 border-t border-t-white/20 px-5">
      <div className="w-full max-w-7xl h-full flex items-center justify-center mx-auto">
        <img src={Logo} className="h-12" />
      </div>
    </div>
  );
};

export default Footer;
