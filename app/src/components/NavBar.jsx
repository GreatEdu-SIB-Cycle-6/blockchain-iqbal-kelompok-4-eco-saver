import React, { useState } from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { Link } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const NavBar = () => {
  const [nav, setNav] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("");

  const handleNav = () => {
    setNav(!nav);
  };

  const handleNavItemClick = (index) => {
    setActiveNavItem(index);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/campaign", label: "Campaign" },
    { path: "/request-funding", label: "Request Funding" },
    { path: "/rewards", label: "Rewards" },
    { path: "/about", label: "About" },
  ];

  return (
    <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
      <Link to="/">
        <h1 className="w-full text-2xl font-['Poppins'] font-normal text-white mt-1">
          EcoSaver
        </h1>
      </Link>
      <ul className="hidden md:flex ">
        {navItems.map((item, index) => (
          <Link to={item.path} key={index}>
            <li
              onClick={() => handleNavItemClick(index)}
              className={`p-4 font-['Poppins'] text-[#BDBDBD]${
                activeNavItem === index ? "text-white" : ""
              } hover:text-white`}
            >
              {item.label}
            </li>
          </Link>
        ))}
        <li className="ml-2 whitespace-nowrap">
          <ConnectWallet />
        </li>
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
        <ul className="p-4 md:hidden">
          {navItems.map((item, index) => (
            <Link to={item.path} key={index}>
              <li
                onClick={() => handleNavItemClick(index)}
                className={`p-4 font-['Poppins'] text-[#BDBDBD]${
                  activeNavItem === index ? "text-white" : ""
                }`}
              >
                {item.label}
              </li>
            </Link>
          ))}
          <li className="p-4 mr-2 whitespace-nowrap">
            <ConnectWallet />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
