import React from "react";
import {
  FaDribbbleSquare,
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="max-w-[1240px] mx-auto py-16 px-4 grid gap-8 text-gray-300">
      <div>
        <h1 className="w-full text-2xl font-['Poppins'] font-normal text-white mt-1">
          EcoSaver
        </h1>
        <p className="py-3">
          EcoSaver is a solution for decentralized fundraising using a
          blockchain system. This website allows users to donate their crypto
          assets for environmental sustainability.
        </p>
      </div>
      <div>
        <div>
          <h6 className="font-medium text-gray-400">CrowdFunding</h6>
          <ul>
            <Link to="/about">
              <li className="py-2 text-sm">About</li>
            </Link>
            <Link to="https://github.com/GreatEdu-SIB-Cycle-6/blockchain-iqbal-kelompok-4-eco-saver.git">
              <li className="py-2 text-sm">Github</li>
            </Link>
            <div className="mb-2">Copyright &copy;2023 Team 4 Blockchain EcoSaver </div>
            <Link to="https://github.com/GreatEdu-SIB-Cycle-6/blockchain-iqbal-kelompok-4-eco-saver.git">
              <FaGithubSquare size={30} />
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
