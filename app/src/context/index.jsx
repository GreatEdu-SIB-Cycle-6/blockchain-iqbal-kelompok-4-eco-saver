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
    "0xf988E3c1F02362D80bbB9f979AF2708baDdc7EA5"
  );

  const contractAdmin = useContract(
    "0x8Da107637428A1D4E5FACD84cB93225EFEc78108"
  ).contract;

  // console.log(contractAdmin);

  // Write Request Campaign
  const { mutateAsync: requestCampaign } = useContractWrite(
    contract,
    "requestCampaign"
  );
  const address = useAddress();
  // console.log(address)
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
  // const { data } = useContractRead(contract, "isAdminExist", [account])
  const isAdmin = async (account) => {
    try {
      console.log("address :", account);
      console.log("contract admin", contractAdmin);
      const result = await contractAdmin.call("isAdminExist", [account]);
      return result;
    } catch (error) {
      console.error("Error checking admin existence:", error);
      return false;
    }
  };

  const { mutateAsync: approveRequest } = useContractWrite(
    contract,
    "approveRequest"
  );

  const approveCampaign = async (pId) => {
    try {
      const data = await approveRequest({ args: [pId] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  const { mutateAsync: rejectRequest } = useContractWrite(
    contract,
    "rejectRequest"
  );
  const rejectCampaign = async (pId) => {
    try {
      const data = await rejectRequest({ args: [pId] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  const { mutateAsync: releaseFunds } = useContractWrite(
    contract,
    "releaseFunds"
  );
  const releaseFundCampaign = async (pId) => {
    try {
      const data = await releaseFunds({
        args: [pId]
      });
      console.log("Contract call Success", data);
    } catch (err) {
      console.error("Contract call failure", err);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");
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
        isAdmin,
        approveCampaign,
        getCampaigns,
        rejectCampaign,
        releaseFundCampaign,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
