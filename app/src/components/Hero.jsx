import React from "react";
import Typed from "react-typed";

const Hero = () => {
  return (
    <div className="text-white">
      <div className="max-w-[1200px] mt-[-150px] w-full h-screen mx-auto text-center flex flex-col justify-center">
        <p className="md:text-[80px] md:whitespace-nowrap sm:text-8xl text-white font-normal p-2 font-['Poppins'] tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
          Join The Green Revolution
        </p>
        <h1 className="md:text-6xl sm:text-6xl font-normal md:py-6 font-['Poppins'] tracking-wide">
          Blockchain Crowdfunding
        </h1>
        <div>
          <p className="md:text-[30px] sm:text-2xl text-xl font-light font-['Poppins'] tracking-wide text-center max-w-[700px] mx-auto">
            Donate your{" "}
            <Typed
              className="font-bold text-blue-200"
              strings={["BSC", "ETH", "BTC"]}
              typeSpeed={100}
              backSpeed={140}
              loop
            />{" "}
            for a Sustainable Environment.
          </p>
          <button className="text-center text-white sm:text-xl sm:p-4 p-1 whitespace-nowrap font-medium text-sm font-['Poppins'] md:w-[200px] sm:w-[90px] mx-auto py-3 my-6 bg-gradient-to-b from-blue-500 to-blue-950 rounded-lg justify-center items-center  inline-flex">
            Request Funding
          </button>
          <button className=" ml-4 text-center text-white sm:text-xl sm:p-4 p-1 font-medium text-sm font-['Poppins'] md:w-[200px] sm:w-[90px] mx-auto py-3 my-6 bg-gradient-to-r from-green-400 to-green-600 rounded-lg justify-center items-center  inline-flex">
            Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
