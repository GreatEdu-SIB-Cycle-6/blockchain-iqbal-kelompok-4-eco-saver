import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useStateContext } from "../context";
import { CustomButton, CountBox, Loader, ReleaseButton } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CampaignDetails = () => {
  const { state } = useLocation();
  const {
    donate,
    getDonations,
    contract,
    address,
    getCampaigns,
    releaseFundCampaign,
    isAdmin,
    contractAdmin,
  } = useStateContext();
  const [donators, setDonators] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [ownerCampaignCount, setOwnerCampaignCount] = useState(0);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  const navigate = useNavigate();

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonators(data);
  };

  const handleRelease = async () => {
    setIsLoading(true);

    await releaseFundCampaign(state.pId, amount);
    setIsLoading(false);
    toast.success("Release Fund Success")
  };

  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address]);

  const handleDonate = async () => {
    setIsLoading(true);

    await donate(state.pId, amount);
    // navigate("/");

    setIsLoading(false);
    toast.success("Success Donate Campaign")
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campaigns = await getCampaigns();
        const ownerCampaigns = campaigns.filter(
          (campaign) =>
            campaign.owner.trim().toLowerCase() ===
            state.owner.trim().toLowerCase()
        );
        setOwnerCampaignCount(ownerCampaigns.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [getCampaigns, state.owner]);

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
      {isLoading && <Loader />}
      <ToastContainer/>
      <div className="md:w-[1200px] w-42 ml-1 md:ml-[110px] flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col ">
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-xl"
          />
          <div className="relative w-full h-[5px] bg=[#3a3a43] mt-2">
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{
                width: `${calculateBarPercentage(
                  state.target,
                  state.amountCollected
                )}%`,
                maxWidth: "100%",
              }}
            ></div>
          </div>
        </div>
        <div className="flex md:w-[150px] md:px-1 px-4 w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Hari Tersisa" value={remainingDays} />
          <CountBox
            title={`Terkumpul dari target ${state.target} BSC`}
            value={state.amountCollected}
          />
          <CountBox title="Total Pendukung" value={donators.length} />
        </div>
      </div>

      <div className="md:w-[1200px] md:px-1 px-4 w-42 ml-1 md:ml-[110px] mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4
              className="font-['Poppins'] font-bold text-[18px] text-white
        uppercase"
            >
              Pembuat Donasi
            </h4>
            <div className="md:mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div
                className="w-[52px] h-[52px] flex items-center justify-center rounded-full 
              bg-[#2c2cf32] cursor-pointer"
              >
                <img
                  src="https://seeklogo.com/images/R/Republic_of_Indonesia_Flag-logo-3E5321CC56-seeklogo.com.png"
                  alt="user"
                  className="w-[60%] h-[60%] object-contain "
                />
              </div>
              <div>
                <h4 className="font-['Poppins'] font-semibold text-[14px] text-white break-all">
                  {state.owner}
                </h4>
                <p className="mt-[4px] font-['Poppins'] font-normal text-[12px] text-[#808191]">
                  {`Adress ini sudah membuat Acara Donasi sebanyak `}
                  <strong className="text-white">
                    {ownerCampaignCount}
                  </strong>{" "}
                  kali!
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4
              className="font-['Poppins'] font-bold text-[16px] text-white
        uppercase"
            >
              Judul Acara
            </h4>
            <div className="mt-[20px]">
              <p
                className="font-['Poppins'] font-normal text-[16px] text-[#808191]
            leading-[26px] text-justify"
              >
                {state.title}
              </p>
            </div>
          </div>
          <div>
            <h4
              className="font-['Poppins'] font-bold text-[16px] text-white
        uppercase"
            >
              Deskripsi Acara
            </h4>
            <div className="mt-[20px]">
              <p
                className="font-['Poppins'] font-normal text-[16px] text-[#808191]
            leading-[26px] text-justify"
              >
                {state.description}
              </p>
            </div>
          </div>

          <div>
            <h4
              className="font-['Poppins'] font-bold text-[18px] text-white
        uppercase"
            >
              List para donator
            </h4>
            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className="flex justify-between items-center gap-4"
                  >
                    <p className="font-['Poppins'] font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">
                      {index + 1}. {item.donator}
                    </p>
                    <p className="font-['Poppins'] font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{`${item.donation} BSC`}</p>
                  </div>
                ))
              ) : (
                <p
                  className="font-['Poppins'] font-normal text-[18px] text-[#808191]
            leading-[26px] text-justify"
                >
                  Belum ada donator, Ayo segera donasi!
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h4
            className="font-['Poppins'] font-bold text-[18px] text-white
        uppercase"
          >
            Donasi
          </h4>
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p
              className="font-['Poppins'] font-medium text-[20px] leading-[30px] text-center text-[#808191]
            "
            >
              Donasikan acara ini
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="BSC 0.1"
                min="0"
                max={state.target}
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] pc-[15px] outline-none border-[1px] border-[#3a3a43]
    bg-transparent font-['Poppins'] text-white text-[18px] leading-[30px] placeholder-text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                }}
              />
              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-['Poppins'] font-semibold text-[14px] leading-[22px] text-white">
                  Jika kamu peduli, maka teruslah berdonasi & berkontribusi ke acara yang diselenggarakan.
                </h4>
                <p className="mt-[20px] font-['Poppins'] font-normal leading-[22px] text-[#808191] ">
                  Dukung acara ini untuk keberlanjutan lingkungan!
                </p>
              </div>
              {isUserAdmin ? (
                <div>
                  <ReleaseButton
                    btnType="button"
                    title="Rilis Uang Donasi"
                    styles="w-full bg-[#3f37c9]"
                    handleClick={handleRelease}
                  />
                </div>
              ) : (
                <div>
                  <CustomButton
                    btnType="button"
                    title="Donasi"
                    styles="w-full bg-[#8c6dfd]"
                    handleClick={handleDonate}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
