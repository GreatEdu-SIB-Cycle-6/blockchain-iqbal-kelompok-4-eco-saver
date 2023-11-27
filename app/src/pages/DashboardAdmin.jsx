import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

import UnauthorizedPages from "./UnauthorizedPages";
import { useStateContext } from "../context";

const DashboardAdmin = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  // const navigate = useNavigate();
  const {
    address,
    contract,
    getRequestList,
    approveCampaign,
    getCampaigns,
    rejectCampaign,
    isAdmin,
    contractAdmin,
  } = useStateContext();

  useEffect(() => {
    const fetchCampaigns = async (account) => {
      try {
        const UserisAdmin = await isAdmin(account);
        // console.log("userIsAdmin", UserisAdmin);
        if (UserisAdmin) {
          setIsUserAdmin(true);
          const data = await getRequestList();
          setCampaigns(data);
        } else {
          setIsUserAdmin(false);
        }
        // if (!UserisAdmin) {
        //   navigate("/unauthorized");
        // }
      } catch (error) {
        console.error("Error fetching data campaigns:", error);
      }
    };
    if (contract || contractAdmin) {
      console.log("contract available");
      if (address != undefined) {
        fetchCampaigns(address);
      }
    }
  }, [address, contract, isAdmin, contractAdmin]);

  const handleAccept = async (pId) => {
    try {
      await approveCampaign(pId);
      const updateCampaigns = await getCampaigns();
      setCampaigns(updateCampaigns);
    } catch (err) {
      console.error("error", err);
    }
  };

  const handleReject = async (pId) => {
    try {
      await rejectCampaign(pId);
    } catch (err) {
      console.error("error", err);
    }
  };
  // console.log("isUserAdmin : ", isUserAdmin);
  return (
    <div className="container mx-auto p-4 ">
      {isUserAdmin ? (
        <div>
          <h1 className="text-2xl font-bold mb-4 text-white">
            Admin Dashboard
          </h1>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="text-white">
                <th className="pr-10 border">No.</th>
                <th className="py-2 px-4 border w-1/6">Requester</th>
                <th className="py-2 px-4 border w-1/6">Title</th>
                <th className="py-2 px-4 border w-1/6">Target</th>
                <th className="py-2 px-4 border-b w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white truncate">
              {campaigns.map((campaign, index) => (
                <tr key={campaign.pId}>
                  <td className="pl-6 border">{index + 1}.</td>
                  <td className="py-2 px-4 border">{campaign.requester}</td>
                  <td className="py-2 px-4 border truncate">
                    {campaign.title}
                  </td>
                  <td className="py-2 px-4 border">{campaign.target}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
                      onClick={() => handleAccept(campaign.pId)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 mr-2 rounded"
                      onClick={() => handleReject(campaign.pId)}
                    >
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
      ) : (
        <UnauthorizedPages />
      )}
    </div>
  );
};

export default DashboardAdmin;
