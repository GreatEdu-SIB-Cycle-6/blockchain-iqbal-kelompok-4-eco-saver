import React from "react";
import { useNavigate } from "react-router-dom";

import { loader } from "../assets";
import { v4 as uuidv4 } from "uuid";
import FundingCard from "./FundingCard";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  return (
    <div className="w-full mt-[50px] ml-12 flex flex-col gap-[30px] md:ml-[120px] ">
      <h1 className="font-['Poppins'] text-white font-semibold text-[18px] text-left">
        {title} ({campaigns.length})
      </h1>
      <div className="flex flex-wrap mt-1 gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}
        {!isLoading && campaigns.length === 0 && (
          <p className="font-['Poppins'] font-semibold text-[15px] leading-[30px] text-white">
            Belum ada acara yang dibuat.
          </p>
        )}
        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <FundingCard
              key={uuidv4()}
              {...campaign}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
