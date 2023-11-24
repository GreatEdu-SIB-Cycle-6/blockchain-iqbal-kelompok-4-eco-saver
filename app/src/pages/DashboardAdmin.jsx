import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { useStateContext } from "../context";
const DashboardAdmin = () => {
  const [campaigns, setCampaigns] = useState([]);
  const { address, contract, getRequestList } = useStateContext();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getRequestList();
        setCampaigns(data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    if (contract) {
      fetchCampaigns();
    }
  }, [address, contract]);

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4 text-white">Admin Dashboard</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="text-white">
            <th className="py-2 px-4 border-b w-1/6">No.</th>
            <th className="py-2 px-4 border-b w-1/6">Requester</th>
            <th className="py-2 px-4 border-b w-1/6">Title</th>
            <th className="py-2 px-4 border-b w-1/6">Target</th>
            <th className="py-2 px-4 border-b w-1/6">Actions</th>
          </tr>
        </thead>
        <tbody className="text-white truncate">
          {campaigns.map((campaign, index) => (
            <tr key={campaign.pId}>
              <td className="py-2 px-4 border-b truncate">{index + 1}</td>
              <td className="py-2 px-4 border-b">{campaign.requester}</td>
              <td className="py-2 px-4 border-b truncate">{campaign.title}</td>
              <td className="py-2 px-4 border-b">{campaign.target}</td>
              <td className="py-2 px-4 border-b">
                <button className="bg-green-500 text-white px-4 py-2 mr-2 rounded">
                  Accept
                </button>
                <button className="bg-red-500 text-white px-4 py-2 mr-2 rounded">
                  Reject
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardAdmin;
