import React from "react";
import { BrowserRouter , Route, Routes } from "react-router-dom";

import { Navbar, Hero, Footer } from "./components";
import {
  Home,
  Campaign,
  RequestFunding,
  ApproveFunding,
  Rewards,
  About,
} from "./pages";
import ParticleBackground from "./components/ParticleBackground";

const App = () => {
  return (
    <div>
      <Navbar />
      <ParticleBackground />
      <Hero />
      <Footer />  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campaign" element={<Campaign />} />
        {/* <Route path="/campaign-details/:id" element={<CampaignDetails />} /> */}
        <Route path="/request-funding" element={<RequestFunding />} />
        <Route path="/approve-funding" element={<ApproveFunding />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
};
export default App;
