import Button from "components/Common/Button";
import React from "react";

const Header = () => {
  return (
    <div className="w-full h-20 border-b border-b-white/20">
      <div className="w-full max-w-7xl h-20 mx-auto flex items-center justify-between">
        <img src="/logo.jpg" className="w-12 rounded" />
        <Button>Connect</Button>
      </div>
    </div>
  );
};

export default Header;
