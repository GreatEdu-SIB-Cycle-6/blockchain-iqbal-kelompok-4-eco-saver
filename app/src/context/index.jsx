import React, { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0xDd868480112DcADb32364d933755eecb71D9262C"
  );

  // Write Request Campaign
  const { mutateAsync: requestCampaign } = useContractWrite(
    contract,
    "requestCampaign"
  );
  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await requestCampaign({
        args: [
          address,
          form.title,
          form.description,
          form.target.toString(),
          new Date(form.deadline).getTime(),
          form.image,
        ],
      });
      console.log("Sukses", data);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const getRequestList = async () => {
    const campaigns = await contract.call("getRequestList");
    const parsedCampaigns = campaigns.map((campaign, index) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: index,
    }));

    return parsedCampaigns;
  };

  const donate = async(pId, amount) => {
    const etherValue = ethers.utils.parseEther(amount)
    const data = await contract.call('donateToCampaign', [pId], {value: etherValue});

    return data;
  }
  

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }
    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        requestCampaign: publishCampaign,
        getRequestList,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
