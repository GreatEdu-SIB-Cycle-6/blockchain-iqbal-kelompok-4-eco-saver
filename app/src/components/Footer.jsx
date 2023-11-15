import React from "react";
import {
  FaDribbbleSquare,
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="max-w-[1240px] mx-auto py-16 px-4 grid lg:grid-cols-3 gap-8 text-gray-300">
      <div>
        <h1 className="w-full text-2xl font-['Poppins'] font-normal text-white mt-1">
          EcoSaver
        </h1>
        <p className="py-4">
          EcoSaver is a solution for decentralized fundraising using a
          blockchain system. This website allows users to donate their crypto
          assets for environmental sustainability.
        </p>
        <div className="flex space-x-3 md:w-[75%] my-6">
          <FaFacebookSquare size={30} />
          <FaInstagram size={30} />
          <FaGithubSquare size={30} />
        </div>
      </div>
      <div className="lg:col-span-2 flex justify-between ">
        <div>
          <h6 className="font-medium text-gray-400">CrowdFunding</h6>
          <ul>
            <li className="py-2 text-sm">About</li>
            <li className="py-2 text-sm">About</li>
            <li className="py-2 text-sm">About</li>
            <li className="py-2 text-sm">About</li>
          </ul>
        </div>
        <div>
          <h6 className="font-medium text-gray-400">Support</h6>
          <ul>
            <li className="py-2 text-sm">Pricing</li>
            <li className="py-2 text-sm">Documentation</li>
            <li className="py-2 text-sm">Guides</li>
            <li className="py-2 text-sm">API Status</li>
          </ul>
        </div>
        <div>
          <h6 className="font-medium text-gray-400">Company</h6>
          <ul>
            <li className="py-2 text-sm">About</li>
            <li className="py-2 text-sm">Blog</li>
            <li className="py-2 text-sm">Jobs</li>
            <li className="py-2 text-sm">Press</li>
            <li className="py-2 text-sm">Careers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
