import React, { useEffect, useState } from "react";

import { useStateContext } from "../context";
import DisplayRewards from "../components/DisplayRewards";

const Rewards = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rewards, setRewards] = useState([]);

  const {
    address,
    contract,
    contractRewards,
    contractEcoSaverNFT,
    getRewardsList,
  } = useStateContext();

  const fetchRewards = async () => {
    setIsLoading(true);
    const data = await getRewardsList();
    console.log("rewadr fetch", data);
    setRewards(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract || contractRewards || contractEcoSaverNFT) fetchRewards();
  }, [address, contractRewards, contractEcoSaverNFT, contract]);

  return (
    <DisplayRewards title="Rewards" isLoading={isLoading} rewards={rewards} />
  );
};

export default Rewards;
