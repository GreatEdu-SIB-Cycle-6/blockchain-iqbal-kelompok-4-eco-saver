import React, { useState } from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const NavBar = () => {
  const navigate = useNavigate();
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };
  return (
    <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
      <h1 className="w-full text-2xl font-['Poppins'] font-normal text-white mt-1">
        EcoSaver
      </h1>
      <ul className="hidden md:flex ">
        <li className="p-4 font-['Poppins']">Campaign</li>
        <li className="p-4 whitespace-nowrap  font-['Poppins']">
          Request Funding
        </li>
        <li className="p-4 font-['Poppins']">Rewards</li>
        <li className="p-4 font-['Poppins']">About</li>
        <li className="ml-2 whitespace-nowrap"><ConnectWallet/></li>
      </ul>
      <div onClick={handleNav} className="block md:hidden">
        {!nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <div
        className={
          !nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r md:hidden border-r-gray-900 bg-[#000b22] ease-in-out duration-500"
            : "ease-in-out duration-500 fixed left-[-100%]"
        }
      >
        <h1 className="w-full text-2xl font-normal font-['Poppins'] text-white m-4">
          EcoSaver
        </h1>
        <ul className="p-4 uppercase md:hidden">
          <li className="p-4 border-b border-gray-600 ">Campaign</li>
          <li className="p-4 whitespace-nowrap border-b border-gray-600 ">
            Request Funding
          </li>
          <li className="p-4 border-b border-gray-600 ">Rewards</li>
          <li className="p-4 border-b border-gray-600">About</li>
          <li className="p-4 mr-2 whitespace-nowrap"><ConnectWallet/></li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;

{
  /* <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6 text-white">
<ul className="flex mt-9 py-5 px-7 space-x-40 text-white text-lg font-normal font-['Poppins']">
  <li>
    <Link to="/campaign">Campaign</Link>
  </li>
  <li>
    <Link to="/request-funding">Request Funding</Link>
  </li>
  <li>
    <Link to="/rewards">Rewards</Link>
  </li>
  <li>
    <Link to="/about">About</Link>
  </li>
</ul>
<ConnectWallet />
</div>
); */
}
