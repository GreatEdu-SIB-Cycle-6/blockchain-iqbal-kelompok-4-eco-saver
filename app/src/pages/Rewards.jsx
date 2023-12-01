import React, { useEffect, useState } from "react";

import { useStateContext } from "../context";
import DisplayRewards from "../components/DisplayRewards";

const Rewards = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rewards, setRewards] = useState([]);
  // const [donatorAmount, setdonatorAmount] = useState(0)

  const {
    address,
    contract,
    contractRewards,
    contractEcoSaverNFT,
    getRewardsList,
    // getDonatorAmount
  } = useStateContext();

  // const fetchDonator = async () => {
  //   const data = await getDonatorAmount();
  //   setdonatorAmount(data);
  // }

  // useEffect(() => {
  //   if(contract || contractRewards || contractEcoSaverNFT ) fetchDonator();
  // }, [address,contractRewards, contractEcoSaverNFT, contract])

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
      {/* <h1 className="text-white">Your amount : {donatorAmount} </h1> */}
      <DisplayRewards title="Rewards" isLoading={isLoading} rewards={rewards} />
    </div>
  );
};

export default Rewards;
