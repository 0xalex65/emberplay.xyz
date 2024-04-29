import React from "react";

import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-theme">
      <Header />
      <div className="min-h-[calc(100vh-160px)]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
