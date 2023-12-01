import React, { useEffect, useState } from "react";

import { useStateContext } from "../context";
import DisplayRewards from "../components/DisplayRewards";

const Rewards = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [donatorAmount, setdonatorAmount] = useState(0);

  const {
    address,
    contract,
    contractRewards,
    contractEcoSaverNFT,
    getRewardsList,
    getDonatorAmount,
  } = useStateContext();

  useEffect(() => {
    const fetchDonator = async (donatorData) => {
      try {
        const amountDonate = await getDonatorAmount(donatorData);
        setdonatorAmount(amountDonate);
      } catch (err){
        console.log("Error data fetch donator", err)
      }
    }
    if(contract || contractRewards) {
      console.log("Contract ini ada!")
      fetchDonator(address);
    }
  }, [contract, contractRewards])

  const fetchRewards = async () => {
    setIsLoading(true);
    const data = await getRewardsList();
    setRewards(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract || contractRewards || contractEcoSaverNFT) fetchRewards();
  }, [address, contractRewards, contractEcoSaverNFT, contract]);

  return (
    <div>
      <h1 className="text-white md:ml-[120px] ml-11">Total Donate : <strong>{donatorAmount}</strong> BSC</h1>
      <DisplayRewards title="Rewards" isLoading={isLoading} rewards={rewards} />
    </div>
  );
};

export default Rewards;
