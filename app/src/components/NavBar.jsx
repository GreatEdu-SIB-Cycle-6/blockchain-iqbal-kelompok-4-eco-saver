import React from "react";
import { ConnectWallet } from "@thirdweb-dev/react";

const NavBar = () => {
  return (
    <div className="flex mt-[52px] ml-[196px] text-white text-2xl font-normal font-['Poppins']">
      <ul className="flex items-center space space-x-40 text-white text-lg font-normal font-['Poppins']">
        <li>Campaign</li>
        <li>Request Funding</li>
        <li>Rewards</li>
        <li>About</li>
        <ConnectWallet />
      </ul>
    </div>
  );
};

export default NavBar;
