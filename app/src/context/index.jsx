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
    "0x36f9fAC2268f7Debe5D6D22dB00936545CBa23b6"
  );

  const contractAdmin = useContract(
    "0xE4715aBADB71EeB176aAcd03501961fb26b98Dfd"
  ).contract;

  const contractRewards = useContract(
    "0x29DF0c1BB7710Ef0fBCab73315ee8FdDa73250B4"
  ).contract;

  const contractEcoSaverNFT = useContract(
    "0xD246E22cdE2621C3c10FB12E13a647B30B735De1"
  ).contract;

  // console.log("contract reward", contractRewards);
  // console.log("contract nft", contractEcoSaverNFT);

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

  const getShippingHistoryRewards = async () => {
    const rewardsHistory = await contractRewards.call("getShippingHistory");
    const parsedRewards = rewardsHistory.map((historyRewards, index) => ({
      name: historyRewards.name,
      description: historyRewards.description,
      rarity: historyRewards.rarity,
      minAmount: historyRewards.minAmount,
      remaintingItem: historyRewards.remaintingItem,
      image: historyRewards.image,
      isNft: historyRewards.isNft,
      pId: index,
    }));
    return parsedRewards;
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

  const getRewardsList = async () => {
    const rewards = await contractRewards.call("getRewardList");
    const unclaimedRewards = rewards.filter((reward) => reward.remainingItem > 0);
    const parsedRewards = unclaimedRewards.map((reward, index) => ({
      name: reward.name,
      description: reward.description,
      rarity: reward.rarity.toString(),
      minAmount: ethers.utils.formatEther(reward.minAmount.toString()),
      remainingItem: reward.remainingItem.toNumber(),
      image: reward.image,
      isNft: reward.isNft,
      pId: index,
    }));
    return parsedRewards;
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

  const getDonatorAmount = async (donatorData) => {
    try {
      const donatorAmount = await contractRewards.call("getDonatorData", [donatorData]);
      const amountEtherValue = ethers.utils.formatEther(donatorAmount.toString())
      return amountEtherValue;
    } catch (err) {
      console.log("Error getdonator", err);
    }
  };

  const isAdmin = async (account) => {
    try {
      // console.log("address :", account);
      // console.log("contract admin", contractAdmin);
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

  const { mutateAsync: claimReward } = useContractWrite(
    contractRewards,
    "claimReward"
  );

  const claimRewards = async (pId, address) => {
    try {
      console.log(
        "Calling claimRewards with pId:",
        pId,
        "and address:",
        address
      );
      const data = await claimReward({ args: [pId, address] });
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
        args: [pId],
      });
      console.log("Contract call Success", data);
    } catch (err) {
      console.error("Contract call failure", err);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");
    const activeCampaigns = campaigns.filter(
      (campaign) => campaign.isReleased === false
    );
    // console.log("aktif", activeCampaigns);
    const parsedCampaigns = activeCampaigns.map((campaign, index) => ({
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
      isReleasedCampaign: campaign.isReleased || false,
    }));
    console.log("parsedcampaign", parsedCampaigns);
    return parsedCampaigns;
  };

  const { mutateAsync: addItem } = useContractWrite(contractRewards, "addItem");

  const addRewards = async (rewards) => {
    try {
      const data = await addItem({
        args: [
          rewards.name,
          rewards.description,
          rewards.rarity.toString(),
          rewards.minAmount.toString(),
          rewards.remaintingItem.toString(),
          rewards.image,
          rewards.isNft,
        ],
      });
      console.log("data reward", data);
      return data;
    } catch (err) {
      console.log("error fetching data", err);
    }
  };

  const { mutateAsync: addMetadata } = useContractWrite(
    contractEcoSaverNFT,
    "addMetadata"
  );

  const addMetaDataEcoSaverNFT = async (metadataNFT) => {
    try {
      const data = await addMetadata({
        args: [metadataNFT.imgUri, metadataNFT.tokenUri],
      });
      return data;
    } catch (err) {
      console.log("error fetch data nft", err);
    }
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
        addItem: addRewards,
        addMetadata: addMetaDataEcoSaverNFT,
        getRewardsList,
        claimRewards,
        getShippingHistoryRewards,
        // getRewardById,
        getDonatorAmount,
        // getContractRead
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
