import React from "react";

import { daysLeft } from "../utils";

const FundingCard = ({
  owner,
  title,
  description,
  target,
  deadline,
  amountCollected,
  image,
  handleClick,
}) => {
  const remainingDays = daysLeft(deadline);
  return (
    <div
      className="md:w-[280px] md:h-[480px] md:mb-2 w-[290px] rounded-[15px] bg-[#14213d] cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={image}
        alt="fund"
        className="md:w-[300px] md:h-[264px] w-[290px] my-auto object-cover rounded-[15px]"
      />
      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[18px]">
          <p className="ml-[2px] font-['Poppins'] font-medium text-[12px] text-[#98f5e1]">
            Keberlanjutan Lingkungan
          </p>
        </div>
        <div className="block">
          <h3 className="font-['Poppins'] font-semibold text-[16px] text-white text-left leading-[25px] truncate">
            {title}
          </h3>
          <p className="mt-[5px] font-['Poppins'] font-normal text-[#808191] text-left leading-[18px] truncate">
            {description}
          </p>
        </div> 
        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-['Poppins'] font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {remainingDays}
            </h4>
            <p
              className="mt-[3px] font-['Poppins'] font-normal text-[12px] leading-[18px] text-[#808191]
            sm:max-w-[120px] truncate"
            >
              Hari tersisa
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-['Poppins'] font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {amountCollected}
            </h4>
            <p
              className="mt-[3px] font-['Poppins'] font-normal text-[12px] leading-[18px] text-[#808191]
            sm:max-w-[120px] truncate"
            >
              Terkumpul dari <b className="text-white">{target}</b>
            </p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg=[#13131a]">
            <img
              src="https://seeklogo.com/images/R/Republic_of_Indonesia_Flag-logo-3E5321CC56-seeklogo.com.png"
              alt="user"
              className="w-1/2 h-1/2 object-contain "
            />
          </div>
          <p className="font-['Poppins'] flex-1 font-normal text-[12px] text-[#808191] truncate">
            <span className="text-white">{owner}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundingCard;
