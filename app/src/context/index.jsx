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
    "0xd98ccb2097efA33aE4341b1Bf432f3dA61f39e19"
  );

  const { contractAdmin } = useContract(
    "0x8Da107637428A1D4E5FACD84cB93225EFEc78108"
  );

  console.log(contractAdmin);

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
          form.name,
          form.title,
          form.description,
          form.target.toString(),
          new Date(form.deadline).getTime(),
          form.image,
        ],
      });
      console.log("Sukses", data);
      return data;
    } catch (error) {
      console.log("Error", error);
    }
  };

  const getRequestList = async () => {
    const campaigns = await contract.call("getRequestList");
    const parsedCampaigns = campaigns.map((campaign, index) => ({
      owner: campaign.owner,
      title: campaign.title,
      name: campaign.name,
      requester: campaign.requester,
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

  const donate = async (pId, amount) => {
    const etherValue = ethers.utils.parseEther(amount);
    const data = await contract.call("donateToCampaign", [pId], {
      value: etherValue,
    });

    return data;
  };

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

  // const isAdmin = async () => {
  //   try {
  //     const owner = await contractAdmin.call("owner");
  //     return owner === address;
  //   } catch (error) {
  //     console.error("Error checking admin status:", error);
  //     return false;
  //   }
  // };

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
        // isAdmin,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
