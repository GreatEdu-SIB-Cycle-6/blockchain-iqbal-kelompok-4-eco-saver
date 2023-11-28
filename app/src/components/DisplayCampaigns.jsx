import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loader } from "../assets";
import { v4 as uuidv4 } from "uuid";
import FundingCard from "./FundingCard";
import SearchButton from "./SearchButton";
import SkeletonLoading from "./SkeletonLoading";

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign });
  };

  const filteredCampaign = campaigns.filter((campaign) =>
    campaign.title.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const campaignToDisplay = searchTerm ? filteredCampaign : campaigns;

  return (
    <div className="w-full md:mt-4 mt-5 ml-12 flex flex-col gap-[30px] md:ml-[120px] ">
      <h1 className="font-['Poppins'] text-white font-semibold text-[18px] text-left">
        {title} ({campaigns.length})
      </h1>
      <div>
        <SearchButton
          type="text"
          placeholder="Search Campaign..."
          className="p-2 border border-gray-300 rounded-[10px]"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap mt-1 gap-[30px]">
        {isLoading && (
          Array.from({length : 4}).map((_, index) => (
            <SkeletonLoading key={index}/>
          ))
        )}
        {isLoading && campaignToDisplay.length < 0 && (
          <p className="font-['Poppins'] font-medium text-[15px] leading-[30px] text-white">
             Tidak ada acara yang sesuai dengan penelusuran.
          </p>
        )}
        {!isLoading && campaignToDisplay.length === 0 && (
          <p className="font-['Poppins'] font-medium text-[15px] leading-[30px] text-white">
             Belum ada acara yang dibuat.
          </p>
        )}
        {!isLoading &&
          campaignToDisplay.length > 0 &&
          campaignToDisplay.map((campaign) => (
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
