import React, { useState, useEffect } from "react";

import Loader from "./Loader";

import { useStateContext } from "../context";
const RewardsCards = ({
  name,
  description,
  rarity,
  minAmount,
  remainingTime,
  image,
  isNft,
  pId,
}) => {
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    claimRewards,
    getShippingHistoryRewards,
  } = useStateContext();
  const [claimAddress, setClaimAddress] = useState("");

  const handleClaimRewards = async () => {
    try {
      setIsLoading(true);
      await claimRewards(pId, claimAddress);
      const updateRewards = await getShippingHistoryRewards();
      console.log("shipping", updateRewards);
      setRewards(updateRewards);

      setIsLoading(false);
    } catch (err) {
      console.error("error", err);
    }
  };
  const getRarity = (rarity) => {
    switch (rarity) {
      case "0":
        return "Common";
      case "1":
        return "Rare";
      case "2":
        return "Limited";
      default:
        return "unknown";
    }
  };
  const rarityLabel = getRarity(rarity);

  const getIsNft = (isNft) => {
    switch (isNft) {
      case true:
        return "NFT";
      case false:
        return "Barang Fisik";
      default:
        return "unknown";
    }
  };
  const isNFTLabel = getIsNft(isNft);
  // console.log(image.split("//")[1]);

  return (
    <div className="md:w-[280px] md:h-[580px] md:mb-2 w-[290px] rounded-[15px] bg-[#14213d]">
      {isLoading && <Loader />}

      <img
        src={image}
        alt="fund"
        className="md:w-[300px] md:h-[264px] w-[290px] my-auto object-cover rounded-[15px]"
      />
      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[18px]">
          <p className="ml-[2px] font-['Poppins'] font-medium text-[12px] text-[#98f5e1]">
            For Your Rewards
          </p>
        </div>
        <div className="block">
          <h3 className="font-['Poppins'] font-semibold text-[16px] text-white text-left leading-[25px] truncate">
            {name}
          </h3>
          <p className="mt-[5px] font-['Poppins'] font-normal text-[#808191] text-left leading-[18px] truncate">
            {description}
          </p>
        </div>
        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-['Poppins'] font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {rarityLabel}
            </h4>
            <p
              className="mt-[3px] font-['Poppins'] font-normal text-[12px] leading-[18px] text-[#808191]
            sm:max-w-[120px] truncate"
            >
              Rarity
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-['Poppins'] font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {minAmount} BSC
            </h4>
            <p
              className="mt-[3px] font-['Poppins'] font-normal text-[12px] leading-[18px] text-[#808191]
            sm:max-w-[120px] truncate"
            >
              Minimal Donation <b className="text-white">{remainingTime}</b>
            </p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px] ">
          <div>
            <input
              type="text"
              placeholder="Enter Your Address"
              value={claimAddress}
              onChange={(e) => setClaimAddress(e.target.value)}
              className="px-2 py-1 mr-2 border border-gray-400 rounded focus:outline-none mb-3"
            />
            <button
              className="bg-green-500 text-white px-4 py-2 mr-2 rounded mb-4"
              // onClick={handleClaimRewards}
              onClick={() => handleClaimRewards(rewards.pId, rewards.address)}
            >
              Claim Rewards
            </button>
            <p className="font-['Poppins'] flex-1 font-normal text-[12px] text-[#808191] truncate">
              <span className="text-white font-bold">{isNFTLabel}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsCards;
