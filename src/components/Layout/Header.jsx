import React from "react";
import { Link } from "react-router-dom";
import Button from "components/Common/Button";
import Logo from "assets/images/logo.gif";

const Header = () => {
  return (
    <div className="w-full h-20 border-b border-b-white/20 px-5">
      <div className="w-full max-w-7xl h-20 mx-auto flex items-center justify-between">
        <Link to="/">
          <img src={Logo} className="h-14 rounded" />
        </Link>
        <Button>Connect</Button>
      </div>
    </div>
  );
};

export default Header;
