import React from "react";

import { v4 as uuidv4 } from "uuid";

import SkeletonLoading from "./SkeletonLoading";
import RewardsCards from "./RewardsCards";

const DisplayRewards = ({ title, isLoading, rewards }) => {
  return (
    <div className="w-full md:mt-4 mt-5 ml-12 flex flex-col gap-[30px] md:ml-[120px]">
      <h1 className="font-['Poppins'] text-white font-semibold text-[18px] text-left">
        {title}
      </h1>
      <div className="flex flex-wrap mt-1 gap-[30px]">
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonLoading key={index} />
          ))}
        {!isLoading &&
          rewards.length > 0 &&
          rewards.map((reward) => <RewardsCards key={uuidv4()} {...reward} />)}
      </div>
    </div>
  );
};

export default DisplayRewards;
