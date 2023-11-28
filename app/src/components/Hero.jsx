import React, { useState } from "react";
import Typed from "react-typed";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("");

  const handleActiveRequestFundingButton = () => {
    setActiveButton(true);
    navigate("/request-funding");
  };

  const handleActiveCampaignButton = () => {
    setActiveButton(true);
    navigate("/campaign");
  };

  return (
    <div className="text-white">
      <div className="max-w-[1200px] mt-[-100px] w-full h-screen mx-auto text-center flex flex-col justify-center">
        <p className="md:text-[65px] md:whitespace-nowrap font-semibold p-2 font-['Poppins'] tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
          Join The Green Revolution
        </p>
        <h1 className="md:text-5xl sm:text-6xl font-medium md:py-6 font-['Poppins'] tracking-wide">
          Blockchain Crowdfunding
        </h1>
        <div>
          <p className="md:text-[30px] sm:text-2xl text-xl font-light font-['Poppins'] tracking-wide text-center max-w-[700px] mx-auto">
            Donate your{" "}
            <Typed
              className="font-bold text-blue-200"
              strings={["BSC Coin"]}
              typeSpeed={100}
              backSpeed={140}
              loop
            />{" "}
            for a Sustainable Environment.
          </p>
          <button
            className={`border-[2px] border-[#3943b7] bg-transparent text-center text-white sm:text-xl sm:p-4 p-1 whitespace-nowrap font-medium text-sm font-['Poppins'] md:text-[15px] md:w-[150px] md:h-[50px] sm:w-[90px] mx-auto py-3 my-6 rounded-lg justify-center items-center inline-flex
        ${
          activeButton ? "border-[2px] border-[#3943b7] bg-transparent " : "hover:bg-[#3943b7]"
          }`}
            onClick={handleActiveRequestFundingButton}
          >
            Request Funding
          </button>

          <button
            className={`border-[2px] border-[#52b788] ml-4 text-center text-white sm:text-xl sm:p-4 p-1 font-medium text-sm font-['Poppins'] md:text-[15px] md:w-[150px] md:h-[50px] sm:w-[90px] mx-auto py-3 my-6 rounded-lg justify-center items-center inline-flex
        ${
          activeButton ? "bg-transparent border-[2px] border-[#52b788]" : "hover:bg-[#52b788] "
          }`}
            onClick={handleActiveCampaignButton}
          >
            Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
