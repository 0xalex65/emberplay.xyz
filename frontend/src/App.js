import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "store";
import Layout from "components/Layout";
import "react-toastify/dist/ReactToastify.css";

import Home from "pages/Home";
import Lottery from "pages/Lottery";

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/lottery" element={<Lottery />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
      <ToastContainer />
    </div>
  );
};

export default App;
