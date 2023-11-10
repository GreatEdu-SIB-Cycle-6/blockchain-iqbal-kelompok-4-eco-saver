import React from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <div className=" w-full h-[1117px] relative bg-slate-950 flex flex-row">
      <div className="flex mt-[65px] ml-[196px] text-white text-2xl font-normal font-['Poppins'] ">
        EcoSaver
      </div>
      <div>
        <NavBar />
        <div className="mt-[100px]">
          <div className="text-emerald-400 text-[80px] font-normal font-['Poppins'] tracking-wider">
            Join The Green Revolution
          </div>
          <div className=" items-center justify-center text-white text-[64px] font-normal font-['Poppins'] tracking-wider">
            Blockchain Crowdfunding
          </div>
          <div className="w-[600px] text-white text-[32px] font-light font-['Poppins']">
            Donate your Crypto for a Sustainable Environment.
          </div>
          <div className="w-[229px] mt-10 h-[70px] px-8 py-[22px] bg-gradient-to-b from-blue-500 to-blue-950 rounded-lg justify-center items-center gap-2.5 inline-flex">
            <div className="text-center text-white text-xl font-medium font-['Space Grotesk']">
              Request Funding
            </div>
          </div>
          <div className="w-[161px] ml-10 h-[70px] px-8 py-[22px] bg-gradient-to-b from-slate-300 to-slate-500 rounded-lg justify-center items-center gap-2.5 inline-flex">
            <div className="text-center text-black text-xl font-medium font-['Space Grotesk']">
              Campaign
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
{
  /* <Routes>
            <Route path='/' element = {<Home/>}/>
            <Route path='/campaign' element = {<Campaign/>}/>
            <Route path='/campaign-details/:id' element = {<CampaignDetails/>}/>
            <Route path='/request-funding' element = {<RequestFunding/>}/>
            <Route path='/approve-funding' element = {<ApproveFunding/>}/>
            <Route path='/rewards' element = {<Rewards/>}/>
            <Route path='/about' element = {<About/>}/>
        </Routes> */
}
