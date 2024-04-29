import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "components/Layout";
import Home from "pages/Home";
import Lottery from "pages/Lottery";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/lottery" element={<Lottery />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
