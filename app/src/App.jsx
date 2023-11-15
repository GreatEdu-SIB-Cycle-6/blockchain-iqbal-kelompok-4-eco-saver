import React from "react";
import { Route, Routes } from "react-router-dom";

import { Navbar, Footer } from "./components";
import {
  Home,
  Campaign,
  RequestFunding,
  ApproveFunding,
  Rewards,
  About,
} from "./pages";

const App = () => {
  return (
    <div>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campaign" element={<Campaign />} />
        {/* <Route path="/campaign-details/:id" element={<CampaignDetails />} /> */}
        <Route path="/request-funding" element={<RequestFunding />} />
        <Route path="/approve-funding" element={<ApproveFunding />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  );
};
export default App;
