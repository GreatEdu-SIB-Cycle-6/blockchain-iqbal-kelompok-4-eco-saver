import React, {useState, useEffect} from "react";
import { FormAddRewards } from "../components";
import { useStateContext } from "../context";

import UnauthorizedPages from "./UnauthorizedPages";

const AddRewards = () => {
  const { address, contract, isAdmin, contractAdmin} = useStateContext();
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async (account) => {
      try {
        const UserisAdmin = await isAdmin(account);
        console.log("userIsAdmin", UserisAdmin);
        if (UserisAdmin) {
          setIsUserAdmin(true);
        } else {
          setIsUserAdmin(false);
        }
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
  return (
    <div>
      {isUserAdmin ? (
        <div>
          <FormAddRewards />
        </div>
      ) : (
        <UnauthorizedPages />
      )}
    </div>
  );
};

export default AddRewards;
